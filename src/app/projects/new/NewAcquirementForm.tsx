"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  FileText,
  DollarSign,
  Grid3X3,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { formatBDT } from "@/lib/format";

type PlotCustomRow = {
  plotNumber: string;
  sizeShotok: number;
  askingPrice: number;
};

export default function NewAcquirementForm({
  canCreate,
  createAction,
}: {
  canCreate: boolean;
  createAction: (data: any) => Promise<{ success?: boolean; error?: string; projectId?: string }>;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Land core fields
  const [projectName, setProjectName] = useState("");
  const [mouza, setMouza] = useState("");
  const [jlNumber, setJlNumber] = useState("");
  const [dagNumbers, setDagNumbers] = useState("");
  const [khatianNumbers, setKhatianNumbers] = useState("");
  const [totalAreaShotok, setTotalAreaShotok] = useState<string>("");

  // Costs
  const [purchasePrice, setPurchasePrice] = useState<string>("");
  const [baynaAmount, setBaynaAmount] = useState<string>("");
  const [registrationCost, setRegistrationCost] = useState<string>("");
  const [mutationTaxCost, setMutationTaxCost] = useState<string>("");
  const [status, setStatus] = useState("UNDER_BAYNA");

  // Plot division
  const [numPlots, setNumPlots] = useState<string>("5");
  const [defaultPricePerPlot, setDefaultPricePerPlot] = useState<string>("");
  const [defaultSizePerPlot, setDefaultSizePerPlot] = useState<string>("");
  const [customPlots, setCustomPlots] = useState<PlotCustomRow[]>([]);
  const [showCustomTable, setShowCustomTable] = useState(false);

  // Computations
  const numTotalArea = parseFloat(totalAreaShotok) || 0;
  const numPlotCount = parseInt(numPlots, 10) || 0;
  const numPurchase = parseFloat(purchasePrice) || 0;
  const numReg = parseFloat(registrationCost) || 0;
  const numMut = parseFloat(mutationTaxCost) || 0;
  const totalAcquisitionCost = numPurchase + numReg + numMut;

  // Auto-fill individual plots table if user toggles custom table
  const handleGenerateCustomTable = () => {
    if (numPlotCount <= 0) return;
    const autoSize = parseFloat(defaultSizePerPlot) || (numTotalArea > 0 ? numTotalArea / numPlotCount : 0);
    const autoPrice = parseFloat(defaultPricePerPlot) || 0;

    const rows: PlotCustomRow[] = [];
    for (let i = 1; i <= numPlotCount; i++) {
      rows.push({
        plotNumber: `Plot-${i}`,
        sizeShotok: Math.round(autoSize * 100) / 100,
        askingPrice: autoPrice,
      });
    }
    setCustomPlots(rows);
    setShowCustomTable(true);
  };

  const updateCustomRow = (index: number, field: keyof PlotCustomRow, val: any) => {
    setCustomPlots((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  // Projected sales value
  const projectedRevenue = showCustomTable && customPlots.length > 0
    ? customPlots.reduce((sum, p) => sum + (p.askingPrice || 0), 0)
    : numPlotCount * (parseFloat(defaultPricePerPlot) || 0);

  const projectedProfit = projectedRevenue - totalAcquisitionCost;
  const projectedRoi = totalAcquisitionCost > 0 ? (projectedProfit / totalAcquisitionCost) * 100 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreate) {
      setError("Forbidden: You do not have permission to create land projects.");
      return;
    }
    if (!projectName.trim() || !mouza.trim() || !dagNumbers.trim() || !khatianNumbers.trim()) {
      setError("Please fill in all required land details (Project Name, Mouza, DAG, Khatian).");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        projectName,
        mouza,
        jlNumber: jlNumber.trim() || null,
        dagNumbers,
        khatianNumbers,
        totalAreaShotok: numTotalArea,
        purchasePrice: numPurchase,
        baynaAmount: parseFloat(baynaAmount) || 0,
        registrationCost: numReg,
        mutationTaxCost: numMut,
        status,
        numPlots: numPlotCount,
        defaultPricePerPlot: parseFloat(defaultPricePerPlot) || 0,
        defaultSizePerPlot: parseFloat(defaultSizePerPlot) || (numPlotCount > 0 ? numTotalArea / numPlotCount : 0),
        customPlots: showCustomTable ? customPlots : null,
      };

      const res = await createAction(payload);
      if (res.error) {
        setError(res.error);
      } else {
        router.push("/projects/plots");
      }
    } catch (err: any) {
      setError(err.message || "Failed to acquire land");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Section 1: Land Tract Core Information */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <span className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
            <MapPin className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Land Tract & Legal Specifications
            </h2>
            <p className="text-xs text-slate-500">
              Basic identification, mouza, survey plot numbers, and total land area.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Project Name / Scheme Title *
            </label>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Green Valley City Phase-1"
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mouza / Location *
            </label>
            <input
              value={mouza}
              onChange={(e) => setMouza(e.target.value)}
              placeholder="e.g. Mirpur, Dhaka"
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">JL Number</label>
            <input
              value={jlNumber}
              onChange={(e) => setJlNumber(e.target.value)}
              placeholder="e.g. JL-84"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">DAG Numbers *</label>
            <input
              value={dagNumbers}
              onChange={(e) => setDagNumbers(e.target.value)}
              placeholder="e.g. 101, 102, 105/1"
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Khatian Numbers *</label>
            <input
              value={khatianNumbers}
              onChange={(e) => setKhatianNumbers(e.target.value)}
              placeholder="e.g. 789, 790"
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Total Land Area (Shotok / Decimal) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={totalAreaShotok}
              onChange={(e) => setTotalAreaShotok(e.target.value)}
              placeholder="e.g. 40.00"
              required
              className="w-full border rounded-lg px-3 py-2 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="UNDER_BAYNA">UNDER_BAYNA (Advance Paid)</option>
              <option value="REGISTERED">REGISTERED (Deed Complete)</option>
              <option value="MUTATED">MUTATED (Namzari Done)</option>
              <option value="READY_FOR_SALE">READY_FOR_SALE (Open for Booking)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Acquisition Financials */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <span className="p-2 bg-blue-50 text-blue-700 rounded-lg">
            <DollarSign className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Acquisition Costs & Financial Outlay (BDT)
            </h2>
            <p className="text-xs text-slate-500">
              Land purchase consideration, bayna, deed registration, and mutation taxes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Total Agreed Purchase Price *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="0.00"
              required
              className="w-full border rounded-lg px-3 py-2 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Bayna (Advance) Paid</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={baynaAmount}
              onChange={(e) => setBaynaAmount(e.target.value)}
              placeholder="0.00"
              className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Registration & Stamp Duty</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={registrationCost}
              onChange={(e) => setRegistrationCost(e.target.value)}
              placeholder="0.00"
              className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mutation & Tax Costs</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={mutationTaxCost}
              onChange={(e) => setMutationTaxCost(e.target.value)}
              placeholder="0.00"
              className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500">Total Capital Committed for this Land:</span>
          <span className="font-bold text-slate-900 text-sm">{formatBDT(totalAcquisitionCost)}</span>
        </div>
      </div>

      {/* Section 3: Plot Distribution & Pricing Setup */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-purple-50 text-purple-700 rounded-lg">
              <Grid3X3 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                3. Plot Distribution & Inventory Creation
              </h2>
              <p className="text-xs text-slate-500">
                Specify how many plots you are making in this land. Each plot can have its own size and price.
              </p>
            </div>
          </div>

          {numPlotCount > 0 && (
            <button
              type="button"
              onClick={handleGenerateCustomTable}
              className="self-start sm:self-auto text-xs font-semibold px-3 py-1.5 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Customize Plot-by-Plot Sizes & Prices
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Number of Plots to Distribute *
            </label>
            <input
              type="number"
              min="1"
              value={numPlots}
              onChange={(e) => setNumPlots(e.target.value)}
              placeholder="e.g. 10"
              required
              className="w-full border rounded-lg px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Number of commercial/residential plots divided from this land.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Default Asking Price per Plot (BDT)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={defaultPricePerPlot}
              onChange={(e) => setDefaultPricePerPlot(e.target.value)}
              placeholder="e.g. 1500000"
              className="w-full border rounded-lg px-3 py-2 text-sm font-mono font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Base asking price applied to generated plots.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Default Size per Plot (Shotok)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={defaultSizePerPlot}
              onChange={(e) => setDefaultSizePerPlot(e.target.value)}
              placeholder={numPlotCount > 0 && numTotalArea > 0 ? (numTotalArea / numPlotCount).toFixed(2) : "Shotok per plot"}
              className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Leave blank to automatically divide total area equally.
            </p>
          </div>
        </div>

        {/* Custom Individual Plots Table (if customized) */}
        {showCustomTable && customPlots.length > 0 && (
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Individual Plot Wise Customization ({customPlots.length} Plots)
              </span>
              <button
                type="button"
                onClick={() => setShowCustomTable(false)}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                Reset to Uniform Defaults
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
                  <tr>
                    <th className="p-2.5">#</th>
                    <th>Plot Identifier</th>
                    <th>Plot Size (Shotok)</th>
                    <th className="text-right p-2.5">Asking Price (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {customPlots.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-400">{idx + 1}</td>
                      <td>
                        <input
                          value={row.plotNumber}
                          onChange={(e) => updateCustomRow(idx, "plotNumber", e.target.value)}
                          className="border rounded px-2 py-1 text-xs w-28 bg-white font-medium"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          value={row.sizeShotok}
                          onChange={(e) => updateCustomRow(idx, "sizeShotok", parseFloat(e.target.value) || 0)}
                          className="border rounded px-2 py-1 text-xs w-28 bg-white"
                        />
                      </td>
                      <td className="text-right p-2.5">
                        <input
                          type="number"
                          step="0.01"
                          value={row.askingPrice}
                          onChange={(e) => updateCustomRow(idx, "askingPrice", parseFloat(e.target.value) || 0)}
                          className="border rounded px-2 py-1 text-xs w-36 bg-white text-right font-bold text-slate-900"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Projection Financial Widget */}
        {projectedRevenue > 0 && (
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Projected Commercial Return Analysis
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1 font-mono">
              <div>
                <span className="text-slate-500 block">Total Projected Plot Sales:</span>
                <span className="text-base font-bold text-slate-900">{formatBDT(projectedRevenue)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Acquisition Costs:</span>
                <span className="text-base font-semibold text-slate-700">{formatBDT(totalAcquisitionCost)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Projected Gross Profit (ROI):</span>
                <span className={`text-base font-bold ${projectedProfit >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
                  {formatBDT(projectedProfit)} ({projectedRoi.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <Link
          href="/projects"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 border rounded-lg hover:bg-slate-100 transition"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={submitting || !canCreate}
          className="bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold rounded-xl px-7 py-3 text-sm transition shadow-sm flex items-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Acquiring Land & Generating Plots...
            </>
          ) : (
            <>
              Acquire Land & Distribute Plots
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
