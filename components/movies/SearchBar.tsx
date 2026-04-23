"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search movies...",
}: SearchBarProps) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b88]"
      />
      <input
        type="text"
        value={value}
        onChange={(evt) => onChange(evt.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#1e1e2e] border border-[#3a3a52] rounded-xl
          pl-9 pr-9 py-2.5 text-sm text-[#f1f1f8] placeholder-[#6b6b88]
          focus:outline-none focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946]
          transition-all duration-200"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b88] hover:text-[#f1f1f8] transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
