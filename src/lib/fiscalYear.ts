import { randomUUID } from "crypto";
import { writeAudit } from "@/lib/tenantRules";

export interface FiscalYearEntry {
  id: string;
  label: string;
  labelBn?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  isCurrent: boolean;
  status: "ACTIVE" | "CLOSED";
  notes?: string;
  createdAt: string;
}

const SETTING_KEY = "fiscal_years";

function defaultFiscalYears(): FiscalYearEntry[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  // Bangladesh standard fiscal year: July 1 – June 30
  const curStartYear = m >= 6 ? y : y - 1;
  const prevStartYear = curStartYear - 1;

  return [
    {
      id: "fy-default-cur",
      label: `FY ${curStartYear}-${curStartYear + 1}`,
      labelBn: `অর্থবছর ${curStartYear}-${curStartYear + 1}`,
      startDate: `${curStartYear}-07-01`,
      endDate: `${curStartYear + 1}-06-30`,
      isCurrent: true,
      status: "ACTIVE",
      notes: "Standard Bangladesh Fiscal Year (Jul – Jun)",
      createdAt: now.toISOString(),
    },
    {
      id: "fy-default-prev",
      label: `FY ${prevStartYear}-${prevStartYear + 1}`,
      labelBn: `অর্থবছর ${prevStartYear}-${prevStartYear + 1}`,
      startDate: `${prevStartYear}-07-01`,
      endDate: `${prevStartYear + 1}-06-30`,
      isCurrent: false,
      status: "CLOSED",
      notes: "Previous Fiscal Year",
      createdAt: now.toISOString(),
    },
  ];
}

async function readSettingRow(prisma: any): Promise<{ id: string; value: FiscalYearEntry[] } | null> {
  try {
    const row = await prisma.dashboardSetting.findUnique({ where: { settingKey: SETTING_KEY } });
    if (!row) return null;
    const raw = typeof row.settingValue === "string" ? JSON.parse(row.settingValue) : row.settingValue;
    const list = Array.isArray(raw) ? raw : [];
    return { id: row.id, value: list };
  } catch {
    return null;
  }
}

async function saveFiscalYearsList(prisma: any, list: FiscalYearEntry[], userId?: string | null) {
  const existing = await prisma.dashboardSetting.findUnique({ where: { settingKey: SETTING_KEY } });
  if (existing) {
    const updated = await prisma.dashboardSetting.update({
      where: { settingKey: SETTING_KEY },
      data: {
        settingValue: list,
        updatedBy: userId || null,
      },
    });
    if (userId) {
      await writeAudit(prisma, "dashboard_settings", existing.id, "UPDATE", userId, existing.settingValue, list);
    }
    return updated;
  } else {
    const id = randomUUID();
    const created = await prisma.dashboardSetting.create({
      data: {
        id,
        settingKey: SETTING_KEY,
        settingValue: list,
        updatedBy: userId || null,
      },
    });
    if (userId) {
      await writeAudit(prisma, "dashboard_settings", id, "CREATE", userId, null, list);
    }
    return created;
  }
}

export async function getFiscalYears(prisma: any): Promise<{
  fiscalYears: FiscalYearEntry[];
  currentFiscalYear: FiscalYearEntry;
}> {
  const row = await readSettingRow(prisma);
  let list: FiscalYearEntry[] = row && row.value.length > 0 ? row.value : defaultFiscalYears();

  // Ensure at least one FY is marked isCurrent
  if (!list.some((f) => f.isCurrent) && list.length > 0) {
    list = list.map((f, idx) => ({ ...f, isCurrent: idx === 0 }));
  }

  // Sort: current first, then newest startDate descending
  const sorted = [...list].sort((a, b) => {
    if (a.isCurrent !== b.isCurrent) return a.isCurrent ? -1 : 1;
    return b.startDate.localeCompare(a.startDate);
  });

  const currentFiscalYear = sorted.find((f) => f.isCurrent) || sorted[0];
  return { fiscalYears: sorted, currentFiscalYear };
}

export async function addFiscalYear(
  prisma: any,
  input: {
    label: string;
    labelBn?: string;
    startDate: string;
    endDate: string;
    setAsCurrent?: boolean;
    notes?: string;
  },
  userId: string
) {
  const label = input.label.trim();
  if (!label) throw new Error("Fiscal year label is required.");
  if (!input.startDate || !input.endDate) throw new Error("Start date and end date are required.");
  if (input.startDate >= input.endDate) throw new Error("End date must be after start date.");

  const { fiscalYears } = await getFiscalYears(prisma);
  if (fiscalYears.some((f) => f.label.toLowerCase() === label.toLowerCase())) {
    throw new Error(`Fiscal year "${label}" already exists.`);
  }

  const newEntry: FiscalYearEntry = {
    id: randomUUID(),
    label,
    labelBn: input.labelBn?.trim() || undefined,
    startDate: input.startDate,
    endDate: input.endDate,
    isCurrent: !!input.setAsCurrent,
    status: "ACTIVE",
    notes: input.notes?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  const nextList = [
    newEntry,
    ...fiscalYears.map((f) => (input.setAsCurrent ? { ...f, isCurrent: false } : f)),
  ];

  await saveFiscalYearsList(prisma, nextList, userId);
  return getFiscalYears(prisma);
}

export async function setCurrentFiscalYear(prisma: any, id: string, userId: string) {
  const { fiscalYears } = await getFiscalYears(prisma);
  const target = fiscalYears.find((f) => f.id === id);
  if (!target) throw new Error("Fiscal year not found.");

  const nextList = fiscalYears.map((f) => ({
    ...f,
    isCurrent: f.id === id,
    status: f.id === id ? ("ACTIVE" as const) : f.status,
  }));

  await saveFiscalYearsList(prisma, nextList, userId);
  return getFiscalYears(prisma);
}

export async function updateFiscalYearStatus(
  prisma: any,
  id: string,
  status: "ACTIVE" | "CLOSED",
  userId: string
) {
  const { fiscalYears } = await getFiscalYears(prisma);
  const target = fiscalYears.find((f) => f.id === id);
  if (!target) throw new Error("Fiscal year not found.");
  if (target.isCurrent && status === "CLOSED") {
    throw new Error("Cannot close the currently active fiscal year. Switch to another FY first.");
  }

  const nextList = fiscalYears.map((f) => (f.id === id ? { ...f, status } : f));
  await saveFiscalYearsList(prisma, nextList, userId);
  return getFiscalYears(prisma);
}

export async function deleteFiscalYear(prisma: any, id: string, userId: string) {
  const { fiscalYears } = await getFiscalYears(prisma);
  const target = fiscalYears.find((f) => f.id === id);
  if (!target) throw new Error("Fiscal year not found.");
  if (target.isCurrent) {
    throw new Error("Cannot delete the currently active fiscal year.");
  }
  if (fiscalYears.length <= 1) {
    throw new Error("At least one fiscal year must remain configured.");
  }

  const nextList = fiscalYears.filter((f) => f.id !== id);
  await saveFiscalYearsList(prisma, nextList, userId);
  return getFiscalYears(prisma);
}

