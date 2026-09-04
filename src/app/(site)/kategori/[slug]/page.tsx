import { notFound } from "next/navigation";
import { getProductsByCategory } from "@/lib/data/products";
import { getCategoryName } from "@/lib/data/categories";
import CategoryPageClient from "@/components/product/CategoryPageClient";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getProductsByCategory(slug);

  if (products.length === 0) notFound();

  const name = await getCategoryName(slug);

  return <CategoryPageClient categoryName={name} products={products} />;
}
