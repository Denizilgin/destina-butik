"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { Loader2, Wand2 } from "lucide-react";
import { Product } from "@/lib/types";
import type { StoredCategory } from "@/lib/store";

const NEW_CATEGORY_VALUE = "__new__";

export default function ProductForm({
  categories,
  onCategoryCreated,
  onProductCreated,
}: {
  categories: StoredCategory[];
  onCategoryCreated: (category: StoredCategory) => void;
  onProductCreated: (product: Product) => void;
}) {
  const [shopierUrl, setShopierUrl] = useState("");
  const [scraping, setScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [image, setImage] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [inStock, setInStock] = useState(true);
  const [categorySlug, setCategorySlug] = useState<string>(
    categories[0]?.slug ?? NEW_CATEGORY_VALUE
  );
  const [newCategoryName, setNewCategoryName] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const hasScrapedData = !!name;

  async function handleScrape() {
    if (!shopierUrl.trim()) return;
    setScraping(true);
    setScrapeError(null);
    setSavedMessage(null);
    try {
      const res = await fetch("/api/admin/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: shopierUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ürün bilgisi alınamadı.");
      setName(data.name);
      setPrice(data.price);
      setImage(data.image);
      setIsNew(data.isNew);
      setInStock(data.inStock);
    } catch (err) {
      setScrapeError(err instanceof Error ? err.message : "Ürün bilgisi alınamadı.");
    } finally {
      setScraping(false);
    }
  }

  function resetForm() {
    setShopierUrl("");
    setName("");
    setPrice("");
    setImage("");
    setIsNew(false);
    setInStock(true);
    setScrapeError(null);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaveError(null);
    setSavedMessage(null);

    if (!name.trim() || !price || !image.trim() || !shopierUrl.trim()) {
      setSaveError("Lütfen önce Shopier linkinden ürün bilgilerini çekin.");
      return;
    }

    let finalCategorySlug = categorySlug;
    setSaving(true);

    if (categorySlug === NEW_CATEGORY_VALUE) {
      if (!newCategoryName.trim()) {
        setSaving(false);
        setSaveError("Lütfen yeni kategori için bir isim girin.");
        return;
      }
      const catRes = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      const catData = await catRes.json();
      if (!catRes.ok) {
        setSaving(false);
        setSaveError(catData.error ?? "Kategori oluşturulamadı.");
        return;
      }
      onCategoryCreated(catData);
      finalCategorySlug = catData.slug;
    }

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        price,
        image,
        category: finalCategorySlug,
        isNew,
        inStock,
        shopierUrl,
      }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setSaveError(data.error ?? "Ürün kaydedilemedi.");
      return;
    }

    onProductCreated(data);
    setSavedMessage(`"${data.name}" siteye eklendi.`);
    resetForm();
    setCategorySlug(finalCategorySlug);
    setNewCategoryName("");
  }

  return (
    <div className="rounded-xl border border-nude bg-white p-6">
      <h2 className="font-display text-lg text-charcoal">Yeni Ürün Ekle</h2>
      <p className="mt-1 text-sm text-charcoal-soft">
        Shopier ürün linkini yapıştırın, bilgileri otomatik çekelim.
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="url"
          value={shopierUrl}
          onChange={(e) => setShopierUrl(e.target.value)}
          placeholder="https://www.shopier.com/magazaniz/urun-id"
          className="flex-1 rounded-md border border-nude px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
        <button
          type="button"
          onClick={handleScrape}
          disabled={scraping || !shopierUrl.trim()}
          className="flex items-center justify-center gap-2 rounded-md bg-charcoal px-4 py-2.5 text-sm font-medium text-white transition hover:bg-charcoal-soft disabled:opacity-50"
        >
          {scraping ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
          Bilgileri Çek
        </button>
      </div>
      {scrapeError && <p className="mt-2 text-sm text-plum">{scrapeError}</p>}

      {hasScrapedData && (
        <form
          onSubmit={handleSave}
          className="mt-6 flex flex-col gap-4 border-t border-nude pt-6"
        >
          <div className="flex gap-4">
            {image && (
              <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-ivory">
                <Image src={image} alt={name} fill sizes="80px" className="object-cover" />
              </div>
            )}
            <div className="flex flex-1 flex-col gap-3">
              <label className="flex flex-col gap-1 text-xs font-medium text-charcoal-soft">
                Ürün Adı
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-md border border-nude px-3 py-2 text-sm text-charcoal outline-none focus:border-gold"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium text-charcoal-soft">
                Fiyat (TL)
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
                  className="rounded-md border border-nude px-3 py-2 text-sm text-charcoal outline-none focus:border-gold"
                />
              </label>
            </div>
          </div>

          <label className="flex flex-col gap-1 text-xs font-medium text-charcoal-soft">
            Görsel URL
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="rounded-md border border-nude px-3 py-2 text-sm text-charcoal outline-none focus:border-gold"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs font-medium text-charcoal-soft">
            Kategori
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="rounded-md border border-nude px-3 py-2 text-sm text-charcoal outline-none focus:border-gold"
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
              <option value={NEW_CATEGORY_VALUE}>+ Yeni kategori</option>
            </select>
          </label>

          {categorySlug === NEW_CATEGORY_VALUE && (
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Yeni kategori adı"
              className="rounded-md border border-nude px-3 py-2 text-sm text-charcoal outline-none focus:border-gold"
            />
          )}

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-charcoal-soft">
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="h-4 w-4 accent-gold"
              />
              Yeni ürün
            </label>
            <label className="flex items-center gap-2 text-sm text-charcoal-soft">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="h-4 w-4 accent-gold"
              />
              Stokta var
            </label>
          </div>

          {saveError && <p className="text-sm text-plum">{saveError}</p>}
          {savedMessage && <p className="text-sm text-forest">{savedMessage}</p>}

          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold-dark disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : "Ürünü Siteye Ekle"}
          </button>
        </form>
      )}
    </div>
  );
}
