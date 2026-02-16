import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [total, usa, brazil, stocks, etfs, reits] = await Promise.all([
    prisma.asset.count(),
    prisma.asset.count({ where: { country: "USA" } }),
    prisma.asset.count({ where: { country: "BRAZIL" } }),
    prisma.asset.count({ where: { type: "STOCK" } }),
    prisma.asset.count({ where: { type: "ETF" } }),
    prisma.asset.count({ where: { type: "REIT" } }),
  ]);

  return NextResponse.json({
    total,
    byCountry: { USA: usa, BRAZIL: brazil },
    byType: { STOCK: stocks, ETF: etfs, REIT: reits },
  });
}
