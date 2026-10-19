export function formatBDT(n: number | string | null | undefined): string {
  const num = Number(n) || 0;
  const abs = Math.abs(num);
  const formatted = new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(abs);
  const sign = num < 0 ? "-" : "";
  return `${sign}৳ ${formatted}`;
}

export function formatDate(d: string | Date | null | undefined): string {
  if (!d) return "-";
  const date = typeof d === "string" ? new Date(d) : d;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = months[date.getMonth()];
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export function formatDateTime(d: string | Date | null | undefined): string {
  if (!d) return "-";
  const date = typeof d === "string" ? new Date(d) : d;
  const time = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${formatDate(date)} ${time}`;
}

export function fiscalYearStart(date: Date): Date {
  const y = date.getFullYear();
  return date.getMonth() >= 6 ? new Date(y, 6, 1) : new Date(y - 1, 6, 1);
}

export function fiscalYearEnd(date: Date): Date {
  const y = date.getFullYear();
  return date.getMonth() >= 6 ? new Date(y + 1, 5, 30) : new Date(y, 5, 30);
}

export type DatePreset = "today" | "this_month" | "last_month" | "this_quarter" | "this_fy" | "custom";

export function getPresetRange(preset: DatePreset, customFrom?: string, customTo?: string): { from: Date; to: Date } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  switch (preset) {
    case "today":
      return { from: today, to: today };
    case "this_month":
      return { from: new Date(today.getFullYear(), today.getMonth(), 1), to: today };
    case "last_month": {
      const first = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const last = new Date(today.getFullYear(), today.getMonth(), 0);
      return { from: first, to: last };
    }
    case "this_quarter": {
      const q = Math.floor(today.getMonth() / 3) * 3;
      return { from: new Date(today.getFullYear(), q, 1), to: today };
    }
    case "this_fy":
      return { from: fiscalYearStart(today), to: today };
    case "custom":
    default:
      return {
        from: customFrom ? new Date(customFrom) : new Date(today.getFullYear(), today.getMonth(), 1),
        to: customTo ? new Date(customTo) : today,
      };
  }
}

export function filterSummary(f: Record<string, any>): string {
  const parts: string[] = [];
  if (f.from && f.to) parts.push(`${formatDate(f.from)} – ${formatDate(f.to)}`);
  if (f.projectId) parts.push(`Project: ${f.projectId}`);
  if (f.partnerId) parts.push(`Partner: ${f.partnerId}`);
  if (f.bankAccountId) parts.push(`Bank: ${f.bankAccountId}`);
  if (f.status) parts.push(`Status: ${f.status}`);
  return parts.length ? parts.join(" · ") : "All records";
}
