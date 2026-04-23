import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export function Input({ label, error, icon, className = "", ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[#a0a0b8]">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b88]">
            {icon}
          </span>
        )}
        <input
          className={`
            w-full bg-[#1e1e2e] border border-[#3a3a52] rounded-lg
            text-[#f1f1f8] placeholder-[#6b6b88]
            transition-all duration-200
            focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946]
            hover:border-[#3a3a52]
            ${icon ? "pl-9 pr-4 py-2.5" : "px-4 py-2.5"}
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
            ${className}
          `}
          {...rest}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
