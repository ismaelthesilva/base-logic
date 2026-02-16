export type FundamentalsMetrics = {
  roe?: number | null;
  margemLiquida?: number | null;
  dividaLiquida?: number | null;
  ebitda?: number | null;
};

export type AssetMetrics = {
  dividendYield?: number | null;
};

export function calculateDebtToEbitda(
  fundamentals?: FundamentalsMetrics | null,
): number | null {
  if (!fundamentals?.dividaLiquida || !fundamentals?.ebitda) return null;
  return fundamentals.dividaLiquida / fundamentals.ebitda;
}

export function scoreAsset(
  asset?: AssetMetrics | null,
  fundamentals?: FundamentalsMetrics | null,
) {
  const debtToEbitda = calculateDebtToEbitda(fundamentals);

  const parts = [
    { label: "ROE ≥ 15%", pass: (fundamentals?.roe ?? 0) >= 15 },
    { label: "Margin ≥ 10%", pass: (fundamentals?.margemLiquida ?? 0) >= 10 },
    {
      label: "Debt/EBITDA ≤ 3",
      pass: debtToEbitda !== null && debtToEbitda <= 3,
    },
    {
      label: "Dividend Yield ≥ 2%",
      pass: (asset?.dividendYield ?? 0) >= 2,
    },
  ];

  const total = parts.reduce((sum, part) => sum + (part.pass ? 1 : 0), 0);

  return { total, parts, debtToEbitda };
}

export function getScoreLabel(total: number) {
  if (total >= 3) {
    return { label: "Attractive", tone: "text-green-600" };
  }
  if (total <= 1) {
    return { label: "Caution", tone: "text-red-600" };
  }
  return { label: "Neutral", tone: "text-yellow-600" };
}
