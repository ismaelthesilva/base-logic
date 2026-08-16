import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth, unauthorized } from "@/lib/api-auth";

const DEFAULT_LIMIT = 500;
const MAX_BULK_ROWS = 2_000; // H4: cap bulk inserts

// M3: Strict input parsers — reject garbage before it reaches the DB
function parseDate(v: unknown, label: string): Date {
  const d = new Date(v as string);
  if (isNaN(d.getTime())) throw new Error(`${label}: invalid date "${v}"`);
  return d;
}

function parseAmount(v: unknown, label: string): number {
  const n = Number(v);
  if (!isFinite(n)) throw new Error(`${label}: invalid amount "${v}"`);
  return n;
}

function clamp(s: string, max: number): string {
  return String(s).slice(0, max).trim();
}

export async function GET(request: Request) {
  // C1: Require authentication
  const auth = await getAuth(request);
  if (!auth) return unauthorized();

  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");
  const currency = searchParams.get("currency");
  const category = searchParams.get("category");
  const month = searchParams.get("month"); // "YYYY-MM"
  const limitParam = searchParams.get("limit");
  const skip = Number(searchParams.get("skip") ?? 0);

  const limit = Math.min(
    limitParam !== null && Number.isFinite(Number(limitParam))
      ? Number(limitParam)
      : DEFAULT_LIMIT,
    1_000
  );

  // C2: Always scope to the authenticated user
  const where: Record<string, unknown> = { userId: auth.userId };
  if (tag) where.tag = { contains: tag, mode: "insensitive" };
  if (currency) where.currency = currency.toUpperCase().slice(0, 3);
  if (category) where.category = category;
  if (month) {
    const [year, m] = month.split("-").map(Number);
    where.date = {
      gte: new Date(year, m - 1, 1),
      lt: new Date(year, m, 1),
    };
  }

  try {
    const [transactions, total] = await Promise.all([
      prisma.financeTransaction.findMany({
        where,
        orderBy: { date: "desc" },
        take: limit,
        skip,
      }),
      prisma.financeTransaction.count({ where }),
    ]);

    return NextResponse.json({ items: transactions, total, skip, limit });
  } catch (err) {
    console.error("[finance/transactions GET]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // C1: Require authentication
  const auth = await getAuth(request);
  if (!auth) return unauthorized();

  // H3: CSRF — reject requests without Content-Type: application/json
  // (custom Content-Type triggers a CORS pre-flight for cross-origin callers)
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { error: "Unsupported Media Type" },
      { status: 415 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (Array.isArray(body)) {
    // H4: Cap bulk imports
    if (body.length > MAX_BULK_ROWS) {
      return NextResponse.json(
        {
          error: `Bulk import is limited to ${MAX_BULK_ROWS} rows per request`,
        },
        { status: 413 }
      );
    }

    const errors: string[] = [];
    const rows = body
      .filter((row) => row.date && row.title && row.amount != null)
      .map((row, i) => {
        try {
          const amt = parseAmount(row.amount, `row[${i}].amount`);
          return {
            userId: auth.userId, // C2: always attach to the authenticated user
            date: parseDate(row.date, `row[${i}].date`),
            category: row.category || (amt >= 0 ? "Income" : "Expense"),
            tag: clamp(row.tag || "Other", 80),
            title: clamp(row.title || "", 200),
            currency: clamp(row.currency || "USD", 3).toUpperCase(),
            amount: amt,
          };
        } catch (e) {
          errors.push((e as Error).message);
          return null;
        }
      })
      .filter(Boolean) as object[];

    if (errors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: errors.slice(0, 20) },
        { status: 422 }
      );
    }

    try {
      const CHUNK_SIZE = 200;
      let count = 0;
      for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
        const result = await prisma.financeTransaction.createMany({
          data: rows.slice(i, i + CHUNK_SIZE) as Parameters<
            typeof prisma.financeTransaction.createMany
          >[0]["data"],
        });
        count += result.count;
      }
      return NextResponse.json({ count }, { status: 201 });
    } catch (err) {
      console.error("[finance/transactions POST bulk]", err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }

  // Single-record path
  const row = body as Record<string, unknown>;
  if (!row.date || !row.title || row.amount == null) {
    return NextResponse.json(
      { error: "date, title and amount are required" },
      { status: 400 }
    );
  }

  try {
    const amt = parseAmount(row.amount, "amount");
    const tx = await prisma.financeTransaction.create({
      data: {
        userId: auth.userId, // C2
        date: parseDate(row.date, "date"),
        category: String(row.category || (amt >= 0 ? "Income" : "Expense")),
        tag: clamp(String(row.tag || "Other"), 80),
        title: clamp(String(row.title), 200),
        currency: clamp(String(row.currency || "USD"), 3).toUpperCase(),
        amount: amt,
      },
    });
    return NextResponse.json(tx, { status: 201 });
  } catch (err) {
    if ((err as Error).message.includes("invalid")) {
      return NextResponse.json(
        { error: (err as Error).message },
        { status: 422 }
      );
    }
    console.error("[finance/transactions POST]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
