import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const {
    symbol,
    name,
    receitaLiquida,
    lucroLiquido,
    roe,
    margemLiquida,
    debitEbitda,
    dividendo,
    notes,
  } = body;

  const share = await prisma.share.update({
    where: { id },
    data: {
      ...(symbol && { symbol: String(symbol).toUpperCase().trim() }),
      ...(name && { name: String(name).trim() }),
      receitaLiquida: receitaLiquida != null ? Number(receitaLiquida) : null,
      lucroLiquido: lucroLiquido != null ? Number(lucroLiquido) : null,
      roe: roe != null ? Number(roe) : null,
      margemLiquida: margemLiquida != null ? Number(margemLiquida) : null,
      debitEbitda: debitEbitda != null ? Number(debitEbitda) : null,
      dividendo: dividendo != null ? Number(dividendo) : null,
      notes:
        notes !== undefined ? (notes ? String(notes).trim() : null) : undefined,
    },
  });

  return NextResponse.json(share);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.share.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
