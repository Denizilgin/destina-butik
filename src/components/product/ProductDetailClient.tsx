"use client";

import { ShoppingBag, Zap } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import ImageGallery from "@/components/product/ImageGallery";
import InfoAccordion from "@/components/product/InfoAccordion";

export default function ProductDetailClient({ product }: { product: Product }) {
  const hasDiscount = !!product.compareAtPrice;

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:py-12">
      <ImageGallery
        images={product.gallery}
        productName={product.name}
        soldOut={!product.inStock}
      />

      <div className="flex flex-col gap-6 lg:max-w-md">
        <div>
          <p className="text-xs uppercase tracking-widest text-charcoal-soft">
            {product.isNew ? "Yeni" : "Takım"}
          </p>
          <h1 className="mt-1 font-display text-2xl text-charcoal sm:text-3xl">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <span className={`text-xl font-semibold ${hasDiscount ? "text-plum" : "text-charcoal"}`}>
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-charcoal-soft line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>
        </div>

        <p className="text-sm leading-relaxed text-charcoal-soft">{product.description}</p>

        {!product.inStock ? (
          <div className="rounded-md border border-nude bg-ivory px-4 py-3.5 text-center text-sm font-medium text-charcoal-soft">
            Bu ürün şu anda tükenmiştir.
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={product.shopierUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gold-dark"
            >
              <ShoppingBag size={18} />
              Sepete Ekle
            </a>
            <a
              href={product.shopierUrl}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-charcoal px-6 py-3.5 text-sm font-semibold text-charcoal transition hover:bg-charcoal hover:text-white"
            >
              <Zap size={16} />
              Hemen Al
            </a>
          </div>
        )}
        <p className="text-center text-xs text-charcoal-soft">
          Satın alma işlemi Shopier güvenli ödeme sayfasında tamamlanır.
        </p>

        <InfoAccordion
          sections={[
            { title: "Ürün Açıklaması", content: product.fabricCare },
            {
              title: "Değişim ve İade Politikası",
              content:
                "Ürünlerinizde beden veya renk değişimi yapabilirsiniz; ancak iade kabul edilmemektedir. Değişim talepleri için ürünü teslim aldıktan sonra 14 gün içinde, kullanılmamış ve etiketleri çıkarılmamış olarak iletmeniz yeterlidir.",
              highlight: true,
            },
            { title: "Teslimat Bilgisi", content: product.deliveryInfo },
          ]}
        />
      </div>
    </div>
  );
}
