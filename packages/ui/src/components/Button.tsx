import React from "react";

type ButtonVariant = "primary" | "secondary" | "tertiary";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  fullWidth = false,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-semibold text-[13px] rounded-button transition-transform active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-pw-blue text-white border-none px-4 py-2.5",
    secondary:
      "bg-white text-pw-text border border-pw-border px-4 py-2.5",
    tertiary:
      "bg-transparent text-pw-blue border-none px-0 py-1.5",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
