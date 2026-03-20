import React from "react";

type BadgeVariant = "green" | "amber" | "orange" | "red" | "darkRed" | "purple" | "blue" | "muted";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  green: { bg: "bg-pw-green-light", text: "text-pw-green", dot: "bg-pw-green" },
  amber: { bg: "bg-pw-amber-light", text: "text-pw-amber", dot: "bg-pw-amber" },
  orange: { bg: "bg-pw-orange-light", text: "text-pw-orange", dot: "bg-pw-orange" },
  red: { bg: "bg-pw-red-light", text: "text-pw-red", dot: "bg-pw-red" },
  darkRed: { bg: "bg-pw-red-light", text: "text-pw-dark-red", dot: "bg-pw-dark-red" },
  purple: { bg: "bg-pw-purple-light", text: "text-pw-purple", dot: "bg-pw-purple" },
  blue: { bg: "bg-pw-blue-light", text: "text-pw-blue", dot: "bg-pw-blue" },
  muted: { bg: "bg-gray-100", text: "text-pw-muted", dot: "bg-pw-muted" },
};

export function Badge({ variant = "muted", children, dot = false }: BadgeProps) {
  const styles = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-badge text-tiny font-semibold ${styles.bg} ${styles.text}`}
    >
      {dot && <span className={`w-2 h-2 rounded-full ${styles.dot}`} />}
      {children}
    </span>
  );
}
