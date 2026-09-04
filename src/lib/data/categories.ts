import { readCategories, readProducts } from "@/lib/store";

export type NavCategory = { slug: string; name: string };

export async function getNavCategories(): Promise<NavCategory[]> {
  const categories = await readCategories();
  return [{ slug: "yeni-gelenler", name: "Yeni Gelenler" }, ...categories];
}

export async function getCategoryName(slug: string): Promise<string> {
  if (slug === "yeni-gelenler") return "Yeni Gelenler";
  const categories = await readCategories();
  return categories.find((c) => c.slug === slug)?.name ?? "Ürünler";
}

export async function getShowcaseCategories(): Promise<
  { slug: string; name: string; image: string }[]
> {
  const [categories, products] = await Promise.all([readCategories(), readProducts()]);
  const tiles: { slug: string; name: string; image: string }[] = [];

  const newProduct = products.find((p) => p.isNew);
  if (newProduct) {
    tiles.push({ slug: "yeni-gelenler", name: "Yeni Gelenler", image: newProduct.images[0] });
  }

  for (const cat of categories) {
    const representative = products.find((p) => p.category === cat.slug);
    if (representative) {
      tiles.push({ slug: cat.slug, name: cat.name, image: representative.images[0] });
    }
  }

  return tiles;
}
