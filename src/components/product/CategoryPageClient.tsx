"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Product } from "@/lib/types";
import ProductGrid from "@/components/product/ProductGrid";
import FilterPanel, {
  FilterState,
  emptyFilterState,
  PRICE_RANGES,
} from "@/components/product/FilterPanel";
import SortSelect, { SortOption } from "@/components/product/SortSelect";

export default function CategoryPageClient({
  categoryName,
  products,
}: {
  categoryName: string;
  products: Product[];
}) {
  const [filters, setFilters] = useState<FilterState>(emptyFilterState());
  const [sort, setSort] = useState<SortOption>("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const availableSizes = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.sizes))),
    [products]
  );
  const availableColors = useMemo(() => {
    const map = new Map<string, { name: string; hex: string }>();
    products.forEach((p) => p.colors.forEach((c) => map.set(c.name, c)));
    return Array.from(map.values());
  }, [products]);

  const filtered = useMemo(() => {
    const range = PRICE_RANGES.find((r) => r.label === filters.priceRange);
    let list = products.filter((p) => {
      if (filters.sizes.length > 0 && !p.sizes.some((s) => filters.sizes.includes(s)))
        return false;
      if (
        filters.colors.length > 0 &&
        !p.colors.some((c) => filters.colors.includes(c.name))
      )
        return false;
      if (range && !(p.price >= range.min && p.price <= range.max)) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1;
    });

    return list;
  }, [products, filters, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-charcoal sm:text-3xl">{categoryName}</h1>
        <p className="mt-1 text-sm text-charcoal-soft">{filtered.length} ürün</p>
      </div>

      <div className="mb-6 flex items-center justify-between border-y border-nude py-3 lg:hidden">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 text-sm font-medium text-charcoal"
        >
          <SlidersHorizontal size={16} />
          Filtrele
        </button>
        <SortSelect value={sort} onChange={setSort} />
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <FilterPanel
            availableSizes={availableSizes}
            availableColors={availableColors}
            filters={filters}
            onChange={setFilters}
            onClear={() => setFilters(emptyFilterState())}
          />
        </aside>

        <div>
          <div className="mb-6 hidden justify-end lg:flex">
            <SortSelect value={sort} onChange={setSort} />
          </div>
          <ProductGrid products={filtered} />
        </div>
      </div>

      {/* mobile filter drawer */}
      <div
        className={`fixed inset-0 z-50 transition-opacity lg:hidden ${
          mobileFiltersOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          aria-label="Kapat"
          onClick={() => setMobileFiltersOpen(false)}
          className="absolute inset-0 bg-charcoal/40"
        />
        <div
          className={`absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white px-5 pb-6 pt-5 transition-transform duration-300 ${
            mobileFiltersOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="font-display text-lg">Filtrele</span>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              aria-label="Kapat"
              className="rounded-full p-1.5 text-charcoal-soft hover:bg-ivory"
            >
              <X size={20} />
            </button>
          </div>
          <FilterPanel
            availableSizes={availableSizes}
            availableColors={availableColors}
            filters={filters}
            onChange={setFilters}
            onClear={() => setFilters(emptyFilterState())}
          />
          <button
            onClick={() => setMobileFiltersOpen(false)}
            className="mt-6 w-full rounded-full bg-charcoal py-3 text-sm font-medium text-white"
          >
            Sonuçları Göster ({filtered.length})
          </button>
        </div>
      </div>
    </div>
  );
}
