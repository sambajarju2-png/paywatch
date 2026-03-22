import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "pwf6qbjc",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-03-15",
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
});

/* Hardcoded fallback — only completed features */
const FALLBACK_ITEMS = [
  { title: { nl: "Gmail scanning", en: "Gmail scanning" }, description: { nl: "Automatisch rekeningen herkennen uit je inbox via de Gmail API.", en: "Automatically detect bills from your inbox via Gmail API." }, quarter: "Q1 2025", status: "done", order: 10 },
  { title: { nl: "Escalatie tracking", en: "Escalation tracking" }, description: { nl: "Realtime fases bijhouden: factuur → herinnering → aanmaning → incasso → deurwaarder.", en: "Track stages in real-time: invoice → reminder → notice → collection → bailiff." }, quarter: "Q1 2025", status: "done", order: 20 },
  { title: { nl: "AI extractie", en: "AI extraction" }, description: { nl: "Claude Haiku herkent automatisch bedragen, deadlines en IBAN uit e-mails.", en: "Claude Haiku automatically extracts amounts, deadlines and IBAN from emails." }, quarter: "Q1 2025", status: "done", order: 30 },
  { title: { nl: "Dashboard & statistieken", en: "Dashboard & statistics" }, description: { nl: "Financieel overzicht met health score, categorieën en besparingen.", en: "Financial overview with health score, categories and savings." }, quarter: "Q2 2025", status: "done", order: 40 },
  { title: { nl: "Betaallinks", en: "Payment links" }, description: { nl: "Directe betaallinks uit facturen zodat je met één klik kunt betalen.", en: "Direct payment links from invoices so you can pay in one click." }, quarter: "Q2 2025", status: "done", order: 50 },
  { title: { nl: "335+ gemeenten", en: "335+ municipalities" }, description: { nl: "Schuldhulpverlening data voor alle Nederlandse gemeenten met lokale hulporganisaties.", en: "Debt counseling data for all Dutch municipalities with local help organizations." }, quarter: "Q2 2025", status: "done", order: 60 },
  { title: { nl: "Meertalig (NL/EN)", en: "Bilingual (NL/EN)" }, description: { nl: "Volledige app en website beschikbaar in Nederlands en Engels.", en: "Full app and website available in Dutch and English." }, quarter: "Q3 2025", status: "done", order: 70 },
  { title: { nl: "Donkere modus", en: "Dark mode" }, description: { nl: "Schakel tussen licht en donker thema voor comfortabel gebruik.", en: "Switch between light and dark theme for comfortable use." }, quarter: "Q3 2025", status: "done", order: 80 },
];

export async function GET() {
  try {
    const items = await client.fetch(
      `*[_type == "roadmapItem"] | order(order asc, launchDate asc) {
        "title": title,
        "description": description,
        quarter,
        launchDate,
        status,
        url,
        features,
        order
      }`
    );

    if (items && items.length > 0) {
      return NextResponse.json({ items, source: "sanity" });
    }

    return NextResponse.json({ items: FALLBACK_ITEMS, source: "fallback" });
  } catch (error) {
    console.error("[Roadmap API] Error:", error);
    return NextResponse.json({ items: FALLBACK_ITEMS, source: "fallback" });
  }
}
