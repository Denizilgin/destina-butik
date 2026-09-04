"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";

export default function FeaturedCarousel({ products }: { products: Product[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(amount: number) {
    scrollerRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl text-charcoal sm:text-3xl">
            Tüm Ürünlerimiz
          </h2>
          <p className="mt-1 text-sm text-charcoal-soft">
            Shopier mağazamızdaki takımlarımızı keşfedin.
          </p>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            onClick={() => scrollBy(-320)}
            aria-label="Geri"
            className="rounded-full border border-nude p-2 text-charcoal transition hover:border-gold hover:text-gold"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scrollBy(320)}
            aria-label="İleri"
            className="rounded-full border border-nude p-2 text-charcoal transition hover:border-gold hover:text-gold"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2 sm:gap-5"
      >
        {products.map((product) => (
          <div key={product.id} className="w-[46vw] shrink-0 sm:w-56 lg:w-64">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
