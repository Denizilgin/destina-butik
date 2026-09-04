"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import type { StoredCategory } from "@/lib/store";
import { Product } from "@/lib/types";

export default function CategoryManager({
  categories,
  products,
  onCategoryCreated,
  onCategoryDeleted,
}: {
  categories: StoredCategory[];
  products: Product[];
  onCategoryCreated: (category: StoredCategory) => void;
  onCategoryDeleted: (slug: string) => void;
}) {
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!newName.trim()) return;
    setCreating(true);
    setError(null);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) {
      setError(data.error ?? "Kategori oluşturulamadı.");
      return;
    }
    onCategoryCreated(data);
    setNewName("");
  }

  async function handleDelete(slug: string) {
    setError(null);
    const res = await fetch(`/api/admin/categories/${slug}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Kategori silinemedi.");
      return;
    }
    onCategoryDeleted(slug);
  }

  return (
    <div className="h-fit rounded-xl border border-nude bg-white p-6">
      <h2 className="font-display text-lg text-charcoal">Kategoriler</h2>

      <ul className="mt-4 flex flex-col divide-y divide-nude">
        {categories.map((cat) => {
          const count = products.filter((p) => p.category === cat.slug).length;
          return (
            <li key={cat.slug} className="flex items-center justify-between py-2.5 text-sm">
              <span className="text-charcoal">
                {cat.name} <span className="text-xs text-charcoal-soft">({count})</span>
              </span>
              <button
                onClick={() => handleDelete(cat.slug)}
                aria-label={`${cat.name} kategorisini sil`}
                className="rounded-full p-1.5 text-charcoal-soft transition hover:bg-ivory hover:text-plum"
              >
                <Trash2 size={14} />
              </button>
            </li>
          );
        })}
        {categories.length === 0 && (
          <p className="py-4 text-sm text-charcoal-soft">Henüz kategori yok.</p>
        )}
      </ul>

      {error && <p className="mt-3 text-sm text-plum">{error}</p>}

      <div className="mt-4 flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          placeholder="Yeni kategori adı"
          className="flex-1 rounded-md border border-nude px-3 py-2 text-sm outline-none focus:border-gold"
        />
        <button
          onClick={handleCreate}
          disabled={creating || !newName.trim()}
          aria-label="Kategori ekle"
          className="flex items-center justify-center rounded-md bg-charcoal px-3 text-white transition hover:bg-charcoal-soft disabled:opacity-50"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
