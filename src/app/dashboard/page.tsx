"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatLargeNumber } from "@/lib/format";

// ─── Types ────────────────────────────────────────────────────────────────────

type MonthlyPoint = { month: string; income: number; expense: number };

type StatsData = {
  monthly: MonthlyPoint[];
  currentMonthIncome: number;
  currentMonthExpense: number;
  currentMonthNet: number;
};

type Transaction = {
  id: string;
  date: string;
  category: string;
  tag: string;
  title: string;
  currency: string;
  amount: number;
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  icon,
  color,
  sub,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  sub?: string;
}) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-zinc-400 uppercase tracking-wider">
            {label}
          </span>
          <div className={`p-2 rounded-md ${color}`}>{icon}</div>
        </div>
        <div className="text-2xl font-bold text-white">{value}</div>
        {sub && <div className="text-xs text-zinc-500 mt-1">{sub}</div>}
      </CardContent>
    </Card>
  );
}

// ─── Custom chart tooltip ──────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs space-y-1">
      <p className="text-zinc-300 font-medium">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OverviewPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [recentTx, setRecentTx] = useState<Transaction[]>([]);
  const [shareCount, setShareCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/finance/transactions/stats?months=12").then((r) => r.json()),
      fetch("/api/finance/transactions?limit=10").then((r) => r.json()),
      fetch("/api/finance/shares").then((r) => r.json()),
    ])
      .then(([s, txs, shares]) => {
        setStats(s);
        setRecentTx(Array.isArray(txs?.items) ? txs.items.slice(0, 10) : []);
        setShareCount(Array.isArray(shares) ? shares.length : 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalIncome = stats?.monthly.reduce((sum, m) => sum + m.income, 0) ?? 0;
  const totalExpense =
    stats?.monthly.reduce((sum, m) => sum + m.expense, 0) ?? 0;

  const pieData = [
    { name: "Income", value: totalIncome, color: "#10b981" },
    { name: "Expenses", value: totalExpense, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  const chartData = (stats?.monthly ?? []).map((m) => ({
    ...m,
    month: m.month.slice(5),
  }));

  const currentMonth = new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-sm text-zinc-400 mt-1">{currentMonth}</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Income (this month)"
          value={loading ? "…" : formatCurrency(stats?.currentMonthIncome ?? 0)}
          icon={<TrendingUp className="h-4 w-4 text-emerald-400" />}
          color="bg-emerald-900/40"
          sub="Current month"
        />
        <KpiCard
          label="Expenses (this month)"
          value={
            loading ? "…" : formatCurrency(stats?.currentMonthExpense ?? 0)
          }
          icon={<TrendingDown className="h-4 w-4 text-red-400" />}
          color="bg-red-900/40"
          sub="Current month"
        />
        <KpiCard
          label="Net Balance"
          value={loading ? "…" : formatCurrency(stats?.currentMonthNet ?? 0)}
          icon={<DollarSign className="h-4 w-4 text-blue-400" />}
          color="bg-blue-900/40"
          sub={
            (stats?.currentMonthNet ?? 0) >= 0
              ? "Positive cash flow"
              : "Negative cash flow"
          }
        />
        <KpiCard
          label="Shares Tracked"
          value={loading ? "…" : String(shareCount)}
          icon={<BarChart3 className="h-4 w-4 text-purple-400" />}
          color="bg-purple-900/40"
          sub="Watchlist"
        />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Bar chart */}
        <Card className="bg-zinc-900 border-zinc-800 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">
              Income vs Expenses — Last 12 Months
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-48 flex items-center justify-center text-zinc-500 text-sm">
                Loading…
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={chartData}
                  margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#71717a" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#71717a" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => formatLargeNumber(v)}
                    width={48}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar
                    dataKey="income"
                    name="Income"
                    fill="#10b981"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="expense"
                    name="Expenses"
                    fill="#ef4444"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pie chart */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">
              All-time Split
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-48 flex items-center justify-center text-zinc-500 text-sm">
                Loading…
              </div>
            ) : pieData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-zinc-500 text-sm">
                No data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    formatter={(value) => (
                      <span className="text-xs text-zinc-400">{value}</span>
                    )}
                  />
                  <Tooltip
                    formatter={(v: number) => formatCurrency(v)}
                    contentStyle={{
                      background: "#18181b",
                      border: "1px solid #3f3f46",
                      borderRadius: 8,
                    }}
                    labelStyle={{ color: "#a1a1aa" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent transactions */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-zinc-300">
            Recent Transactions
          </CardTitle>
          <Link
            href="/dashboard/transactions"
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-zinc-500 text-sm py-4 text-center">
              Loading…
            </div>
          ) : recentTx.length === 0 ? (
            <div className="text-zinc-500 text-sm py-4 text-center">
              No transactions yet.{" "}
              <Link
                href="/dashboard/transactions"
                className="text-emerald-400 hover:underline"
              >
                Add one
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              {recentTx.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      className={`text-xs px-2 py-0 ${
                        tx.category === "Income"
                          ? "bg-emerald-900/50 text-emerald-400 border-emerald-700"
                          : "bg-red-900/50 text-red-400 border-red-700"
                      }`}
                    >
                      {tx.tag || tx.category}
                    </Badge>
                    <span className="text-sm text-zinc-300 truncate max-w-48">
                      {tx.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-zinc-500">
                      {new Date(tx.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span
                      className={`text-sm font-medium tabular-nums ${
                        tx.category === "Income"
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {tx.category === "Income" ? "+" : "-"}
                      {formatCurrency(Math.abs(tx.amount))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
