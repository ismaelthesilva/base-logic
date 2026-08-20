import { describe, expect, it } from "vitest";
import {
  formatCurrency,
  formatLargeNumber,
  formatNumber,
  formatPercent,
} from "./format";

describe("formatNumber", () => {
  it("returns — for null", () => {
    expect(formatNumber(null)).toBe("—");
  });

  it("returns — for undefined", () => {
    expect(formatNumber(undefined)).toBe("—");
  });

  it("returns — for NaN", () => {
    expect(formatNumber(NaN)).toBe("—");
  });

  it("formats integers", () => {
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(1000)).toBe("1,000");
    expect(formatNumber(1000000)).toBe("1,000,000");
  });

  it("formats decimals with max 2 fraction digits by default", () => {
    expect(formatNumber(1234.567)).toBe("1,234.57");
    expect(formatNumber(1.5)).toBe("1.5");
    expect(formatNumber(1.0)).toBe("1");
  });

  it("respects custom options", () => {
    expect(formatNumber(1.5, { maximumFractionDigits: 0 })).toBe("2");
    expect(
      formatNumber(1.5, { minimumFractionDigits: 3, maximumFractionDigits: 3 })
    ).toBe("1.500");
  });

  it("handles negative numbers", () => {
    expect(formatNumber(-1234.5)).toBe("-1,234.5");
  });
});

describe("formatCurrency", () => {
  it("returns — for null", () => {
    expect(formatCurrency(null)).toBe("—");
  });

  it("returns — for undefined", () => {
    expect(formatCurrency(undefined)).toBe("—");
  });

  it("returns — for NaN", () => {
    expect(formatCurrency(NaN)).toBe("—");
  });

  it("formats USD by default", () => {
    expect(formatCurrency(1000)).toBe("$1,000.00");
    expect(formatCurrency(0)).toBe("$0.00");
    expect(formatCurrency(1999.99)).toBe("$1,999.99");
  });

  it("formats BRL correctly", () => {
    const result = formatCurrency(1000, "BRL");
    // BRL symbol varies by locale, just verify the number part
    expect(result).toContain("1,000.00");
  });

  it("handles negative currency", () => {
    expect(formatCurrency(-500)).toBe("-$500.00");
  });
});

describe("formatPercent", () => {
  it("returns — for null", () => {
    expect(formatPercent(null)).toBe("—");
  });

  it("returns — for undefined", () => {
    expect(formatPercent(undefined)).toBe("—");
  });

  it("returns — for NaN", () => {
    expect(formatPercent(NaN)).toBe("—");
  });

  it("appends % to the formatted number", () => {
    expect(formatPercent(0)).toBe("0%");
    expect(formatPercent(100)).toBe("100%");
    expect(formatPercent(25.5)).toBe("25.5%");
  });

  it("rounds to 2 decimal places", () => {
    expect(formatPercent(12.3456)).toBe("12.35%");
  });

  it("handles negative percents", () => {
    expect(formatPercent(-5.5)).toBe("-5.5%");
  });
});

describe("formatLargeNumber", () => {
  it("returns — for null", () => {
    expect(formatLargeNumber(null)).toBe("—");
  });

  it("returns — for undefined", () => {
    expect(formatLargeNumber(undefined)).toBe("—");
  });

  it("returns — for NaN", () => {
    expect(formatLargeNumber(NaN)).toBe("—");
  });

  it("formats billions", () => {
    expect(formatLargeNumber(1_500_000_000)).toBe("1.5B");
    expect(formatLargeNumber(2_000_000_000)).toBe("2.0B");
  });

  it("formats millions", () => {
    expect(formatLargeNumber(1_500_000)).toBe("1.5M");
    expect(formatLargeNumber(500_000_000)).toBe("500.0M");
  });

  it("formats thousands", () => {
    expect(formatLargeNumber(1_500)).toBe("1.5K");
    expect(formatLargeNumber(999_999)).toBe("1000.0K");
  });

  it("formats small numbers", () => {
    expect(formatLargeNumber(0)).toBe("0");
    expect(formatLargeNumber(999)).toBe("999");
  });

  it("handles negative values", () => {
    expect(formatLargeNumber(-1_500_000)).toBe("-1.5M");
    expect(formatLargeNumber(-1_500)).toBe("-1.5K");
    expect(formatLargeNumber(-500)).toBe("-500");
  });
});
