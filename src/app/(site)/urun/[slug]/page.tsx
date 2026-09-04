import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import ProductGrid from "@/components/product/ProductGrid";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const related = await getRelatedProducts(product);

  return (
    <div className="pb-16">
      <ProductDetailClient product={product} />

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
          <h2 className="mb-6 font-display text-xl text-charcoal sm:text-2xl">
            Bunlar da İlginizi Çekebilir
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
