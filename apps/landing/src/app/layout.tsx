import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AppProvider from "@/components/AppProvider";
import SanityContentProvider from "@/components/SanityContentProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { Analytics } from '@vercel/analytics/react';

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://paywatch.app"),
  title: {
    default: "PayWatch — Grip op je rekeningen",
    template: "%s | PayWatch",
  },
  description: "PayWatch scant je e-mail, herkent rekeningen, toont escalatiefases en helpt je handelen voordat het duurder wordt. Gratis beschikbaar in 43+ gemeenten.",
  keywords: [
    "rekeningen bijhouden", "schulden tracker", "incassokosten besparen",
    "escalatie tracking", "bill tracker", "debt management", "Netherlands",
    "schuldhulp", "factuur herinnering", "aanmaning", "incasso",
    "PayWatch", "huishoudelijke rekeningen", "financieel overzicht",
  ],
  authors: [{ name: "PayWatch" }],
  creator: "PayWatch",
  publisher: "PayWatch",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: {
    canonical: "https://paywatch.app",
    languages: { "nl-NL": "https://paywatch.app", "en": "https://paywatch.app" },
  },
  openGraph: {
    title: "PayWatch — Grip op je rekeningen",
    description: "Scan je inbox. Herken rekeningen. Bespaar op incassokosten. Gratis in beta.",
    url: "https://paywatch.app",
    siteName: "PayWatch",
    locale: "nl_NL",
    alternateLocale: "en_US",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PayWatch — Grip op je rekeningen" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PayWatch — Grip op je rekeningen",
    description: "Scan je inbox. Herken rekeningen. Bespaar op incassokosten.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        {/* JSON-LD — Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "PayWatch",
              legalName: "PayWatch",
              url: "https://paywatch.app",
              description: "Dutch household bill tracker that scans emails, tracks escalation stages, and helps users avoid unnecessary collection costs.",
              foundingDate: "2025",
              founders: [
                { "@type": "Person", name: "Samba", jobTitle: "Co-founder & CTO", url: "https://www.linkedin.com/in/sambajarju/" },
                { "@type": "Person", name: "Mariama", jobTitle: "Co-founder & CMO", url: "https://www.linkedin.com/in/hadja-mariama-sesay-3a5392228/" },
              ],
              address: { "@type": "PostalAddress", addressLocality: "Rotterdam", addressCountry: "NL" },
              contactPoint: { "@type": "ContactPoint", email: "info@paywatch.nl", contactType: "customer service", availableLanguage: ["Dutch", "English"] },
              sameAs: [
                "https://www.linkedin.com/in/sambajarju/",
                "https://www.linkedin.com/in/hadja-mariama-sesay-3a5392228/",
              ],
            }),
          }}
        />
        {/* JSON-LD — SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "PayWatch",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              offers: { "@type": "Offer", price: "0", priceCurrency: "EUR", description: "Free in beta" },
              description: "AI-powered household bill tracker for the Netherlands. Scans Gmail for invoices, tracks escalation stages, and helps avoid collection costs.",
              availableLanguage: ["nl", "en"],
              featureList: "Gmail scanning, Escalation tracking, AI draft letters, Cashflow forecast, Financial health score, Payment links",
            }),
          }}
        />
      </head>
      <body className={`${jakarta.variable} font-sans`}>
        <AppProvider>
          <SanityContentProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <CookieBanner />
          </SanityContentProvider>
        </AppProvider>
      </body>
    </html>
  );
}
