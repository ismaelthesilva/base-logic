import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } },
) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");

  if (!country) {
    return NextResponse.json({ error: "country is required" }, { status: 400 });
  }

  const asset = await prisma.asset.findUnique({
    where: {
      symbol_country: { symbol: params.symbol, country },
    },
    include: {
      fundamentals: { orderBy: { year: "asc" } },
      prices: { orderBy: { year: "asc" } },
    },
  });

  if (!asset) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  return NextResponse.json({ asset });
}
