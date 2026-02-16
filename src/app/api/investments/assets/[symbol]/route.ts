import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Country } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> },
) {
  const { symbol } = await params;
  const { searchParams } = new URL(request.url);
  const countryParam = searchParams.get("country");

  if (!countryParam) {
    return NextResponse.json({ error: "country is required" }, { status: 400 });
  }

  if (!Object.values(Country).includes(countryParam as Country)) {
    return NextResponse.json({ error: "country is invalid" }, { status: 400 });
  }

  const country = countryParam as Country;

  const asset = await prisma.asset.findUnique({
    where: {
      symbol_country: { symbol, country },
    },
    include: {
      fundamentals: { orderBy: { year: "asc" } },
      prices: { orderBy: { year: "asc" } },
    },
  });

  if (!asset) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  return NextResponse.json({ asset, meta: { percentUnit: "percent" } });
}
