export function TrustBar() {
  const badges = [
    { icon: "M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20", label: "EU Product" },
    { icon: "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4", label: "GDPR / AVG" },
    { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label: "SOC 2 Type II" },
    { icon: "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4", label: "AES-256 encryptie" },
  ];

  return (
    <section className="py-4 px-6 bg-white border-y border-pw-border/50">
      <div className="max-w-[1140px] mx-auto flex justify-center gap-10 md:gap-12">
        {badges.map((b) => (
          <div key={b.label} className="flex items-center gap-2 opacity-40">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A2540" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d={b.icon} />
            </svg>
            <span className="text-[11px] font-semibold text-pw-navy tracking-wide">{b.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
