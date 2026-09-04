"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ExternalLink } from "lucide-react";
import { Product } from "@/lib/types";
import type { StoredCategory } from "@/lib/store";
import ProductForm from "@/components/admin/ProductForm";
import ProductTable from "@/components/admin/ProductTable";
import CategoryManager from "@/components/admin/CategoryManager";

export default function AdminDashboard({
  initialProducts,
  initialCategories,
}: {
  initialProducts: Product[];
  initialCategories: StoredCategory[];
}) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="font-display text-2xl text-charcoal">
            Destina <span className="text-gold">Butik</span>
          </p>
          <p className="text-sm text-charcoal-soft">Yönetim Paneli</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-nude px-4 py-2 text-sm text-charcoal-soft hover:border-gold hover:text-gold"
          >
            <ExternalLink size={15} />
            Siteyi Gör
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full border border-nude px-4 py-2 text-sm text-charcoal-soft hover:border-plum hover:text-plum"
          >
            <LogOut size={15} />
            Çıkış Yap
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-8">
          <ProductForm
            categories={categories}
            onCategoryCreated={(cat) => setCategories((prev) => [...prev, cat])}
            onProductCreated={(product) => setProducts((prev) => [product, ...prev])}
          />
          <ProductTable
            products={products}
            categories={categories}
            onProductUpdated={(updated) =>
              setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
            }
            onProductDeleted={(id) => setProducts((prev) => prev.filter((p) => p.id !== id))}
          />
        </div>

        <CategoryManager
          categories={categories}
          products={products}
          onCategoryCreated={(cat) => setCategories((prev) => [...prev, cat])}
          onCategoryDeleted={(slug) =>
            setCategories((prev) => prev.filter((c) => c.slug !== slug))
          }
        />
      </div>
    </div>
  );
}
