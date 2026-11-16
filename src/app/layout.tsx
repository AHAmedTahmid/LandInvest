import type { Metadata } from "next";
import "./globals.css";
import AppShell from "./AppShell";
import { LanguageProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "LandInvest ERP — Partnership Accounting",
  description: "Real Estate Syndicate & Partnership Accounting",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-slate-50">
        <LanguageProvider><AppShell>{children}</AppShell></LanguageProvider>
      </body>
    </html>
  );
}
