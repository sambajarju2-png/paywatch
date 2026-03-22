"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useApp } from "./AppProvider";

interface NavItem {
  label: { nl: string; en: string };
  href: string;
  isExternal?: boolean;
}

interface SanityContentContextType {
  /** Get an app string override. Returns the Sanity value or the fallback. */
  getString: (key: string, fallback: string) => string;
  /** Get navigation items for a placement. Returns Sanity items or null. */
  getNav: (placement: string) => NavItem[] | null;
  /** Whether Sanity content has loaded */
  loaded: boolean;
}

const SanityContentContext = createContext<SanityContentContextType | null>(null);

export function useSanityContent(): SanityContentContextType {
  const ctx = useContext(SanityContentContext);
  if (!ctx) {
    // Fallback for components outside the provider
    return {
      getString: (_key: string, fallback: string) => fallback,
      getNav: () => null,
      loaded: false,
    };
  }
  return ctx;
}

export default function SanityContentProvider({ children }: { children: ReactNode }) {
  const { lang } = useApp();
  const [strings, setStrings] = useState<Record<string, { nl: string; en: string }>>({});
  const [navigation, setNavigation] = useState<Record<string, NavItem[]>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [stringsRes, navRes] = await Promise.all([
          fetch("/api/app-strings").then((r) => r.json()).catch(() => ({ strings: {} })),
          fetch("/api/navigation").then((r) => r.json()).catch(() => ({ navigation: {} })),
        ]);
        if (!cancelled) {
          setStrings(stringsRes.strings || {});
          setNavigation(navRes.navigation || {});
          setLoaded(true);
        }
      } catch {
        if (!cancelled) setLoaded(true);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  function getString(key: string, fallback: string): string {
    const override = strings[key];
    if (override) {
      const text = override[lang];
      if (text) return text;
    }
    return fallback;
  }

  function getNav(placement: string): NavItem[] | null {
    return navigation[placement] || null;
  }

  return (
    <SanityContentContext.Provider value={{ getString, getNav, loaded }}>
      {children}
    </SanityContentContext.Provider>
  );
}

export type { NavItem };
