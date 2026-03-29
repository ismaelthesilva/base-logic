import { describe, expect, it } from "vitest";
import {
  calculateDebtToEbitda,
  getScoreLabel,
  scoreAsset,
} from "./investments";

describe("calculateDebtToEbitda", () => {
  it("calculates correctly", () => {
    expect(calculateDebtToEbitda({ dividaLiquida: 300, ebitda: 100 })).toBe(3);
    expect(calculateDebtToEbitda({ dividaLiquida: 600, ebitda: 200 })).toBe(3);
    expect(calculateDebtToEbitda({ dividaLiquida: 50, ebitda: 100 })).toBe(0.5);
  });

  it("returns null when dividaLiquida is falsy", () => {
    expect(calculateDebtToEbitda({ dividaLiquida: 0, ebitda: 100 })).toBeNull();
    expect(
      calculateDebtToEbitda({ dividaLiquida: null, ebitda: 100 })
    ).toBeNull();
    expect(
      calculateDebtToEbitda({ dividaLiquida: undefined, ebitda: 100 })
    ).toBeNull();
  });

  it("returns null when ebitda is falsy", () => {
    expect(calculateDebtToEbitda({ dividaLiquida: 100, ebitda: 0 })).toBeNull();
    expect(
      calculateDebtToEbitda({ dividaLiquida: 100, ebitda: null })
    ).toBeNull();
    expect(
      calculateDebtToEbitda({ dividaLiquida: 100, ebitda: undefined })
    ).toBeNull();
  });

  it("returns null for null/undefined input", () => {
    expect(calculateDebtToEbitda(null)).toBeNull();
    expect(calculateDebtToEbitda(undefined)).toBeNull();
    expect(calculateDebtToEbitda({})).toBeNull();
  });
});

describe("scoreAsset", () => {
  it("scores 4/4 for a perfect asset", () => {
    const result = scoreAsset(
      { dividendYield: 3 },
      { roe: 20, margemLiquida: 15, dividaLiquida: 200, ebitda: 100 }
    );
    expect(result.total).toBe(4);
    expect(result.parts.every((p) => p.pass)).toBe(true);
  });

  it("scores 0/4 for a weak asset", () => {
    const result = scoreAsset(
      { dividendYield: 0 },
      { roe: 5, margemLiquida: 3, dividaLiquida: 500, ebitda: 100 }
    );
    expect(result.total).toBe(0);
  });

  it("scores exactly on boundaries", () => {
    // ROE = 15 (pass), Margin = 10 (pass), Debt/EBITDA = 3 (pass), Yield = 2 (pass)
    const result = scoreAsset(
      { dividendYield: 2 },
      { roe: 15, margemLiquida: 10, dividaLiquida: 300, ebitda: 100 }
    );
    expect(result.total).toBe(4);
  });

  it("scores just below boundaries", () => {
    // ROE = 14.9 (fail), Margin = 9.9 (fail), Debt/EBITDA = 3.01 (fail), Yield = 1.9 (fail)
    const result = scoreAsset(
      { dividendYield: 1.9 },
      { roe: 14.9, margemLiquida: 9.9, dividaLiquida: 301, ebitda: 100 }
    );
    expect(result.total).toBe(0);
  });

  it("exposes debtToEbitda in result", () => {
    const result = scoreAsset({}, { dividaLiquida: 400, ebitda: 200 });
    expect(result.debtToEbitda).toBe(2);
  });

  it("handles null asset and fundamentals gracefully", () => {
    const result = scoreAsset(null, null);
    expect(result.total).toBe(0);
    expect(result.debtToEbitda).toBeNull();
  });

  it("handles undefined fields gracefully", () => {
    const result = scoreAsset({}, {});
    expect(result.total).toBe(0);
  });

  it("has correct part labels", () => {
    const result = scoreAsset({}, {});
    const labels = result.parts.map((p) => p.label);
    expect(labels).toContain("ROE ≥ 15%");
    expect(labels).toContain("Margin ≥ 10%");
    expect(labels).toContain("Debt/EBITDA ≤ 3");
    expect(labels).toContain("Dividend Yield ≥ 2%");
  });
});

describe("getScoreLabel", () => {
  it("labels 3+ as Attractive", () => {
    expect(getScoreLabel(3).label).toBe("Attractive");
    expect(getScoreLabel(4).label).toBe("Attractive");
  });

  it("labels 2 as Neutral", () => {
    expect(getScoreLabel(2).label).toBe("Neutral");
  });

  it("labels 0-1 as Caution", () => {
    expect(getScoreLabel(1).label).toBe("Caution");
    expect(getScoreLabel(0).label).toBe("Caution");
  });

  it("returns correct tone classes", () => {
    expect(getScoreLabel(4).tone).toBe("text-green-600");
    expect(getScoreLabel(2).tone).toBe("text-yellow-600");
    expect(getScoreLabel(0).tone).toBe("text-red-600");
  });
});
