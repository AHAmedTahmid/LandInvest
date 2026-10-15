import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { can } from "@/lib/rbac";
import RolesClient from "./RolesClient";

export default async function RolesPage() {
  const session = await getServerSession(authOptions);
  if (!session) return <div className="p-8">Unauthorized</div>;
  if (!(await can(session, "roles.manage"))) return <div className="p-8 text-red-600">Forbidden: roles.manage</div>;
  return <RolesClient />;
}
