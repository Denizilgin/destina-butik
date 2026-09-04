import Link from "next/link";
import { ExternalLink, PackageSearch } from "lucide-react";
import { getNavCategories } from "@/lib/data/categories";
import { SHOPIER_STORE_URL } from "@/lib/shopier";
import { INSTAGRAM_URL } from "@/lib/social";

const SHOPIER_ORDER_TRACKING_URL =
  "https://www.shopier.com/b/login?redirect=redirect_to_order";

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 3h-2a5 5 0 0 0-5 5v3H6v4h2v6h4v-6h3l1-4h-4V8a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default async function Footer() {
  const categories = await getNavCategories();

  return (
    <footer className="border-t border-nude bg-ivory">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-2xl text-charcoal">
            Destina <span className="text-gold">Butik</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-charcoal-soft">
            Modern ve şık kapalı giyimde mütevazı zarafeti sizin için buluşturuyoruz.
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-full border border-mink p-2 text-charcoal-soft transition hover:border-gold hover:text-gold"
            >
              <InstagramIcon />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="rounded-full border border-mink p-2 text-charcoal-soft transition hover:border-gold hover:text-gold"
            >
              <FacebookIcon />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-display text-base text-charcoal">Kategoriler</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-charcoal-soft">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/kategori/${cat.slug}`} className="hover:text-gold">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-base text-charcoal">Kurumsal</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-charcoal-soft">
            <li><Link href="#" className="hover:text-gold">Hakkımızda</Link></li>
            <li><Link href="#" className="hover:text-gold">Değişim &amp; İade</Link></li>
            <li><Link href="#" className="hover:text-gold">Teslimat Bilgileri</Link></li>
            <li><Link href="#" className="hover:text-gold">Gizlilik Politikası</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-base text-charcoal">Sipariş &amp; Ödeme</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-charcoal-soft">
            <li>
              <a
                href={SHOPIER_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gold"
              >
                <ExternalLink size={14} /> Shopier Mağazamız
              </a>
            </li>
            <li>
              <a
                href={SHOPIER_ORDER_TRACKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gold"
              >
                <PackageSearch size={14} /> Sipariş Takibi
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-nude px-4 py-4 text-center text-xs text-charcoal-soft sm:px-6">
        © {new Date().getFullYear()} Destina Butik. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
