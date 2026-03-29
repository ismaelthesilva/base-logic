"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { scoreAsset } from "@/lib/investments";

type Fundamentals = {
  year: number;
  receitaLiquida?: number | null;
  lucroLiquido?: number | null;
  roe?: number | null;
  margemLiquida?: number | null;
  dividaLiquida?: number | null;
  ebitda?: number | null;
  dividendPercentage?: number | null;
};

type Asset = {
  id: string;
  symbol: string;
  name: string;
  country: "USA" | "BRAZIL";
  type: "STOCK" | "ETF" | "REIT";
  dividendYield?: number | null;
  currentPrice?: number | null;
  latestFundamentals?: Fundamentals | null;
};

type AssetResponse = {
  items: Asset[];
};

type StatsResponse = {
  total: number;
  byCountry: { USA: number; BRAZIL: number };
  byType: { STOCK: number; ETF: number; REIT: number };
};

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/investments/stats");
        const data = await res.json();
        setStats(data);

        const assetsRes = await fetch("/api/investments/assets?limit=200");
        const assetsData: AssetResponse = await assetsRes.json();
        setAssets(assetsData.items || []);
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const topPicks = useMemo(() => {
    const scored = assets
      .map((asset) => ({
        asset,
        score: scoreAsset(asset, asset.latestFundamentals).total,
      }))
      .sort((a, b) => b.score - a.score);
    return scored.slice(0, 6);
  }, [assets]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Investments Dashboard</h1>
              <p className="text-muted-foreground">
                Overview of Brazil and USA assets powered by Neon.
              </p>
            </div>
            <Link href="/dashboard/investments">
              <Button>Browse Investments</Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {loading ? "—" : stats?.total ?? "—"}
                </div>
                <p className="text-muted-foreground text-sm">All markets</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>By Country</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>USA</span>
                  <span className="font-medium">
                    {loading ? "—" : stats?.byCountry.USA ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Brazil</span>
                  <span className="font-medium">
                    {loading ? "—" : stats?.byCountry.BRAZIL ?? "—"}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>By Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Stocks</span>
                  <span className="font-medium">
                    {loading ? "—" : stats?.byType.STOCK ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>ETFs</span>
                  <span className="font-medium">
                    {loading ? "—" : stats?.byType.ETF ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>REITs</span>
                  <span className="font-medium">
                    {loading ? "—" : stats?.byType.REIT ?? "—"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Picks (Educational)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {loading && (
                <div className="text-muted-foreground">Loading...</div>
              )}
              {!loading && topPicks.length === 0 && (
                <div className="text-muted-foreground">No assets yet.</div>
              )}
              {!loading && topPicks.length > 0 && (
                <div className="grid gap-3 md:grid-cols-2">
                  {topPicks.map(({ asset, score }) => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between border rounded-md px-4 py-3"
                    >
                      <div>
                        <div className="font-medium">{asset.symbol}</div>
                        <div className="text-muted-foreground text-xs">
                          {asset.name}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          Score {score}/4
                        </span>
                        <Link
                          href={`/dashboard/investments/${asset.symbol}?country=${asset.country}`}
                          className="text-primary text-sm"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Center</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Learn how to evaluate assets: focus on consistent ROE, stable
                margins, manageable debt-to-EBITDA, and sustainable dividends.
              </p>
              <p>Dividend Yield = Annual Dividend per Share ÷ Current Price.</p>
              <p>
                Debt / EBITDA = Net Debt ÷ EBITDA. Lower is generally safer.
              </p>
              <Link
                href="/dashboard/investments/learn"
                className="text-primary"
              >
                Open the full learning guide
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
