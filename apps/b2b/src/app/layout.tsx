import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { getTenant } from "@/lib/tenant";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  const title = tenant.mode === "super-admin"
    ? "PayWatch B2B — Platform Admin"
    : `${tenant.orgName || "Partner"} — PayWatch`;

  return {
    title,
    description: "PayWatch B2B Partner Portal",
    robots: { index: false, follow: false },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
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
        className={jakarta.className}
        style={{
          margin: 0,
          background: "#F4F7FB",
          "--tenant-color": tenant.primaryColor,
        } as React.CSSProperties}
      >
        {children}
      </body>
    </html>
  );
}
