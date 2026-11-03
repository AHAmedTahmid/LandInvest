"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { formatBDT } from "@/lib/format";

export type AvailablePlot = {
  id: string;
  plotNumber: string;
  askingPrice: number;
  plotSizeShotok: number;
  status: string;
};

export type ProjectWithPlots = {
  id: string;
  projectName: string;
  mouza?: string | null;
  plots: AvailablePlot[];
  totalPlotsCount: number;
};

export type BankAccountOption = {
  id: string;
  bankName: string;
  accountNumber: string;
};

export default function SalesForm({
  projects,
  banks,
}: {
  projects: ProjectWithPlots[];
  banks: BankAccountOption[];
}) {
  const router = useRouter();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || "");
  const [selectedPlotId, setSelectedPlotId] = useState<string>("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerNid, setBuyerNid] = useState("");
  const [totalPrice, setTotalPrice] = useState<string>("");
  const [advance, setAdvance] = useState<string>("");
  const [installmentsCount, setInstallmentsCount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [bankAccountId, setBankAccountId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentProject = projects.find((p) => p.id === selectedProjectId);
  const availablePlots = currentProject?.plots || [];

  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSelectedPlotId("");
    setTotalPrice("");
    setError(null);
  };

  const handlePlotChange = (plotId: string) => {
    setSelectedPlotId(plotId);
    setError(null);
    if (!plotId) {
      setTotalPrice("");
      return;
    }
    const plot = availablePlots.find((pl) => pl.id === plotId);
    if (plot) {
      setTotalPrice(String(plot.askingPrice));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      setError("Please select a land project");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: selectedProjectId,
          plot_id: selectedPlotId || null,
          buyer_name: buyerName,
          buyer_phone: buyerPhone,
          buyer_nid: buyerNid || null,
          total_agreed_price: parseFloat(totalPrice) || 0,
          advance: parseFloat(advance) || 0,
          installments_count: parseInt(installmentsCount, 10) || 0,
          payment_method: paymentMethod,
          bank_account: paymentMethod === "BANK" ? bankAccountId : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create plot sale");
      }

      // Reset form
      setBuyerName("");
      setBuyerPhone("");
      setBuyerNid("");
      setTotalPrice("");
      setAdvance("");
      setInstallmentsCount("");
      setSelectedPlotId("");

      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl shadow border space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Project Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Land Project *
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => handleProjectChange(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectName} ({p.plots.length} available / {p.totalPlotsCount} total)
              </option>
            ))}
          </select>
          {currentProject && (
            <p className="text-xs text-slate-500 mt-1">
              Available Plots Remaining:{" "}
              <span className={`font-semibold ${availablePlots.length > 0 ? "text-emerald-600" : "text-amber-600"}`}>
                {availablePlots.length} plot{availablePlots.length !== 1 ? "s" : ""}
              </span>
            </p>
          )}
        </div>

        {/* Plot Selector (Dynamically filtered by project) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Plot Number {availablePlots.length > 0 ? "*" : ""}
          </label>
          <select
            value={selectedPlotId}
            onChange={(e) => handlePlotChange(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availablePlots.length === 0 ? (
              <option value="">No available plots in this project</option>
            ) : (
              <>
                <option value="">Select a Plot...</option>
                {availablePlots.map((pl) => (
                  <option key={pl.id} value={pl.id}>
                    {pl.plotNumber} — {formatBDT(Number(pl.askingPrice))} ({pl.plotSizeShotok} Shotok)
                  </option>
                ))}
              </>
            )}
          </select>
          {selectedPlotId && (
            <p className="text-xs text-emerald-600 mt-1">
              ✓ Plot price auto-filled below. This plot will be marked BOOKED upon sale.
            </p>
          )}
        </div>

        {/* Buyer Name & Phone */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Buyer Name *</label>
          <input
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            placeholder="e.g. Rahim Uddin"
            required
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Buyer Phone *</label>
          <input
            value={buyerPhone}
            onChange={(e) => setBuyerPhone(e.target.value)}
            placeholder="e.g. 01811000001"
            required
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Buyer NID & Total Price */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Buyer NID (Optional)</label>
          <input
            value={buyerNid}
            onChange={(e) => setBuyerNid(e.target.value)}
            placeholder="National ID number"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Total Agreed Price (BDT) *</label>
          <input
            type="number"
            step="0.01"
            value={totalPrice}
            onChange={(e) => setTotalPrice(e.target.value)}
            placeholder="Total Price"
            required
            className="w-full border rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Advance & Installments */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Advance Booking Amount (BDT)</label>
          <input
            type="number"
            step="0.01"
            value={advance}
            onChange={(e) => setAdvance(e.target.value)}
            placeholder="0.00"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Installment Schedule (Months)</label>
          <input
            type="number"
            min="0"
            value={installmentsCount}
            onChange={(e) => setInstallmentsCount(e.target.value)}
            placeholder="e.g. 6 (0 for full payment)"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Payment Method & Bank */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Advance Payment Channel</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="CASH">CASH</option>
            <option value="BANK">BANK</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Account (if paying by bank)</label>
          <select
            value={bankAccountId}
            onChange={(e) => setBankAccountId(e.target.value)}
            disabled={paymentMethod !== "BANK"}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-white disabled:bg-slate-50 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Bank Account</option>
            {banks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.bankName} - {b.accountNumber}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 shadow-sm"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Processing Sale & Reserving Plot...
          </>
        ) : (
          "Create Sale & Reserve Plot"
        )}
      </button>
    </form>
  );
}
