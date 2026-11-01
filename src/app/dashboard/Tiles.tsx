"use client";
import { useLang } from "@/lib/i18n";
import { formatBDT, formatCompactBDT } from "@/lib/format";

export default function Tiles({ tiles }: { tiles: { key: string; value: number }[] }) {
  const { t, lang } = useLang();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {tiles.map((tile) => {
        const fullBDT = formatBDT(tile.value, { lang });
        const compactBDT = formatCompactBDT(tile.value, { lang });
        const label = t(tile.key);

        return (
          <div
            key={tile.key}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 transition-all hover:shadow-md group relative"
            title={`${label}: ${fullBDT}`}
          >
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 truncate">
              {label}
            </div>
            <div className="text-xl font-bold text-gray-900 font-mono tabular-nums">
              {compactBDT}
            </div>
            <div className="text-xs text-gray-400 font-mono mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {fullBDT}
            </div>
          </div>
        );
      })}
    </div>
  );
}
