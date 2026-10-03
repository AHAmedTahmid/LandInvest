"use client";
export default function PrintButton({ label = "Print (window.print)" }: { label?: string }) {
  return <button onClick={() => window.print()} className="ml-2 border px-4 py-2 rounded">{label}</button>;
}
