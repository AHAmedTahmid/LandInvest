"use client";
import { useLang } from "@/lib/i18n";
export default function T({ k, fallback }: { k: string; fallback?: string }) {
  const { t } = useLang();
  return <>{t(k) || fallback || k}</>;
}
