"use client";

import Link from "next/link";
import { X, ChevronRight, User, Search } from "lucide-react";
import { useEffect } from "react";
import type { NavCategory } from "@/lib/data/categories";
import { SHOPIER_STORE_URL } from "@/lib/shopier";

export default function MobileMenu({
  isOpen,
  onClose,
  categories,
}: {
  isOpen: boolean;
  onClose: () => void;
  categories: NavCategory[];
}) {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!isOpen}
    >
      <button
        aria-label="Menüyü kapat"
        onClick={onClose}
        className="absolute inset-0 bg-charcoal/40"
      />
      <aside
        className={`absolute left-0 top-0 flex h-full w-full max-w-xs flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-nude px-5 py-4">
          <span className="font-display text-lg">Menü</span>
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="rounded-full p-1.5 text-charcoal-soft hover:bg-ivory"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2 border-b border-nude px-5 py-3">
          <Search size={16} className="text-charcoal-soft" />
          <input
            type="search"
            placeholder="Ürün ara..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-charcoal-soft/70"
          />
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          <ul>
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/kategori/${cat.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between px-5 py-3.5 text-sm text-charcoal hover:bg-ivory"
                >
                  {cat.name}
                  <ChevronRight size={16} className="text-mink" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-nude px-5 py-4">
          <a
            href={SHOPIER_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center gap-2 text-sm text-charcoal-soft hover:text-charcoal"
          >
            <User size={16} />
            Sipariş Takibi (Shopier)
          </a>
        </div>
      </aside>
    </div>
  );
}
