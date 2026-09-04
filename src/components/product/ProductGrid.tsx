import { Product } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
        <p className="font-display text-xl text-charcoal">Ürün bulunamadı</p>
        <p className="text-sm text-charcoal-soft">
          Seçtiğiniz filtrelere uygun ürün bulunmuyor. Filtreleri temizlemeyi deneyin.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
