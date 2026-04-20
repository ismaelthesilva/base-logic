import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");
  const currency = searchParams.get("currency");
  const category = searchParams.get("category"); // "Income" | "Expense"
  const month = searchParams.get("month"); // "YYYY-MM"

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

  const transactions = await (prisma as any).financeTransaction.findMany({
    where,
    orderBy: { date: "desc" },
  });

  return NextResponse.json(transactions);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (Array.isArray(body)) {
    const data = body
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

    const result = await (prisma as any).financeTransaction.createMany({
      data,
    });
    return NextResponse.json({ count: result.count }, { status: 201 });
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
