import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_LIMIT = 500;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");
  const currency = searchParams.get("currency");
  const category = searchParams.get("category"); // "Income" | "Expense"
  const month = searchParams.get("month"); // "YYYY-MM"
  const limitParam = searchParams.get("limit");
  const skip = Number(searchParams.get("skip") ?? 0);

  const limit = Math.min(
    limitParam !== null && Number.isFinite(Number(limitParam))
      ? Number(limitParam)
      : DEFAULT_LIMIT,
    1000
  );

  const where: Record<string, unknown> = {};
  if (tag) where.tag = { contains: tag, mode: "insensitive" };
  if (currency) where.currency = currency.toUpperCase();
  if (category) where.category = category;
  if (month) {
    const [year, m] = month.split("-").map(Number);
    where.date = {
      gte: new Date(year, m - 1, 1),
      lt: new Date(year, m, 1),
    };
  }

  const [transactions, total] = await Promise.all([
    (prisma as any).financeTransaction.findMany({
      where,
      orderBy: { date: "desc" },
      take: limit,
      skip,
    }),
    (prisma as any).financeTransaction.count({ where }),
  ]);

  return NextResponse.json({ items: transactions, total, skip, limit });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (Array.isArray(body)) {
    const rows = body
      .filter((row) => row.date && row.title && row.amount != null)
      .map((row) => {
        const amt = Number(row.amount);
        return {
          date: new Date(row.date),
          category: row.category || (amt >= 0 ? "Income" : "Expense"),
          tag: String(row.tag || "Other").trim(),
          title: String(row.title || "").trim(),
          currency: String(row.currency || "USD")
            .trim()
            .toUpperCase(),
          amount: amt,
        };
      });

    const CHUNK_SIZE = 200;
    let count = 0;
    for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
      const result = await (prisma as any).financeTransaction.createMany({
        data: rows.slice(i, i + CHUNK_SIZE),
      });
      count += result.count;
    }

    return NextResponse.json({ count }, { status: 201 });
  }

  const { date, category, tag, title, currency, amount } = body;
  if (!date || !title || amount == null) {
    return NextResponse.json(
      { error: "date, title and amount are required" },
      { status: 400 }
    );
  }

  const amt = Number(amount);
  const tx = await (prisma as any).financeTransaction.create({
    data: {
      date: new Date(date),
      category: category || (amt >= 0 ? "Income" : "Expense"),
      tag: String(tag || "Other").trim(),
      title: String(title).trim(),
      currency: String(currency || "USD")
        .trim()
        .toUpperCase(),
      amount: amt,
    },
  });

  return NextResponse.json(tx, { status: 201 });
}
