"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/components/AppProvider";
import { t } from "@/lib/config";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const { lang } = useApp();
  const tx = t[lang];

  useEffect(() => {
    const dismissed = localStorage.getItem("pw-cookie-dismissed");
    if (!dismissed) setShow(true);
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem("pw-cookie-dismissed", "true");
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6">
      <div className="max-w-[680px] mx-auto bg-pw-navy dark:bg-[#111827] rounded-2xl p-5 flex items-center gap-5 shadow-[0_-4px_40px_rgba(0,0,0,0.15)]">
        <div className="flex-1">
          <p className="text-[14px] font-semibold text-white mb-1">{tx.cookieTitle}</p>
          <p className="text-[12px] text-white/50 leading-relaxed">{tx.cookieSub}</p>
        </div>
        <button
          onClick={dismiss}
          className="bg-pw-blue text-white border-none rounded-lg px-5 py-[10px] text-[13px] font-semibold cursor-pointer shrink-0 hover:bg-blue-700 transition-colors"
        >
          {tx.cookieBtn}
        </button>
      </div>
    </div>
  );
}
