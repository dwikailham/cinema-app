import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  hint?: string;
}

export function Input({ label, error, icon, hint, className = "", ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-semibold text-[#c0c0d8] tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b6b88]">
            {icon}
          </span>
        )}
        <input
          className={`
            w-full bg-[#1a1a28] border border-[#3a3a52] rounded-xl
            text-[#f1f1f8] placeholder-[#4a4a68] text-base
            transition-all duration-200
            focus:border-[#e63946] focus:ring-2 focus:ring-[#e63946]/20
            hover:border-[#4a4a68]
            ${icon ? "pl-12 pr-5 py-4" : "px-5 py-4"}
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
            ${className}
          `}
          {...rest}
        />
      </div>
      {hint && !error && (
        <p className="text-xs text-[#6b6b88] leading-relaxed">{hint}</p>
      )}
      {error && (
        <p className="text-sm text-red-400 font-medium">{error}</p>
      )}
    </div>
  );
}
