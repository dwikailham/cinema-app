export function SeatLegend() {
  const items = [
    { color: "bg-[#22c55e]/20 border-[#22c55e]/50", label: "Available" },
    { color: "bg-[#3b82f6] border-[#2563eb]", label: "Selected" },
    { color: "bg-[#374151] border-[#4b5563]", label: "Booked" },
  ];

  const zones = [
    { color: "bg-yellow-500/20 border-yellow-500/40", label: "Premium (A–B, +30%)" },
    { color: "bg-[#2a2a3e] border-[#3a3a52]", label: "Regular (C–F)" },
    { color: "bg-blue-500/20 border-blue-500/40", label: "Economy (G–H, −20%)" },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 bg-[#1e1e2e] rounded-xl border border-[#2a2a3e]">
      <div>
        <p className="text-xs font-semibold text-[#6b6b88] uppercase tracking-wider mb-2">
          Seat Status
        </p>
        <div className="flex flex-wrap gap-3">
          {items.map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className={`w-5 h-5 rounded-t border ${color}`}
              />
              <span className="text-xs text-[#a0a0b8]">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-[#6b6b88] uppercase tracking-wider mb-2">
          Price Zones
        </p>
        <div className="flex flex-wrap gap-3">
          {zones.map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-5 h-4 rounded border ${color}`} />
              <span className="text-xs text-[#a0a0b8]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
