import Hero from "@/components/home/Hero";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";
import { getFeaturedProducts } from "@/lib/data/products";

export default async function Home() {
  const featured = await getFeaturedProducts();

  return (
    <>
      <Hero />
      <CategoryShowcase />
      <FeaturedCarousel products={featured} />
    </>
  );
}
