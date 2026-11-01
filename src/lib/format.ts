// Bangladeshi numeral & currency formatting helpers
export type DigitGrouping = "lakh_crore" | "international";

export function toBnNum(input: number | string): string {
  const bnDigits: Record<string, string> = {
    "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
    "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯",
    ".": ".", ",": ","
  };
  return String(input).replace(/[0-9.,]/g, (char) => bnDigits[char] || char);
}

export function toNum(v: any): number {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return isNaN(v) ? 0 : v;
  if (typeof v === "object" && typeof v.toNumber === "function") return v.toNumber();
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ""));
  return isNaN(n) ? 0 : n;
}

export interface FormatBDTOptions {
  grouping?: DigitGrouping;
  currency?: string;
  decimals?: number;
  lang?: "en" | "bn";
  showCurrency?: boolean;
}

/**
 * Format BDT currency with either Bangladeshi lakh/crore or international grouping.
 * e.g., 2,36,87,350.00 or ৳ ২,৩৬,৮৭,৩৫০.০০
 */
export function formatBDT(
  amount: number | string | null | undefined,
  opts: FormatBDTOptions = {}
): string {
  const num = toNum(amount);
  const {
    grouping = "lakh_crore",
    currency = "৳ ",
    decimals = 2,
    lang = "en",
    showCurrency = true,
  } = opts;

  const locale = grouping === "lakh_crore" ? "en-IN" : "en-US";
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);

  const localizedNum = lang === "bn" ? toBnNum(formatted) : formatted;
  const prefix = showCurrency ? currency : "";
  return prefix + localizedNum;
}

/**
 * Compact form for dashboard cards and chart axis ticks.
 * e.g. ৳ 2.37 Cr, ৳ 59.4 L, ৳ 85 K, or Bengali equivalents.
 */
export function formatCompactBDT(
  amount: number | string | null | undefined,
  opts: { lang?: "en" | "bn"; showCurrency?: boolean } = {}
): string {
  const num = toNum(amount);
  const { lang = "en", showCurrency = true } = opts;
  const isNeg = num < 0;
  const abs = Math.abs(num);
  const prefix = (isNeg ? "-" : "") + (showCurrency ? "৳ " : "");

  let str = "";
  if (abs >= 10000000) { // 1 Crore = 10 Million
    const val = (abs / 10000000).toFixed(2).replace(/\.00$/, "").replace(/(\.[1-9])0$/, "$1");
    str = lang === "bn" ? `${toBnNum(val)} কোটি` : `${val} Cr`;
  } else if (abs >= 100000) { // 1 Lakh = 100 Thousand
    const val = (abs / 100000).toFixed(2).replace(/\.00$/, "").replace(/(\.[1-9])0$/, "$1");
    str = lang === "bn" ? `${toBnNum(val)} লাখ` : `${val} L`;
  } else if (abs >= 1000) {
    const val = (abs / 1000).toFixed(1).replace(/\.0$/, "");
    str = lang === "bn" ? `${toBnNum(val)} হাজার` : `${val} K`;
  } else {
    const val = abs.toFixed(0);
    str = lang === "bn" ? toBnNum(val) : val;
  }

  return prefix + str;
}

const MONTH_NAMES_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_NAMES_BN = ["জানু", "ফেব", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টে", "অক্টো", "নভে", "ডিসে"];

/**
 * Format date as DD-MMM-YYYY (e.g. 18-Nov-2026 or ১৮-নভে-২০২৬ in Bengali)
 */
export function formatDate(
  dateInput: Date | string | number | null | undefined,
  opts: { lang?: "en" | "bn" } = {}
): string {
  if (!dateInput) return "-";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "-";

  const { lang = "en" } = opts;
  const day = String(d.getDate()).padStart(2, "0");
  const monthIdx = d.getMonth();
  const year = String(d.getFullYear());

  if (lang === "bn") {
    return `${toBnNum(day)}-${MONTH_NAMES_BN[monthIdx]}-${toBnNum(year)}`;
  }
  return `${day}-${MONTH_NAMES_EN[monthIdx]}-${year}`;
}
