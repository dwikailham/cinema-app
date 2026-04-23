"use client";

import { Info, Users, Calendar, Clock, MapPin, Tag } from "lucide-react";
import type { PriceBreakdown as PriceBreakdownType } from "@/types";
import { formatPrice } from "@/lib/pricing";
import { Badge } from "@/components/ui/Badge";

interface PriceBreakdownProps {
  breakdown: PriceBreakdownType;
  seatCount: number;
}

export function PriceBreakdown({ breakdown, seatCount }: PriceBreakdownProps) {
  const hasGroupDiscount = breakdown.groupDiscount > 0;
  const hasDayMarkup = breakdown.dayMarkup > 1;
  const hasTimeMarkup = breakdown.timeMarkup > 1;

  return (
    <div className="bg-[#12121c]/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-10 space-y-8 shadow-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-[#f1f1f8] flex items-center gap-3">
          <Tag size={20} className="text-[#e63946]" />
          Order Summary
        </h3>
        <Badge label={`${seatCount} Seats`} variant="default" className="text-[10px] font-black" />
      </div>

      <div className="space-y-4">
        {/* Base Price */}
        <div className="flex items-center justify-between py-1">
          <span className="text-sm font-semibold text-[#6b6b88] uppercase tracking-widest">Base Fare</span>
          <span className="text-base font-bold text-[#f1f1f8]">
            {formatPrice(breakdown.basePrice * seatCount)}
          </span>
        </div>

        {/* Adjustments */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-[#6b6b88] uppercase tracking-tighter">Zone Premium ({breakdown.zoneLabel})</span>
            <span className="text-[#a0a0b8]">
              {breakdown.zoneMultiplier > 0 ? `+${Math.round((breakdown.zoneMultiplier - 1) * 100)}%` : "Mixed"}
            </span>
          </div>

          {hasDayMarkup && (
            <div className="flex items-center justify-between text-sm font-semibold py-0.5">
              <span className="text-[#6b6b88] uppercase tracking-tighter">Weekend Markup</span>
              <span className="text-[#ffd166]">+20%</span>
            </div>
          )}

          {hasTimeMarkup && (
            <div className="flex items-center justify-between text-sm font-semibold py-0.5">
              <span className="text-[#6b6b88] uppercase tracking-tighter">Prime Time Surcharge</span>
              <span className="text-[#ffd166]">+15%</span>
            </div>
          )}
        </div>

        {/* Subtotal */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs font-black text-[#f1f1f8] uppercase tracking-widest">Subtotal</span>
          <span className="text-lg font-black text-[#f1f1f8]">{formatPrice(breakdown.subtotal)}</span>
        </div>

        {/* Group Discount */}
        {hasGroupDiscount && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-between text-green-400">
            <div className="flex items-center gap-2">
              <Users size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Group Discount (-10%)</span>
            </div>
            <span className="font-bold">-{formatPrice(breakdown.subtotal * breakdown.groupDiscount)}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="pt-6 border-t border-[#e63946]/30 flex flex-col items-center gap-2">
        <span className="text-xs font-black text-[#6b6b88] uppercase tracking-widest">Total Amount Due</span>
        <span className="text-5xl font-black text-[#f1f1f8] tracking-tighter">
          {formatPrice(breakdown.total)}
        </span>
      </div>

      {!hasGroupDiscount && seatCount > 0 && seatCount < 4 && (
        <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
            <Info size={16} className="text-blue-400" />
          </div>
          <p className="text-xs text-[#a0a0b8] leading-relaxed font-medium">
            Book <span className="text-blue-400 font-bold">{4 - seatCount} more</span> tickets to unlock the <span className="text-blue-400 font-bold">10% group discount</span> automatically!
          </p>
        </div>
      )}
    </div>
  );
}
