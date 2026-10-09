export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    // Unknown/invalid currency code — fall back rather than crash the page.
    return `${currency} ${amount.toLocaleString("en-US")}`;
  }
}

/** True if an ISO date (YYYY-MM-DD) is strictly before today. */
export function isPast(iso: string | null | undefined, now: Date = new Date()): boolean {
  if (!iso) return false;
  return iso.slice(0, 10) < now.toISOString().slice(0, 10);
}
