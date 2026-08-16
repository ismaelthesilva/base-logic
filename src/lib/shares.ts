/**
 * Buffett-criteria share screener — single source of truth.
 *
 * Extracted from the two route files that previously duplicated this logic.
 * Any threshold change here propagates to both POST (create) and PUT (update).
 */
export function computePassesFilter(data: {
  roe?: number | null;
  margemLiquida?: number | null;
  debitEbitda?: number | null;
  dividendo?: number | null;
}): boolean {
  const { roe, margemLiquida, debitEbitda, dividendo } = data;
  return (
    roe != null &&
    roe >= 15 &&
    margemLiquida != null &&
    margemLiquida >= 15 &&
    debitEbitda != null &&
    debitEbitda <= 3 &&
    dividendo != null &&
    dividendo >= 10
  );
}
