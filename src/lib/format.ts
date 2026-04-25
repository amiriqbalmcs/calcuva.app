export const formatNumber = (n: number, digits = 0) =>
  Number.isFinite(n)
    ? n.toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits })
    : "—";

export const formatCurrency = (n: number, currency = "USD", digits = 0) =>
  Number.isFinite(n)
    ? n.toLocaleString(undefined, {
        style: "currency",
        currency,
        maximumFractionDigits: digits,
        minimumFractionDigits: digits,
      })
    : "—";

export const formatCompact = (n: number) =>
  Number.isFinite(n)
    ? n.toLocaleString(undefined, { notation: "compact", maximumFractionDigits: 1 })
    : "—";

export const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);
