"use client";

export type PriceRange = { label: string; min: number; max: number };

export const PRICE_RANGES: PriceRange[] = [
  { label: "2.200 TL", min: 2200, max: 2200 },
  { label: "2.300 TL", min: 2300, max: 2300 },
  { label: "2.400 TL ve üzeri", min: 2400, max: Infinity },
];

export type FilterState = {
  sizes: string[];
  colors: string[];
  priceRange: string | null;
};

export function emptyFilterState(): FilterState {
  return { sizes: [], colors: [], priceRange: null };
}

export default function FilterPanel({
  availableSizes,
  availableColors,
  filters,
  onChange,
  onClear,
}: {
  availableSizes: string[];
  availableColors: { name: string; hex: string }[];
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
}) {
  function toggleSize(size: string) {
    const sizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onChange({ ...filters, sizes });
  }

  function toggleColor(color: string) {
    const colors = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onChange({ ...filters, colors });
  }

  function setPriceRange(label: string) {
    onChange({
      ...filters,
      priceRange: filters.priceRange === label ? null : label,
    });
  }

  const hasActiveFilters =
    filters.sizes.length > 0 || filters.colors.length > 0 || !!filters.priceRange;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-charcoal">Filtrele</h2>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-xs font-medium text-plum underline underline-offset-2"
          >
            Temizle
          </button>
        )}
      </div>

      {availableSizes.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-charcoal">Beden</h3>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => {
              const active = filters.sizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`min-w-[2.5rem] rounded-md border px-2.5 py-1.5 text-xs transition ${
                    active
                      ? "border-charcoal bg-charcoal text-white"
                      : "border-nude text-charcoal-soft hover:border-charcoal"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {availableColors.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-charcoal">Renk</h3>
          <div className="flex flex-wrap gap-3">
            {availableColors.map((color) => {
              const active = filters.colors.includes(color.name);
              return (
                <button
                  key={color.name}
                  onClick={() => toggleColor(color.name)}
                  aria-label={color.name}
                  title={color.name}
                  className={`h-8 w-8 rounded-full border-2 transition ${
                    active ? "border-gold" : "border-transparent"
                  }`}
                >
                  <span
                    className="block h-full w-full rounded-full ring-1 ring-inset ring-black/10"
                    style={{ backgroundColor: color.hex }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-3 text-sm font-semibold text-charcoal">Fiyat Aralığı</h3>
        <div className="flex flex-col gap-2.5">
          {PRICE_RANGES.map((range) => (
            <label
              key={range.label}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-charcoal-soft"
            >
              <input
                type="radio"
                name="price-range"
                checked={filters.priceRange === range.label}
                onChange={() => setPriceRange(range.label)}
                className="h-4 w-4 accent-gold"
              />
              {range.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
