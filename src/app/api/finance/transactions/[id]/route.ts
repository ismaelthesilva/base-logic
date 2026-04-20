import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { date, category, tag, title, currency, amount } = body;

  const tx = await (prisma as any).financeTransaction.update({
    where: { id },
    data: {
      ...(date && { date: new Date(date) }),
      ...(category && { category: String(category) }),
      ...(tag !== undefined && { tag: String(tag) }),
      ...(title && { title: String(title) }),
      ...(currency && { currency: String(currency) }),
      ...(amount !== undefined && { amount: Number(amount) }),
    },
  });
  return NextResponse.json(tx);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await (prisma as any).financeTransaction.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
