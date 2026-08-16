import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth, unauthorized } from "@/lib/api-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // C1: Require authentication
  const auth = await getAuth(request);
  if (!auth) return unauthorized();

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { date, category, tag, title, currency, amount } = body;

  try {
    // C2: Verify this transaction belongs to the authenticated user before updating
    const existing = await prisma.financeTransaction.findUnique({
      where: { id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (existing.userId !== null && existing.userId !== auth.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const tx = await prisma.financeTransaction.update({
      where: { id },
      data: {
        ...(date && { date: new Date(date as string) }),
        ...(category && { category: String(category).slice(0, 50) }),
        ...(tag !== undefined && { tag: String(tag).slice(0, 80).trim() }),
        ...(title && { title: String(title).slice(0, 200).trim() }),
        ...(currency && {
          currency: String(currency).slice(0, 3).trim().toUpperCase(),
        }),
        ...(amount !== undefined && { amount: Number(amount) }),
      },
    });
    return NextResponse.json(tx);
  } catch (err) {
    console.error("[finance/transactions/:id PUT]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // C1: Require authentication
  const auth = await getAuth(request);
  if (!auth) return unauthorized();

  const { id } = await params;

  try {
    // C2: Verify ownership before deleting
    const existing = await prisma.financeTransaction.findUnique({
      where: { id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (existing.userId !== null && existing.userId !== auth.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.financeTransaction.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[finance/transactions/:id DELETE]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
