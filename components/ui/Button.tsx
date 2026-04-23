import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses: Record<string, string> = {
    primary:
      "bg-[#e63946] hover:bg-[#c1121f] text-white focus:ring-[#e63946] active:scale-95",
    secondary:
      "bg-[#2a2a3e] hover:bg-[#3a3a52] text-[#f1f1f8] border border-[#3a3a52] focus:ring-[#3a3a52]",
    ghost:
      "bg-transparent hover:bg-[#1e1e2e] text-[#a0a0b8] hover:text-[#f1f1f8] focus:ring-[#3a3a52]",
    danger:
      "bg-transparent hover:bg-red-950 text-red-400 border border-red-800 hover:border-red-600 focus:ring-red-700",
  };

  const sizeClasses: Record<string, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
