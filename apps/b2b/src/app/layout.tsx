import type { Metadata } from "next";
import { getTenant } from "@/lib/tenant";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  const title = tenant.mode === "super-admin"
    ? "PayWatch B2B — Platform Admin"
    : `${tenant.orgName || "Partner"} — PayWatch`;

  return {
    title,
    description: "PayWatch B2B Partner Portal",
    robots: { index: false, follow: false },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tenant = await getTenant();

  return (
    <html lang="nl">
      <body
        className="bg-gray-50 text-gray-900 antialiased"
        style={{ "--tenant-color": tenant.primaryColor } as React.CSSProperties}
      >
        {children}
      </body>
    </html>
  );
}
