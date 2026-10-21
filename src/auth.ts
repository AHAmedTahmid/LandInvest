import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { controlPrisma } from "@/lib/control";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await (controlPrisma as any).globalUser.findUnique({
          where: { email: credentials.email },
          include: { tenant: true },
        });
        if (!user || !user.isActive) return null;
        // suspended/cancelled tenants cannot log in
        if (!user.tenant || !["active", "trial"].includes(user.tenant.status)) return null;
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        await (controlPrisma as any).globalUser.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        }).catch(() => {});
        return {
          id: String(user.id),
          email: user.email,
          tenantId: user.tenantId,
          isOwner: !!user.isOwner,
          isActive: user.isActive,
          mustChangePassword: !!user.mustChangePassword,
          fullName: user.fullName,
          dbName: user.tenant?.dbName ?? null,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.sub = user.id;
        (token as any).user_id = user.id;
        (token as any).tenant_id = user.tenantId;
        token.tenantId = user.tenantId;
        (token as any).is_owner = user.isOwner;
        (token as any).isOwner = user.isOwner;
        (token as any).must_change_password = user.mustChangePassword;
        (token as any).full_name = user.fullName;
        (token as any).fullName = user.fullName;
        (token as any).dbName = user.dbName;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        // re-check isActive + tenant status on every request (deactivated users /
        // suspended tenants get a null session, which getServerSession surfaces as
        // unauthenticated to every API route and page)
        try {
          const uid = token.sub ?? (token as any).user_id;
          if (uid) {
            const gu: any = await (controlPrisma as any).globalUser.findUnique({
              where: { id: String(uid) },
              select: { isActive: true, isOwner: true, mustChangePassword: true, tenant: { select: { status: true } } },
            });
            if (!gu || gu.isActive === false) return null as any;
            if (!gu.tenant || !["active", "trial"].includes(gu.tenant.status)) return null as any;
            (token as any).is_owner = gu.isOwner;
            (token as any).must_change_password = gu.mustChangePassword;
          }
        } catch {
          // control DB unreachable: fail closed rather than serve a stale session
          return null as any;
        }
        (session.user as any) = {
          id: token.sub ?? (token as any).user_id,
          email: token.email ?? session.user?.email,
          tenantId: (token as any).tenant_id ?? token.tenantId,
          isOwner: !!(token as any).is_owner || !!(token as any).isOwner,
          is_owner: !!(token as any).is_owner || !!(token as any).isOwner,
          mustChangePassword: !!(token as any).must_change_password,
          fullName: (token as any).full_name ?? (token as any).fullName,
          dbName: (token as any).dbName,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
