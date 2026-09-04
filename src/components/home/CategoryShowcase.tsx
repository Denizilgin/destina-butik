import Image from "next/image";
import Link from "next/link";
import { getShowcaseCategories } from "@/lib/data/categories";

export default async function CategoryShowcase() {
  const showcaseCategories = await getShowcaseCategories();

  if (showcaseCategories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <h2 className="text-center font-display text-2xl text-charcoal sm:text-3xl">
        Kategorilere Göz At
      </h2>
      <p className="mx-auto mt-2 max-w-md text-center text-sm text-charcoal-soft">
        Aradığınız stili saniyeler içinde bulun.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
        {showcaseCategories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/kategori/${cat.slug}`}
            className="group flex flex-col items-center gap-3"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-ivory">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-charcoal/10 transition group-hover:bg-charcoal/20" />
            </div>
            <span className="text-sm font-medium text-charcoal transition group-hover:text-gold-dark">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
