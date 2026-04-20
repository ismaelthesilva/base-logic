import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Returns monthly income/expense aggregates for the last N months
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const months = Math.min(parseInt(searchParams.get("months") || "12"), 24);

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

  const txs = await (prisma as any).financeTransaction.findMany({
    where: { date: { gte: start } },
    select: { date: true, amount: true, category: true },
    orderBy: { date: "asc" },
  });

  // Group by month
  const map: Record<
    string,
    { month: string; income: number; expense: number }
  > = {};

  for (const tx of txs) {
    const d = new Date(tx.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    if (!map[key]) map[key] = { month: key, income: 0, expense: 0 };
    const amt = Math.abs(tx.amount);
    if (tx.category === "Income") {
      map[key].income += amt;
    } else {
      map[key].expense += amt;
    }
  }

  const monthly = Object.values(map).sort((a, b) =>
    a.month.localeCompare(b.month)
  );

  // Current month totals
  const currentKey = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;
  const current = map[currentKey] || { income: 0, expense: 0 };

  return NextResponse.json({
    monthly,
    currentMonthIncome: current.income,
    currentMonthExpense: current.expense,
    currentMonthNet: current.income - current.expense,
  });
}
