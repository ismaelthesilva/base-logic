import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function computePassesFilter(data: {
  roe?: number | null;
  margemLiquida?: number | null;
  debitEbitda?: number | null;
  dividendo?: number | null;
}): boolean {
  const { roe, margemLiquida, debitEbitda, dividendo } = data;
  return (
    roe != null &&
    roe >= 15 &&
    margemLiquida != null &&
    margemLiquida >= 15 &&
    debitEbitda != null &&
    debitEbitda <= 3 &&
    dividendo != null &&
    dividendo >= 10
  );
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const {
    symbol,
    name,
    sector,
    receitaLiquida,
    lucroLiquido,
    roe,
    margemLiquida,
    debitEbitda,
    ebitda,
    dividendo,
    period,
    notes,
  } = body;

  const data = {
    ...(symbol && { symbol: String(symbol).toUpperCase().trim() }),
    ...(name && { name: String(name).trim() }),
    sector:
      sector !== undefined
        ? sector
          ? String(sector).trim()
          : null
        : undefined,
    receitaLiquida: receitaLiquida != null ? Number(receitaLiquida) : null,
    lucroLiquido: lucroLiquido != null ? Number(lucroLiquido) : null,
    roe: roe != null ? Number(roe) : null,
    margemLiquida: margemLiquida != null ? Number(margemLiquida) : null,
    debitEbitda: debitEbitda != null ? Number(debitEbitda) : null,
    ebitda: ebitda != null ? Number(ebitda) : null,
    dividendo: dividendo != null ? Number(dividendo) : null,
    period:
      period !== undefined
        ? period
          ? String(period).trim()
          : null
        : undefined,
    notes:
      notes !== undefined ? (notes ? String(notes).trim() : null) : undefined,
    passesFilter: computePassesFilter({
      roe: roe != null ? Number(roe) : null,
      margemLiquida: margemLiquida != null ? Number(margemLiquida) : null,
      debitEbitda: debitEbitda != null ? Number(debitEbitda) : null,
      dividendo: dividendo != null ? Number(dividendo) : null,
    }),
  };

  const share = await prisma.share.update({ where: { id }, data });
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
