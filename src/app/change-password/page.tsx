import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import ChangeForm from "./Form";

export default async function ChangePasswordPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const must = !!(session.user as any)?.mustChangePassword;
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-6 rounded-xl shadow border w-full max-w-md space-y-4">
        <h1 className="text-xl font-bold">Change Password</h1>
        {must && <p className="text-sm text-amber-700 bg-amber-50 p-2 rounded">You must change your temporary password before continuing.</p>}
        <ChangeForm must={must} />
      </div>
    </div>
  );
}
