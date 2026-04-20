import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Buffett criteria
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const passesOnly = searchParams.get("passesFilter") === "true";

  const shares = await prisma.share.findMany({
    where: passesOnly ? { passesFilter: true } : undefined,
    orderBy: { symbol: "asc" },
  });
  return NextResponse.json(shares);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (Array.isArray(body)) {
    // Bulk upsert from CSV
    const results = await Promise.all(
      body
        .filter((row) => row.symbol && row.name)
        .map((row) => {
          const data = {
            symbol: String(row.symbol).toUpperCase().trim(),
            name: String(row.name).trim(),
            sector: row.sector ? String(row.sector).trim() : null,
            receitaLiquida:
              row.receitaLiquida != null ? Number(row.receitaLiquida) : null,
            lucroLiquido:
              row.lucroLiquido != null ? Number(row.lucroLiquido) : null,
            roe: row.roe != null ? Number(row.roe) : null,
            margemLiquida:
              row.margemLiquida != null ? Number(row.margemLiquida) : null,
            debitEbitda:
              row.debitEbitda != null ? Number(row.debitEbitda) : null,
            ebitda: row.ebitda != null ? Number(row.ebitda) : null,
            dividendo: row.dividendo != null ? Number(row.dividendo) : null,
            period: row.period ? String(row.period).trim() : null,
            notes: row.notes ? String(row.notes).trim() : null,
            passesFilter: false as boolean,
          };
          data.passesFilter = computePassesFilter(data);
          return prisma.share.upsert({
            where: { symbol: data.symbol },
            create: data,
            update: data,
          });
        })
    );
    return NextResponse.json({ count: results.length }, { status: 201 });
  }

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

  if (!symbol || !name) {
    return NextResponse.json(
      { error: "symbol and name are required" },
      { status: 400 }
    );
  }

  const data = {
    symbol: String(symbol).toUpperCase().trim(),
    name: String(name).trim(),
    sector: sector ? String(sector).trim() : null,
    receitaLiquida: receitaLiquida != null ? Number(receitaLiquida) : null,
    lucroLiquido: lucroLiquido != null ? Number(lucroLiquido) : null,
    roe: roe != null ? Number(roe) : null,
    margemLiquida: margemLiquida != null ? Number(margemLiquida) : null,
    debitEbitda: debitEbitda != null ? Number(debitEbitda) : null,
    ebitda: ebitda != null ? Number(ebitda) : null,
    dividendo: dividendo != null ? Number(dividendo) : null,
    period: period ? String(period).trim() : null,
    notes: notes ? String(notes).trim() : null,
    passesFilter: false as boolean,
  };
  data.passesFilter = computePassesFilter(data);

  const share = await prisma.share.upsert({
    where: { symbol: data.symbol },
    create: data,
    update: data,
  });

  return NextResponse.json(share, { status: 201 });
}
