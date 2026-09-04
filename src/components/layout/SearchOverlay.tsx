"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export default function SearchOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  function handleClose() {
    setQuery("");
    onClose();
  }

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    fetch("/api/products")
      .then((res) => res.json())
      .then(setAllProducts)
      .catch(() => setAllProducts([]));
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr-TR");
    if (!q) return [];
    return allProducts
      .filter((p) => p.name.toLocaleLowerCase("tr-TR").includes(q))
      .slice(0, 6);
  }, [query, allProducts]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!isOpen}
    >
      <button
        aria-label="Aramayı kapat"
        onClick={handleClose}
        className="absolute inset-0 bg-charcoal/40"
      />
      <div className="absolute inset-x-0 top-0 bg-white shadow-lg">
        <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3 border-b border-nude pb-3">
            <Search size={20} className="text-charcoal-soft" />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Elbise, tunik, şal ara..."
              className="w-full bg-transparent text-base outline-none placeholder:text-charcoal-soft/70"
            />
            <button
              onClick={handleClose}
              aria-label="Kapat"
              className="rounded-full p-1.5 text-charcoal-soft hover:bg-ivory"
            >
              <X size={20} />
            </button>
          </div>

          {results.length > 0 && (
            <ul className="mt-3 max-h-96 divide-y divide-nude overflow-y-auto">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/urun/${p.slug}`}
                    onClick={handleClose}
                    className="flex items-center gap-3 py-3 hover:bg-ivory"
                  >
                    <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded bg-ivory">
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        sizes="48px"
                        loading="lazy"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-charcoal-soft">{formatPrice(p.price)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {query && results.length === 0 && (
            <p className="py-6 text-center text-sm text-charcoal-soft">
              &ldquo;{query}&rdquo; için sonuç bulunamadı.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
