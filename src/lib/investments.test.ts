import { describe, expect, it } from "vitest";
import {
  calculateDebtToEbitda,
  getScoreLabel,
  scoreAsset,
} from "./investments";

describe("investments scoring", () => {
  it("calculates debt to EBITDA", () => {
    expect(calculateDebtToEbitda({ dividaLiquida: 300, ebitda: 100 })).toBe(3);
    expect(calculateDebtToEbitda({ dividaLiquida: 0, ebitda: 100 })).toBeNull();
    expect(calculateDebtToEbitda({ dividaLiquida: 100, ebitda: 0 })).toBeNull();
  });

  it("scores assets based on thresholds", () => {
    const scored = scoreAsset(
      { dividendYield: 3 },
      { roe: 20, margemLiquida: 15, dividaLiquida: 200, ebitda: 100 },
    );
    expect(scored.total).toBe(4);
  });

  it("labels scores correctly", () => {
    expect(getScoreLabel(3).label).toBe("Attractive");
    expect(getScoreLabel(2).label).toBe("Neutral");
    expect(getScoreLabel(1).label).toBe("Caution");
  });
});
