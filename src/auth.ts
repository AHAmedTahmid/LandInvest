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
          role: user.role,
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
        (token as any).role = user.role;
        token.role = user.role;
        (token as any).full_name = user.fullName;
        (token as any).fullName = user.fullName;
        (token as any).dbName = user.dbName;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        (session.user as any) = {
          id: token.sub ?? (token as any).user_id,
          email: token.email ?? session.user?.email,
          tenantId: (token as any).tenant_id ?? token.tenantId,
          role: (token as any).role ?? token.role,
          fullName: (token as any).full_name ?? (token as any).fullName,
          dbName: (token as any).dbName,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
