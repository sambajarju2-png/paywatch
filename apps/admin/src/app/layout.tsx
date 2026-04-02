import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthGate } from "@/components/AuthGate";
import { AdminSidebar } from "@/components/AdminSidebar";
import { SessionSync } from "@/components/SessionSync";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "PayWatch Admin",
  description: "Admin dashboard voor PayWatch",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className={jakarta.className} style={{ margin: 0, background: "#F8FAFC" }}>
        <AuthGate>
          <SessionSync />
          <div style={{ display: "flex", minHeight: "100vh" }}>
            <AdminSidebar />
            <main style={{ flex: 1, maxWidth: 1200, overflowX: "hidden" }} className="pw-main-content">
              {children}
            </main>
          </div>
        </AuthGate>
      </body>
    </html>
  );
}
