"use client";

import React from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LearnInvestmentsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Learn Investments</h1>
              <p className="text-muted-foreground">
                Core formulas and how to interpret them.
              </p>
            </div>
            <Link href="/dashboard/investments">
              <Button variant="outline">Back to Investments</Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Dividend Yield</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Dividend Yield = Annual Dividend per Share ÷ Current Price.</p>
              <p>
                Higher yield can be attractive, but make sure dividends are
                sustainable.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Debt to EBITDA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Debt / EBITDA = Net Debt ÷ EBITDA.</p>
              <p>
                Lower values generally mean the company is less leveraged and
                has more flexibility.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ROE & Margins</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                ROE (Return on Equity) shows how efficiently the company uses
                shareholders’ capital.
              </p>
              <p>
                Margem Líquida (Net Margin) shows how much profit is kept from
                revenue.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Educational Checklist (Not Financial Advice)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="list-disc pl-5 space-y-2">
                <li>Consistent ROE over time.</li>
                <li>Stable or improving margins.</li>
                <li>Manageable Debt/EBITDA (commonly ≤ 3).</li>
                <li>Sustainable dividends and healthy cash flow.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
