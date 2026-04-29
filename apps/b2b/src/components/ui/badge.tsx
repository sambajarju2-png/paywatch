import * as React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "purple";
}

const VARIANTS: Record<string, string> = {
  default: "bg-pw-bg text-pw-muted",
  success: "bg-green-50 text-pw-green",
  warning: "bg-amber-50 text-pw-amber",
  error: "bg-red-50 text-pw-red",
  info: "bg-blue-50 text-pw-blue",
  purple: "bg-purple-50 text-pw-purple",
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  )
);
Badge.displayName = "Badge";

export { Badge };
