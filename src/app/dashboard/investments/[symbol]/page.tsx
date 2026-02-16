"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { getScoreLabel, scoreAsset } from "@/lib/investments";

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

type AssetPrice = {
  year: number;
  price?: number | null;
};

type Asset = {
  id: string;
  symbol: string;
  name: string;
  description?: string | null;
  country: "USA" | "BRAZIL";
  type: "STOCK" | "ETF" | "REIT";
  riskLevel?: string | null;
  dividendYield?: number | null;
  currentPrice?: number | null;
  fundamentals: Fundamentals[];
  prices: AssetPrice[];
};

type AssetResponse = {
  asset: Asset;
};

export default function AssetDetailPage({
  params,
}: {
  params: { symbol: string };
}) {
  const searchParams = useSearchParams();
  const country = searchParams.get("country") || "USA";

  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `/api/investments/assets/${params.symbol}?country=${country}`,
        );
        const data: AssetResponse = await res.json();
        setAsset(data.asset || null);
      } catch (error) {
        console.error("Failed to load asset", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [params.symbol, country]);

  const latest = useMemo(() => {
    if (!asset?.fundamentals?.length) return null;
    return asset.fundamentals[asset.fundamentals.length - 1];
  }, [asset]);

  const qualityScore = useMemo(() => {
    if (!asset || !latest) return null;
    const scored = scoreAsset(asset, latest);
    const label = getScoreLabel(scored.total);
    return { ...scored, ...label };
  }, [asset, latest]);

  const debtToEbitda = qualityScore?.debtToEbitda ?? null;

  const currency = asset?.country === "BRAZIL" ? "BRL" : "USD";

  const roeSeries = useMemo(() => {
    if (!asset?.fundamentals?.length) return [] as Fundamentals[];
    return asset.fundamentals;
  }, [asset]);

  const marginSeries = useMemo(() => {
    if (!asset?.fundamentals?.length) return [] as Fundamentals[];
    return asset.fundamentals;
  }, [asset]);

  const maxRoe = useMemo(() => {
    const values = roeSeries
      .map((row) => row.roe ?? 0)
      .filter((value) => Number.isFinite(value));
    return values.length ? Math.max(...values) : 0;
  }, [roeSeries]);

  const maxMargin = useMemo(() => {
    const values = marginSeries
      .map((row) => row.margemLiquida ?? 0)
      .filter((value) => Number.isFinite(value));
    return values.length ? Math.max(...values) : 0;
  }, [marginSeries]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                {asset?.symbol || params.symbol}
              </h1>
              <p className="text-muted-foreground">{asset?.name}</p>
            </div>
            <Link href="/dashboard/investments">
              <Button variant="outline">Back to Investments</Button>
            </Link>
          </div>

          {loading && <div className="text-muted-foreground">Loading...</div>}

          {!loading && !asset && (
            <div className="text-muted-foreground">Asset not found.</div>
          )}

          {asset && (
            <>
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Price</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(asset.currentPrice, currency)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Dividend Yield: {formatPercent(asset.dividendYield)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Latest Fundamentals</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>ROE</span>
                      <span>{formatPercent(latest?.roe)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Margin</span>
                      <span>{formatPercent(latest?.margemLiquida)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Debt/EBITDA</span>
                      <span>{formatNumber(debtToEbitda)}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Country</span>
                      <span>{asset.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type</span>
                      <span>{asset.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk</span>
                      <span>{asset.riskLevel || "—"}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Financial History (2019–2023)</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2 pr-4">Year</th>
                        <th className="py-2 pr-4">Receita L.</th>
                        <th className="py-2 pr-4">Lucro L.</th>
                        <th className="py-2 pr-4">ROE</th>
                        <th className="py-2 pr-4">Margem L.</th>
                        <th className="py-2 pr-4">Dívida L.</th>
                        <th className="py-2 pr-4">EBITDA</th>
                        <th className="py-2 pr-4">Dividendo %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {asset.fundamentals.map((row) => (
                        <tr key={row.year} className="border-b last:border-0">
                          <td className="py-2 pr-4 font-medium">{row.year}</td>
                          <td className="py-2 pr-4">
                            {formatNumber(row.receitaLiquida)}
                          </td>
                          <td className="py-2 pr-4">
                            {formatNumber(row.lucroLiquido)}
                          </td>
                          <td className="py-2 pr-4">
                            {formatPercent(row.roe)}
                          </td>
                          <td className="py-2 pr-4">
                            {formatPercent(row.margemLiquida)}
                          </td>
                          <td className="py-2 pr-4">
                            {formatNumber(row.dividaLiquida)}
                          </td>
                          <td className="py-2 pr-4">
                            {formatNumber(row.ebitda)}
                          </td>
                          <td className="py-2 pr-4">
                            {formatPercent(row.dividendPercentage)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>ROE Trend</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {roeSeries.length === 0 && (
                      <div className="text-sm text-muted-foreground">
                        No ROE data.
                      </div>
                    )}
                    {roeSeries.length > 0 && (
                      <div className="flex items-end gap-3 h-40">
                        {roeSeries.map((row) => {
                          const value = row.roe ?? 0;
                          const height =
                            maxRoe > 0 ? (value / maxRoe) * 100 : 0;
                          return (
                            <div key={row.year} className="flex-1 text-center">
                              <div
                                className="bg-primary/80 rounded-md w-full"
                                style={{ height: `${height}%` }}
                                title={`${row.year}: ${formatPercent(value)}`}
                              />
                              <div className="text-xs text-muted-foreground mt-2">
                                {row.year}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Net Margin Trend</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {marginSeries.length === 0 && (
                      <div className="text-sm text-muted-foreground">
                        No margin data.
                      </div>
                    )}
                    {marginSeries.length > 0 && (
                      <div className="flex items-end gap-3 h-40">
                        {marginSeries.map((row) => {
                          const value = row.margemLiquida ?? 0;
                          const height =
                            maxMargin > 0 ? (value / maxMargin) * 100 : 0;
                          return (
                            <div key={row.year} className="flex-1 text-center">
                              <div
                                className="bg-emerald-500/80 rounded-md w-full"
                                style={{ height: `${height}%` }}
                                title={`${row.year}: ${formatPercent(value)}`}
                              />
                              <div className="text-xs text-muted-foreground mt-2">
                                {row.year}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Panel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    Dividend Yield = Annual Dividend per Share ÷ Current Price.
                  </p>
                  <p>Debt / EBITDA = Net Debt ÷ EBITDA.</p>
                  <p>
                    Strong assets tend to have consistent ROE, stable margins,
                    and manageable debt levels.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Is it good to buy?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Quality Score</span>
                    <span
                      className={`font-semibold ${qualityScore?.tone || ""}`}
                    >
                      {qualityScore
                        ? `${qualityScore.total}/4 · ${qualityScore.label}`
                        : "—"}
                    </span>
                  </div>
                  <ul className="space-y-1 text-muted-foreground">
                    {qualityScore?.parts.map((part) => (
                      <li
                        key={part.label}
                        className="flex items-center justify-between"
                      >
                        <span>{part.label}</span>
                        <span>{part.pass ? "✅" : "⚠️"}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-muted-foreground">
                    This is an educational checklist, not financial advice.
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
