import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { can } from "@/lib/rbac";
import UsersClient from "./UsersClient";

export default async function UsersSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return <div className="p-8 text-slate-500">Unauthorized</div>;

  const canManage = await can(session, "users.manage");
  const canView = await can(session, "users.view");

  if (!canManage && !canView) {
    return <div className="p-8 text-rose-600 font-semibold">Forbidden: You lack permission to view team members</div>;
  }

  return <UsersClient canManage={canManage} />;
}
