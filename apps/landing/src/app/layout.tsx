import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AppProvider from "@/components/AppProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "PayWatch — Grip op je rekeningen",
  description: "PayWatch scant je e-mail, herkent rekeningen, toont escalatiefases en helpt je handelen voordat het duurder wordt. Gratis in beta.",
  metadataBase: new URL("https://paywatch.app"),
  openGraph: {
    title: "PayWatch — Grip op je rekeningen",
    description: "PayWatch scant je e-mail, herkent rekeningen, toont escalatiefases en helpt je handelen voordat het duurder wordt.",
    url: "https://paywatch.app",
    siteName: "PayWatch",
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PayWatch — Grip op je rekeningen",
    description: "Scan je inbox. Herken rekeningen. Bespaar op incassokosten.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className={`${jakarta.variable} font-sans`}>
        <AppProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CookieBanner />
        </AppProvider>
      </body>
    </html>
  );
}
