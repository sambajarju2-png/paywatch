import type { Metadata } from "next";
import "./globals.css";
import AuthGate from "@/components/AuthGate";
import AdminSidebar from "@/components/AdminSidebar";

export const metadata: Metadata = {
  title: { default: "PayWatch Admin", template: "%s | PayWatch Admin" },
  description: "PayWatch admin dashboard",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthGate>
          <div className="flex min-h-screen">
            <AdminSidebar />
            <main className="flex-1 ml-0 md:ml-64 p-4 sm:p-8">
              {children}
            </main>
          </div>
        </AuthGate>
      </body>
    </html>
  );
}
