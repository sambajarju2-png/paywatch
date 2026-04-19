"use client";

interface HamburgerIconProps {
  onClick: () => void;
}

export default function HamburgerIcon({ onClick }: HamburgerIconProps) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center justify-center gap-[5px] p-2 transition-all"
      aria-label="Open menu"
    >
      {/* Top bar — shrinks on hover */}
      <span className="block h-[2px] w-5 bg-slate-300 transition-all duration-300 group-hover:w-4" />
      {/* Middle bar — accent color, grows on hover */}
      <span className="block h-[2px] w-3.5 bg-[#2563EB] transition-all duration-300 group-hover:w-5" />
      {/* Bottom bar — shrinks on hover */}
      <span className="block h-[2px] w-5 bg-slate-300 transition-all duration-300 group-hover:w-3" />
    </button>
  );
}
