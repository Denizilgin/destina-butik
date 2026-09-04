"use client";

import { ArrowUpDown } from "lucide-react";

export type SortOption = "newest" | "price-asc" | "price-desc";

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Önce En Yeni" },
  { value: "price-asc", label: "Fiyat: Artan" },
  { value: "price-desc", label: "Fiyat: Azalan" },
];

export default function SortSelect({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-charcoal-soft">
      <ArrowUpDown size={15} className="hidden sm:block" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="rounded-md border border-nude bg-white px-3 py-2 text-sm text-charcoal outline-none focus:border-gold"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
