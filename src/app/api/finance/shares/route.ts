import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const shares = await prisma.share.findMany({ orderBy: { symbol: "asc" } });
  return NextResponse.json(shares);
}

export async function POST(request: Request) {
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

  if (!symbol || !name) {
    return NextResponse.json(
      { error: "symbol and name are required" },
      { status: 400 }
    );
  }

  const share = await prisma.share.create({
    data: {
      symbol: String(symbol).toUpperCase().trim(),
      name: String(name).trim(),
      receitaLiquida: receitaLiquida != null ? Number(receitaLiquida) : null,
      lucroLiquido: lucroLiquido != null ? Number(lucroLiquido) : null,
      roe: roe != null ? Number(roe) : null,
      margemLiquida: margemLiquida != null ? Number(margemLiquida) : null,
      debitEbitda: debitEbitda != null ? Number(debitEbitda) : null,
      dividendo: dividendo != null ? Number(dividendo) : null,
      notes: notes ? String(notes).trim() : null,
    },
  });

  return NextResponse.json(share, { status: 201 });
}
