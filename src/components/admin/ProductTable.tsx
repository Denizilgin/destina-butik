"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Product } from "@/lib/types";
import type { StoredCategory } from "@/lib/store";
import { formatPrice } from "@/lib/format";

export default function ProductTable({
  products,
  categories,
  onProductUpdated,
  onProductDeleted,
}: {
  products: Product[];
  categories: StoredCategory[];
  onProductUpdated: (product: Product) => void;
  onProductDeleted: (id: string) => void;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);

  async function patchProduct(id: string, patch: Partial<Product>) {
    setBusyId(id);
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setBusyId(null);
    if (res.ok) {
      onProductUpdated(await res.json());
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`"${name}" ürününü silmek istediğinize emin misiniz?`)) return;
    setBusyId(id);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setBusyId(null);
    if (res.ok) onProductDeleted(id);
  }

  return (
    <div className="rounded-xl border border-nude bg-white p-6">
      <h2 className="font-display text-lg text-charcoal">Ürünler ({products.length})</h2>

      <div className="mt-4 flex flex-col divide-y divide-nude">
        {products.length === 0 && (
          <p className="py-6 text-sm text-charcoal-soft">Henüz ürün eklenmedi.</p>
        )}
        {products.map((product) => (
          <div
            key={product.id}
            className={`flex flex-wrap items-center gap-3 py-4 ${
              busyId === product.id ? "opacity-50" : ""
            }`}
          >
            <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-ivory">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>

            <div className="min-w-[10rem] flex-1">
              <p className="text-sm font-medium text-charcoal">{product.name}</p>
              <p className="text-xs text-charcoal-soft">{formatPrice(product.price)}</p>
            </div>

            <select
              value={product.category}
              disabled={busyId === product.id}
              onChange={(e) => patchProduct(product.id, { category: e.target.value })}
              className="rounded-md border border-nude px-2 py-1.5 text-xs text-charcoal outline-none focus:border-gold"
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-1.5 text-xs text-charcoal-soft">
              <input
                type="checkbox"
                checked={!!product.isNew}
                disabled={busyId === product.id}
                onChange={(e) => patchProduct(product.id, { isNew: e.target.checked })}
                className="h-3.5 w-3.5 accent-gold"
              />
              Yeni
            </label>

            <label className="flex items-center gap-1.5 text-xs text-charcoal-soft">
              <input
                type="checkbox"
                checked={product.inStock}
                disabled={busyId === product.id}
                onChange={(e) => patchProduct(product.id, { inStock: e.target.checked })}
                className="h-3.5 w-3.5 accent-gold"
              />
              Stokta
            </label>

            <button
              onClick={() => handleDelete(product.id, product.name)}
              disabled={busyId === product.id}
              aria-label="Ürünü sil"
              className="rounded-full p-2 text-charcoal-soft transition hover:bg-ivory hover:text-plum"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
