import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { AppProvider } from "@/components/AppProvider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "PayWatch — Grip op je rekeningen",
  description: "PayWatch scant je inbox, houdt je rekeningen bij en waarschuwt je voor escalaties. Voorkom extra incassokosten.",
  openGraph: {
    title: "PayWatch — Grip op je rekeningen",
    description: "Track en beheer je huishoudelijke rekeningen met AI.",
    url: "https://paywatch.app",
    siteName: "PayWatch",
    locale: "nl_NL",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className={`${jakarta.variable} font-sans antialiased bg-pw-bg dark:bg-[#0B1120] text-pw-text dark:text-[#F1F5F9] transition-colors`}>
        <AppProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CookieBanner />
        </AppProvider>
      </body>
    </html>
  );
}
