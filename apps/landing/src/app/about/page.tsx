"use client";

import { siteConfig } from "@/lib/config";
import { useApp } from "@/components/AppProvider";

export default function AboutPage() {
  const { lang } = useApp();
  return (
    <section className="py-16 px-6 bg-pw-bg min-h-screen">
      <div className="max-w-[800px] mx-auto">
        <span className="text-[12px] font-semibold text-pw-blue tracking-widest uppercase">{lang === "nl" ? "Over ons" : "About us"}</span>
        <h1 className="text-[40px] font-extrabold text-pw-navy mt-2 mb-5 tracking-tight leading-tight">
          {lang === "nl" ? "Gebouwd uit frustratie." : "Built from frustration."}<br />{lang === "nl" ? "Gedreven door empathie." : "Driven by empathy."}
        </h1>
        <p className="text-[16px] text-pw-muted leading-[1.7] mb-10 max-w-[600px]">
          {lang === "nl" ? "We zagen het om ons heen: mensen die niet snapten waarom een rekening van €50 opeens €200 was geworden. Het incassosysteem in Nederland is ingewikkeld, onpersoonlijk en duur. Dat moest anders." : "We saw it around us: people who didn't understand why a €50 bill suddenly became €200. The Dutch collection system is complex, impersonal, and expensive. That had to change."}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {Object.values(siteConfig.founders).map((p) => (
            <div key={p.name} className="bg-white rounded-card p-7 border border-pw-border">
              <div className="w-14 h-14 rounded-2xl bg-pw-blue-light flex items-center justify-center mb-4">
                <span className="text-[24px] font-extrabold text-pw-navy">{p.name[0]}</span>
              </div>
              <h3 className="text-[18px] font-bold text-pw-navy">{p.name}</h3>
              <p className="text-[12px] font-semibold text-pw-blue mb-3">{p.role}</p>
              <p className="text-[14px] text-pw-muted leading-relaxed">{p.desc[lang]}</p>
            </div>
          ))}
        </div>
        <div className="bg-pw-blue-light rounded-card p-7 text-center border border-pw-blue/10">
          <p className="text-[20px] font-bold text-pw-navy italic">&ldquo;{lang === "nl" ? "Gebouwd in Nederland, voor Nederland." : "Built in the Netherlands, for the Netherlands."}&rdquo;</p>
        </div>
      </div>
    </section>
  );
}
