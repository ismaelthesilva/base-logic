import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");
  const currency = searchParams.get("currency");

  const where: Record<string, unknown> = {};
  if (tag) where.tag = { contains: tag, mode: "insensitive" };
  if (currency) where.currency = currency.toUpperCase();

  const transactions = await (prisma as any).financeTransaction.findMany({
    where,
    orderBy: { date: "desc" },
  });

  return NextResponse.json(transactions);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (Array.isArray(body)) {
    // Bulk insert from CSV upload
    const data = body
      .filter((row) => row.date && row.title && row.amount != null)
      .map((row) => ({
        date: new Date(row.date),
        tag: String(row.tag || "Other").trim(),
        title: String(row.title || "").trim(),
        currency: String(row.currency || "USD")
          .trim()
          .toUpperCase(),
        amount: Number(row.amount),
      }));

    const result = await (prisma as any).financeTransaction.createMany({
      data,
    });
    return NextResponse.json({ count: result.count }, { status: 201 });
  }

  const { date, tag, title, currency, amount } = body;
  if (!date || !title || amount == null) {
    return NextResponse.json(
      { error: "date, title and amount are required" },
      { status: 400 }
    );
  }

  const tx = await (prisma as any).financeTransaction.create({
    data: {
      date: new Date(date),
      tag: String(tag || "Other").trim(),
      title: String(title).trim(),
      currency: String(currency || "USD")
        .trim()
        .toUpperCase(),
      amount: Number(amount),
    },
  });

  return NextResponse.json(tx, { status: 201 });
}
