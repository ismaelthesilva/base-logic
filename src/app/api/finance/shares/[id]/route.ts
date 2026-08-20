import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth, unauthorized } from "@/lib/api-auth";
import { computePassesFilter } from "@/lib/shares"; // M4: single source of truth

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

  try {
    // M4: Fetch the existing record first so that partial updates don't
    // incorrectly recalculate passesFilter against null for unchanged fields.
    const existing = await prisma.share.findUniqueOrThrow({ where: { id } });

    const merged = {
      roe: roe != null ? Number(roe) : existing.roe,
      margemLiquida:
        margemLiquida != null ? Number(margemLiquida) : existing.margemLiquida,
      debitEbitda:
        debitEbitda != null ? Number(debitEbitda) : existing.debitEbitda,
      dividendo: dividendo != null ? Number(dividendo) : existing.dividendo,
    };

    const data = {
      ...(symbol && { symbol: String(symbol).toUpperCase().trim() }),
      ...(name && { name: String(name).trim() }),
      sector:
        sector !== undefined
          ? sector
            ? String(sector).trim()
            : null
          : undefined,
      receitaLiquida:
        receitaLiquida != null
          ? Number(receitaLiquida)
          : existing.receitaLiquida,
      lucroLiquido:
        lucroLiquido != null ? Number(lucroLiquido) : existing.lucroLiquido,
      roe: merged.roe,
      margemLiquida: merged.margemLiquida,
      debitEbitda: merged.debitEbitda,
      ebitda: ebitda != null ? Number(ebitda) : existing.ebitda,
      dividendo: merged.dividendo,
      period:
        period !== undefined
          ? period
            ? String(period).trim()
            : null
          : undefined,
      notes:
        notes !== undefined
          ? notes
            ? String(notes).trim().slice(0, 1000)
            : null
          : undefined,
      // M4: Recalculate against the fully-merged (existing + incoming) values
      passesFilter: computePassesFilter(merged),
    };

    const share = await prisma.share.update({ where: { id }, data });
    return NextResponse.json(share);
  } catch (err) {
    if ((err as { code?: string }).code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("[finance/shares/:id PUT]", err);
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
    await prisma.share.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if ((err as { code?: string }).code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("[finance/shares/:id DELETE]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
