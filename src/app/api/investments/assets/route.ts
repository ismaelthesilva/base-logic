import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MAX_LIMIT = 200;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");
  const type = searchParams.get("type");
  const riskLevel = searchParams.get("riskLevel");
  const q = searchParams.get("q");
  const limitParam = searchParams.get("limit");
  const cursor = searchParams.get("cursor");

  const limit = Math.min(
    Number.isFinite(Number(limitParam)) ? Number(limitParam) : 50,
    MAX_LIMIT
  );

  const where: any = {};
  if (country) where.country = country;
  if (type) where.type = type;
  if (riskLevel) where.riskLevel = riskLevel;
  if (q) {
    where.OR = [
      { symbol: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
    ];
  }

  const assets = await prisma.asset.findMany({
    where,
    take: limit + 1,
    ...(cursor
      ? {
          cursor: { id: cursor },
          skip: 1,
        }
      : {}),
    orderBy: { symbol: "asc" },
    include: {
      fundamentals: { orderBy: { year: "desc" }, take: 1 },
      prices: { orderBy: { year: "desc" }, take: 1 },
    },
  });

  const hasNext = assets.length > limit;
  const items = hasNext ? assets.slice(0, limit) : assets;
  const nextCursor = hasNext ? items[items.length - 1]?.id : null;

  const data = items.map((asset) => {
    const latestFundamentals = asset.fundamentals[0] || null;
    const latestPrice = asset.prices[0] || null;

    return {
      id: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      description: asset.description,
      country: asset.country,
      type: asset.type,
      riskLevel: asset.riskLevel,
      expenseRatio: asset.expenseRatio,
      dividendYield: asset.dividendYield,
      currentPrice: asset.currentPrice,
      latestPrice,
      latestFundamentals,
    };
  });

  return NextResponse.json({
    items: data,
    nextCursor,
    meta: { percentUnit: "percent" },
  });
}
