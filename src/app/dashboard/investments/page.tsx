"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
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
  riskLevel?: string | null;
  dividendYield?: number | null;
  currentPrice?: number | null;
  latestFundamentals?: Fundamentals | null;
};

type AssetResponse = {
  items: Asset[];
  nextCursor: string | null;
};

const countryOptions = [
  { value: "", label: "All countries" },
  { value: "USA", label: "USA" },
  { value: "BRAZIL", label: "Brazil" },
];

const typeOptions = [
  { value: "", label: "All types" },
  { value: "STOCK", label: "Stocks" },
  { value: "ETF", label: "ETFs" },
  { value: "REIT", label: "REITs" },
];

export default function InvestmentsPage() {
  const [items, setItems] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState("");
  const [type, setType] = useState("");
  const [risk, setRisk] = useState("");
  const [query, setQuery] = useState("");

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (country) params.set("country", country);
      if (type) params.set("type", type);
      if (risk) params.set("riskLevel", risk);
      if (query) params.set("q", query);
      params.set("limit", "100");

      const res = await fetch(`/api/investments/assets?${params.toString()}`);
      const data: AssetResponse = await res.json();
      setItems(data.items || []);
    } catch (error) {
      console.error("Failed to load assets", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [country, type, risk]);

  const filtered = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.symbol.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q)
    );
  }, [items, query]);

  const riskOptions = [
    { value: "", label: "All risk levels" },
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Investments</h1>
              <p className="text-muted-foreground">
                Filter and explore assets in Brazil and USA.
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/investments/learn">
                <Button variant="outline">Learn</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <select
                  id="country"
                  className="w-full border border-input rounded-md h-10 px-3 bg-background"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {countryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  className="w-full border border-input rounded-md h-10 px-3 bg-background"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  {typeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="risk">Risk</Label>
                <select
                  id="risk"
                  className="w-full border border-input rounded-md h-10 px-3 bg-background"
                  value={risk}
                  onChange={(e) => setRisk(e.target.value)}
                >
                  {riskOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Symbol or name"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading && (
                <div className="text-muted-foreground">Loading...</div>
              )}
              {!loading && filtered.length === 0 && (
                <div className="text-muted-foreground">No assets found.</div>
              )}
              {!loading && filtered.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2 pr-4">Symbol</th>
                        <th className="py-2 pr-4">Name</th>
                        <th className="py-2 pr-4">Price</th>
                        <th className="py-2 pr-4">Dividend</th>
                        <th className="py-2 pr-4">ROE</th>
                        <th className="py-2 pr-4">Margin</th>
                        <th className="py-2 pr-4">Debt/EBITDA</th>
                        <th className="py-2 pr-4">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((asset) => {
                        const fundamentals = asset.latestFundamentals;
                        const debtToEbitda =
                          fundamentals?.dividaLiquida && fundamentals?.ebitda
                            ? fundamentals.dividaLiquida / fundamentals.ebitda
                            : null;

                        const currency =
                          asset.country === "USA" ? "USD" : "BRL";
                        const score = scoreAsset(
                          asset,
                          asset.latestFundamentals
                        ).total;

                        return (
                          <tr key={asset.id} className="border-b last:border-0">
                            <td className="py-3 pr-4 font-medium">
                              <Link
                                href={`/dashboard/investments/${asset.symbol}?country=${asset.country}`}
                                className="text-primary hover:underline"
                              >
                                {asset.symbol}
                              </Link>
                            </td>
                            <td className="py-3 pr-4">{asset.name}</td>
                            <td className="py-3 pr-4">
                              {formatCurrency(asset.currentPrice, currency)}
                            </td>
                            <td className="py-3 pr-4">
                              {formatPercent(asset.dividendYield)}
                            </td>
                            <td className="py-3 pr-4">
                              {formatPercent(fundamentals?.roe)}
                            </td>
                            <td className="py-3 pr-4">
                              {formatPercent(fundamentals?.margemLiquida)}
                            </td>
                            <td className="py-3 pr-4">
                              {formatNumber(debtToEbitda)}
                            </td>
                            <td className="py-3 pr-4">{score}/4</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
