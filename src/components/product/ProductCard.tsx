import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  const hasDiscount = !!product.compareAtPrice;

  return (
    <div className="group relative flex flex-col">
      <Link
        href={`/urun/${product.slug}`}
        className="relative block aspect-[3/4] w-full overflow-hidden rounded-lg bg-ivory"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
            !product.inStock ? "grayscale-[35%] opacity-80" : ""
          }`}
        />

        <div className="absolute left-2 top-2 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="rounded-full bg-charcoal px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-white">
              Yeni
            </span>
          )}
          {hasDiscount && (
            <span className="rounded-full bg-plum px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-white">
              İndirim
            </span>
          )}
          {!product.inStock && (
            <span className="rounded-full bg-charcoal-soft px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-white">
              Tükendi
            </span>
          )}
        </div>
      </Link>

      <div className="mt-3 flex flex-1 flex-col gap-1">
        <Link href={`/urun/${product.slug}`}>
          <h3 className="text-sm text-charcoal transition group-hover:text-gold-dark sm:text-[15px]">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${hasDiscount ? "text-plum" : "text-charcoal"}`}>
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-charcoal-soft line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
