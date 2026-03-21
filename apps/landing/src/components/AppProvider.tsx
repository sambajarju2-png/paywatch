"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Lang = "nl" | "en";
type Theme = "light" | "dark";

interface AppContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const AppContext = createContext<AppContextType>({
  lang: "nl", setLang: () => {},
  theme: "light", setTheme: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("nl");
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const savedLang = localStorage.getItem("pw-lang") as Lang;
    const savedTheme = localStorage.getItem("pw-theme") as Theme;
    if (savedLang) setLangState(savedLang);
    if (savedTheme) setThemeState(savedTheme);
    if (savedTheme === "dark") document.documentElement.classList.add("dark");
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("pw-lang", l);
    document.documentElement.lang = l;
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("pw-theme", t);
    if (t === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <AppContext.Provider value={{ lang, setLang, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
