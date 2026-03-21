import type { Config } from "tailwindcss";
import sharedConfig from "@paywatch/config/tailwind";

const config: Config = {
  ...sharedConfig,
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default config;
