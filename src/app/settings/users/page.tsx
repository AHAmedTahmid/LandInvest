import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { controlPrisma } from "@/lib/control";
import { can } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

export default async function UsersSettingsPage(){
  const session=await getServerSession(authOptions);
  if(!can((session?.user as any)?.role,"inviteUsers")) return <div className="p-8 text-red-600">Forbidden: Super Admin only</div>;
  const tenantId=(session!.user as any).tenantId;
  const users=await (controlPrisma as any).globalUser.findMany({where:{tenantId}});
  const invites=await (controlPrisma as any).userInvitation.findMany({where:{tenantId,accepted:false}});

  async function invite(formData:FormData){
    "use server";
    const s=await (await import("next-auth")).getServerSession((await import("@/auth")).authOptions);
    const res=await fetch(`${process.env.NEXTAUTH_URL}/api/invites`,{method:"POST",headers:{"Content-Type":"application/json",Cookie: ""}, body: JSON.stringify({email:formData.get("email"),role:formData.get("role")})});
    // fallback direct create
    if(!res.ok){
      const { controlPrisma:cp }=await import("@/lib/control");
      const { randomUUID }=await import("crypto");
      await (cp as any).userInvitation.create({data:{tenantId:(s!.user as any).tenantId,email:formData.get("email") as string,role:formData.get("role") as string,inviteToken:randomUUID(),expiresAt:new Date(Date.now()+7*86400000)}});
    }
    revalidatePath("/settings/users");
  }

  return (<div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold">Users</h1>
    <table className="w-full text-sm bg-white rounded shadow border"><thead><tr className="border-b"><th className="p-2">Name</th><th>Email</th><th>Role</th></tr></thead><tbody>{users.map((u:any)=><tr key={u.id} className="border-b"><td className="p-2">{u.fullName}</td><td>{u.email}</td><td>{u.role}</td></tr>)}</tbody></table>
    <form action={invite} className="flex gap-2 bg-white p-4 rounded shadow border">
      <input name="email" type="email" required placeholder="Email" className="border rounded px-3 py-2 flex-1"/>
      <select name="role" className="border rounded px-3 py-2"><option>super_admin</option><option>managing_partner</option><option>site_manager</option><option>accountant</option></select>
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Invite</button>
    </form>
    <h2 className="font-semibold">Pending Invitations</h2>
    <table className="w-full text-sm bg-white rounded shadow border"><thead><tr className="border-b"><th className="p-2">Email</th><th>Role</th><th>Token</th></tr></thead><tbody>{invites.map((i:any)=><tr key={i.id} className="border-b"><td className="p-2">{i.email}</td><td>{i.role}</td><td className="text-xs">{i.inviteToken}</td></tr>)}</tbody></table>
  </div>);
}
