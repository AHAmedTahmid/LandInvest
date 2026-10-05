"use client";
import { useLang } from "@/lib/i18n";
import { formatBDT } from "@/lib/format";

export default function Tiles({ tiles }: { tiles: { key: string; value: number }[] }) {
  const { t } = useLang();
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {tiles.map((tile) => (
        <div key={tile.key} className="bg-white rounded-xl shadow p-4 border">
          <div className="text-sm text-gray-500">{t(tile.key)}</div>
          <div className="text-lg font-bold">{formatBDT(tile.value)}</div>
        </div>
      ))}
    </div>
  );
}
