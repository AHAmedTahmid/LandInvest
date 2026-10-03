import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "./AppShell";
import { LanguageProvider } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "LandInvest ERP — Partnership Accounting",
  description: "Real Estate Syndicate & Partnership Accounting",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50">
        <LanguageProvider><AppShell>{children}</AppShell></LanguageProvider>
      </body>
    </html>
  );
}
