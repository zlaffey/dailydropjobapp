export function formatPoints(points: number): string {
  return `${Math.round(points).toLocaleString()} pts`;
}

export function formatCurrency(amountUsd: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amountUsd);
}

export function formatCpp(cpp: number): string {
  return `${cpp.toFixed(2)}¢/pt`;
}

export function formatTimeAgo(timestampMs: number): string {
  const diff = Date.now() - timestampMs;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} hours ago`;
  return `${Math.floor(diff / 86_400_000)} days ago`;
}

export function formatRoute(originCode: string, destinationCode: string): string {
  return `${originCode.toUpperCase()} -> ${destinationCode.toUpperCase()}`;
}

export function formatMonthYear(isoMonth: string): string {
  const [year, month] = isoMonth.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, 1));
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(d);
}
