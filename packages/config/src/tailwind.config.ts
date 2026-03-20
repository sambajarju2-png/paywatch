import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
      },
      colors: {
        pw: {
          bg: "#F4F7FB",
          surface: "#FFFFFF",
          navy: "#0A2540",
          blue: "#2563EB",
          "blue-light": "#EFF6FF",
          text: "#0F172A",
          muted: "#64748B",
          border: "#E2E8F0",
          green: "#059669",
          "green-light": "#F0FDF4",
          amber: "#D97706",
          "amber-light": "#FEF3C7",
          orange: "#EA580C",
          "orange-light": "#FFF7ED",
          red: "#DC2626",
          "red-light": "#FEF2F2",
          "dark-red": "#991B1B",
          purple: "#7C3AED",
          "purple-light": "#F5F3FF",
        },
      },
      borderRadius: {
        card: "12px",
        button: "4px",
        badge: "4px",
        input: "8px",
        drawer: "20px",
        segment: "8px",
      },
      fontSize: {
        hero: ["28px", { fontWeight: "800", letterSpacing: "-0.03em" }],
        "page-heading": ["22px", { fontWeight: "700", letterSpacing: "-0.02em" }],
        "section-head": ["16px", { fontWeight: "700", letterSpacing: "-0.01em" }],
        "card-title": ["14px", { fontWeight: "600" }],
        body: ["14px", { fontWeight: "400", lineHeight: "1.5" }],
        label: ["12px", { fontWeight: "500" }],
        caption: ["11px", { fontWeight: "400" }],
        tiny: ["10px", { fontWeight: "600" }],
      },
    },
  },
  plugins: [],
};

export default config;
