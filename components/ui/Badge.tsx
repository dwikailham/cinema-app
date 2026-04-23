interface BadgeProps {
  label: string;
  variant?: "genre" | "rating" | "status-confirmed" | "status-cancelled" | "zone-premium" | "zone-regular" | "zone-economy";
}

export function Badge({ label, variant = "genre" }: BadgeProps) {
  const variantClasses: Record<string, string> = {
    genre: "bg-[#1e1e2e] text-[#a0a0b8] border border-[#3a3a52]",
    rating: "bg-[#2a2a3e] text-[#ffd166] border border-[#ffd166]/30",
    "status-confirmed": "bg-emerald-950 text-emerald-400 border border-emerald-800",
    "status-cancelled": "bg-red-950 text-red-400 border border-red-800",
    "zone-premium": "bg-yellow-950 text-yellow-400 border border-yellow-800",
    "zone-regular": "bg-[#1e1e2e] text-[#a0a0b8] border border-[#3a3a52]",
    "zone-economy": "bg-blue-950 text-blue-400 border border-blue-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]}`}
    >
      {label}
    </span>
  );
}
