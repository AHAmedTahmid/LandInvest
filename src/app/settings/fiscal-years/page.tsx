import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { can } from "@/lib/rbac";
import { getTenantClientFromSession } from "@/lib/tenant";
import { getFiscalYears } from "@/lib/fiscalYear";
import FiscalYearsClient from "./FiscalYearsClient";

export default async function FiscalYearsSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return <div className="p-8 text-red-600">Unauthorized</div>;

  const canManage =
    (await can(session, "dashboard.settings.manage")) ||
    (await can(session, "roles.manage")) ||
    (await can(session, "users.manage"));

  if (!canManage) {
    return <div className="p-8 text-red-600">Forbidden: dashboard.settings.manage</div>;
  }

  const prisma: any = await getTenantClientFromSession();
  const initialData = await getFiscalYears(prisma);

  return <FiscalYearsClient initialData={initialData} />;
}

