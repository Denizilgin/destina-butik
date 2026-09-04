import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[85vh] min-h-[520px] w-full overflow-hidden sm:h-[90vh]">
      <Image
        src="/images/hero.jpg"
        alt="Destina Butik mağazasında üç kadın kapalı giyim kombinleriyle sohbet ediyor"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/10 to-transparent" />

      <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-16 text-center sm:pb-24">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-cream/90 sm:text-sm">
          2026 Sonbahar / Kış Koleksiyonu
        </p>
        <h1 className="max-w-2xl font-display text-3xl leading-tight text-white sm:text-5xl">
          Sezonun En Şık Kapalı Giyim Koleksiyonu
        </h1>
        <Link
          href="/kategori/yeni-gelenler"
          className="mt-7 rounded-full bg-gold px-8 py-3.5 text-sm font-medium tracking-wide text-white transition hover:bg-gold-dark"
        >
          Şimdi Keşfet
        </Link>
      </div>
    </section>
  );
}
