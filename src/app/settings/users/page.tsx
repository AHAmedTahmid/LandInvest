import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { can } from "@/lib/rbac";
import UsersClient from "./UsersClient";

export default async function UsersSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return <div className="p-8">Unauthorized</div>;
  if (!(await can(session, "users.manage"))) return <div className="p-8 text-red-600">Forbidden: Super Admin only</div>;
  return <UsersClient canManage={true} />;
}
