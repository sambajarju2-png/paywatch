import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hero Test | PayWatch",
  robots: { index: false, follow: false },
};

export default function HeroTestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
