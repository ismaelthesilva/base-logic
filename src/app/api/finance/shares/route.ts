import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth, unauthorized } from "@/lib/api-auth";
import { computePassesFilter } from "@/lib/shares"; // M4: single source of truth

export async function GET(request: Request) {
  // C1: Require authentication
  const auth = await getAuth(request);
  if (!auth) return unauthorized();

  const { searchParams } = new URL(request.url);
  const passesOnly = searchParams.get("passesFilter") === "true";

  try {
    const shares = await prisma.share.findMany({
      where: passesOnly ? { passesFilter: true } : undefined,
      orderBy: { symbol: "asc" },
    });
    return NextResponse.json(shares);
  } catch (err) {
    console.error("[finance/shares GET]", err);
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (Array.isArray(body)) {
    const rows = body
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
          debitEbitda: row.debitEbitda != null ? Number(row.debitEbitda) : null,
          ebitda: row.ebitda != null ? Number(row.ebitda) : null,
          dividendo: row.dividendo != null ? Number(row.dividendo) : null,
          period: row.period ? String(row.period).trim() : null,
          notes: row.notes ? String(row.notes).trim().slice(0, 1000) : null,
          passesFilter: false as boolean,
        };
        data.passesFilter = computePassesFilter(data); // M4: shared fn
        return data;
      });

    try {
      const CHUNK_SIZE = 50;
      let count = 0;
      for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
        const chunk = rows.slice(i, i + CHUNK_SIZE);
        await prisma.$transaction(
          chunk.map((data) =>
            prisma.share.upsert({
              where: { symbol: data.symbol },
              create: data,
              update: data,
            })
          )
        );
        count += chunk.length;
      }
      return NextResponse.json({ count }, { status: 201 });
    } catch (err) {
      console.error("[finance/shares POST bulk]", err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }

  const row = body as Record<string, unknown>;
  if (!row.symbol || !row.name) {
    return NextResponse.json(
      { error: "symbol and name are required" },
      { status: 400 }
    );
  }

  const data = {
    symbol: String(row.symbol).toUpperCase().trim(),
    name: String(row.name).trim(),
    sector: row.sector ? String(row.sector).trim() : null,
    receitaLiquida:
      row.receitaLiquida != null ? Number(row.receitaLiquida) : null,
    lucroLiquido: row.lucroLiquido != null ? Number(row.lucroLiquido) : null,
    roe: row.roe != null ? Number(row.roe) : null,
    margemLiquida: row.margemLiquida != null ? Number(row.margemLiquida) : null,
    debitEbitda: row.debitEbitda != null ? Number(row.debitEbitda) : null,
    ebitda: row.ebitda != null ? Number(row.ebitda) : null,
    dividendo: row.dividendo != null ? Number(row.dividendo) : null,
    period: row.period ? String(row.period).trim() : null,
    notes: row.notes ? String(row.notes).trim().slice(0, 1000) : null,
    passesFilter: false as boolean,
  };
  data.passesFilter = computePassesFilter(data); // M4: shared fn

  try {
    const share = await prisma.share.upsert({
      where: { symbol: data.symbol },
      create: data,
      update: data,
    });
    return NextResponse.json(share, { status: 201 });
  } catch (err) {
    console.error("[finance/shares POST]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
