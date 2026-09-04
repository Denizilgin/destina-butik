"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, User, ShoppingBag } from "lucide-react";
import type { NavCategory } from "@/lib/data/categories";
import { SHOPIER_STORE_URL } from "@/lib/shopier";
import MobileMenu from "@/components/layout/MobileMenu";
import SearchOverlay from "@/components/layout/SearchOverlay";

export default function Header({ categories }: { categories: NavCategory[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-nude bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Menüyü aç"
          className="-ml-2 p-2 text-charcoal lg:hidden"
        >
          <Menu size={24} strokeWidth={1.5} />
        </button>

        <Link
          href="/"
          className="font-display text-2xl tracking-wide text-charcoal sm:text-3xl"
        >
          Destina <span className="text-gold">Butik</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Ara"
            className="rounded-full p-2 text-charcoal hover:bg-ivory"
          >
            <Search size={21} strokeWidth={1.5} />
          </button>
          <a
            href={SHOPIER_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Sipariş Takibi (Shopier)"
            className="hidden rounded-full p-2 text-charcoal hover:bg-ivory sm:inline-flex"
          >
            <User size={21} strokeWidth={1.5} />
          </a>
          <a
            href={SHOPIER_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Shopier Mağazamız"
            className="rounded-full p-2 text-charcoal hover:bg-ivory"
          >
            <ShoppingBag size={21} strokeWidth={1.5} />
          </a>
        </div>
      </div>

      <nav className="hidden border-t border-nude lg:block">
        <ul className="mx-auto flex max-w-7xl items-center justify-center gap-8 px-6 py-3 text-sm">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/kategori/${cat.slug}`}
                className="tracking-wide text-charcoal-soft transition hover:text-gold"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        categories={categories}
      />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
