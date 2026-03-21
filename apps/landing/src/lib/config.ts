// PayWatch Landing — Color & Config
// Edit these values to change the entire site's look
// Based on the PayWatch Design System v1.0

export const colors = {
  // Page & surfaces
  bg: "#F4F7FB",
  surface: "#FFFFFF",

  // Brand
  navy: "#0A2540",
  blue: "#2563EB",
  blueLight: "#EFF6FF",

  // Text
  text: "#0F172A",
  muted: "#64748B",

  // Borders
  border: "#E2E8F0",

  // Status / Escalation
  green: "#059669",
  greenLight: "#F0FDF4",
  amber: "#D97706",
  amberLight: "#FEF3C7",
  orange: "#EA580C",
  orangeLight: "#FFF7ED",
  red: "#DC2626",
  redLight: "#FEF2F2",
  darkRed: "#991B1B",
  purple: "#7C3AED",
  purpleLight: "#F5F3FF",
};

export const siteConfig = {
  name: "PayWatch",
  tagline: "Grip op je rekeningen",
  appUrl: "https://app.paywatch.app",
  kvk: "83474889",
  city: "Rotterdam",
  emails: {
    press: "pers@paywatch.nl",
    business: "business@paywatch.nl",
    general: "info@paywatch.nl",
    privacy: "privacy@paywatch.app",
  },
  founders: {
    samba: { name: "Samba", role: "Co-founder & CTO", desc: "Bouwt de technische kant: Next.js, Supabase, AI-integratie. Gelooft dat technologie er is om mensen te helpen, niet om het ingewikkelder te maken." },
    mariama: { name: "Mariama", role: "Co-founder & CMO", desc: "Bepaalt de toon, het gevoel en de groei. Zorgt dat PayWatch menselijk blijft — omdat schulden al onpersoonlijk genoeg zijn." },
  },
  // Primary navigation — easy to add/remove items
  nav: [
    { label: "Features", href: "/features" },
    { label: "Over ons", href: "/about" },
    { label: "Resources", href: "/resources" },
    { label: "Contact", href: "/contact" },
  ],
  // Footer columns — easy to edit
  footerColumns: [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/features" },
        { label: "Resources", href: "/resources" },
      ],
    },
    {
      title: "Bedrijf",
      links: [
        { label: "Over ons", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Vacatures", href: "/jobs" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "/privacy" },
        { label: "Voorwaarden", href: "/terms" },
        { label: "Data verwerking", href: "/data-processing" },
      ],
    },
  ],
  // Municipality data for search
  gemeenten: [
    "Amsterdam","Rotterdam","Den Haag","Utrecht","Eindhoven","Groningen","Tilburg",
    "Almere","Breda","Nijmegen","Apeldoorn","Haarlem","Arnhem","Enschede",
    "Amersfoort","Zaanstad","Haarlemmermeer","Den Bosch","Zoetermeer","Zwolle",
    "Leiden","Maastricht","Dordrecht","Ede","Leeuwarden","Alphen a/d Rijn",
    "Alkmaar","Emmen","Delft","Deventer","Helmond","Venlo","Hilversum",
    "Heerlen","Oss","Sittard-Geleen","Roosendaal","Purmerend","Vlaardingen",
    "Schiedam","Gouda","Leidschendam-Voorburg","Hoorn",
  ],
};
