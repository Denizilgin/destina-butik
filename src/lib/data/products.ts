import { Product } from "@/lib/types";
import { readProducts } from "@/lib/store";

export async function getAllProducts(): Promise<Product[]> {
  return readProducts();
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await readProducts();
  return products.find((p) => p.slug === slug);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const products = await readProducts();
  if (categorySlug === "yeni-gelenler") return products.filter((p) => p.isNew);
  return products.filter((p) => p.category === categorySlug);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return readProducts();
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
  const products = await readProducts();
  return products.filter((p) => p.id !== product.id).slice(0, 4);
}
