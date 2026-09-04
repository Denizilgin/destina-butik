import { randomUUID } from "crypto";
import { Row, InValue } from "@libsql/client";
import { getDbClient, ensureSchema } from "@/lib/db";
import { Product } from "@/lib/types";

export type StoredCategory = { slug: string; name: string };

const SIZE_NOTE = "Tüm bedenlerimiz mevcuttur, sipariş verirken beden belirtiniz.";
const DELIVERY_INFO = "Bu dükkandaki tüm ürünler ücretsiz kargo ile gönderilir.";

function rowToProduct(row: Row): Product {
  const compareAtPrice = row.compareAtPrice;
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    category: String(row.category),
    price: Number(row.price),
    compareAtPrice: compareAtPrice == null ? undefined : Number(compareAtPrice),
    images: JSON.parse(String(row.images)),
    gallery: JSON.parse(String(row.gallery)),
    sizes: JSON.parse(String(row.sizes)),
    colors: JSON.parse(String(row.colors)),
    isNew: !!row.isNew,
    inStock: !!row.inStock,
    fabricCare: String(row.fabricCare),
    deliveryInfo: String(row.deliveryInfo),
    description: String(row.description),
    shopierUrl: String(row.shopierUrl),
  };
}

function rowToCategory(row: Row): StoredCategory {
  return { slug: String(row.slug), name: String(row.name) };
}

export function slugify(input: string): string {
  const map: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", i: "i", ö: "o", ş: "s", ü: "u",
  };
  return input
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function readProducts(): Promise<Product[]> {
  await ensureSchema();
  const db = getDbClient();
  const res = await db.execute("SELECT * FROM products ORDER BY rowid ASC");
  return res.rows.map(rowToProduct);
}

export async function readCategories(): Promise<StoredCategory[]> {
  await ensureSchema();
  const db = getDbClient();
  const res = await db.execute("SELECT * FROM categories ORDER BY rowid ASC");
  return res.rows.map(rowToCategory);
}

async function slugExists(table: "products" | "categories", slug: string): Promise<boolean> {
  const db = getDbClient();
  const res = await db.execute({
    sql: `SELECT 1 FROM ${table} WHERE slug = ? LIMIT 1`,
    args: [slug],
  });
  return res.rows.length > 0;
}

async function uniqueSlug(table: "products" | "categories", base: string): Promise<string> {
  let slug = base;
  let n = 2;
  while (await slugExists(table, slug)) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

export async function createProduct(input: {
  name: string;
  price: number;
  image: string;
  category: string;
  isNew: boolean;
  inStock: boolean;
  shopierUrl: string;
}): Promise<Product> {
  await ensureSchema();
  const db = getDbClient();

  const slug = await uniqueSlug("products", slugify(input.name) || "urun");
  const product: Product = {
    id: randomUUID(),
    slug,
    name: input.name.trim(),
    category: input.category,
    price: input.price,
    images: [input.image, input.image],
    gallery: [input.image],
    sizes: [],
    colors: [],
    isNew: input.isNew,
    inStock: input.inStock,
    fabricCare: SIZE_NOTE,
    deliveryInfo: DELIVERY_INFO,
    description: SIZE_NOTE,
    shopierUrl: input.shopierUrl,
  };

  await db.execute({
    sql: `INSERT INTO products
      (id, slug, name, category, price, compareAtPrice, images, gallery, sizes, colors, isNew, inStock, fabricCare, deliveryInfo, description, shopierUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      product.id,
      product.slug,
      product.name,
      product.category,
      product.price,
      product.compareAtPrice ?? null,
      JSON.stringify(product.images),
      JSON.stringify(product.gallery),
      JSON.stringify(product.sizes),
      JSON.stringify(product.colors),
      product.isNew ? 1 : 0,
      product.inStock ? 1 : 0,
      product.fabricCare,
      product.deliveryInfo,
      product.description,
      product.shopierUrl,
    ],
  });

  return product;
}

const PRODUCT_COLUMNS = new Set([
  "slug", "name", "category", "price", "compareAtPrice", "images", "gallery",
  "sizes", "colors", "isNew", "inStock", "fabricCare", "deliveryInfo",
  "description", "shopierUrl",
]);

function serializeProductValue(key: string, value: unknown): InValue {
  if (key === "images" || key === "gallery" || key === "sizes" || key === "colors") {
    return JSON.stringify(value);
  }
  if (key === "isNew" || key === "inStock") {
    return value ? 1 : 0;
  }
  return (value as InValue) ?? null;
}

export async function updateProduct(
  id: string,
  patch: Partial<Product>
): Promise<Product | null> {
  await ensureSchema();
  const db = getDbClient();

  const entries = Object.entries(patch).filter(([key]) => PRODUCT_COLUMNS.has(key));
  if (entries.length > 0) {
    const setClause = entries.map(([key]) => `${key} = ?`).join(", ");
    const args = entries.map(([key, value]) => serializeProductValue(key, value));
    await db.execute({
      sql: `UPDATE products SET ${setClause} WHERE id = ?`,
      args: [...args, id],
    });
  }

  const res = await db.execute({
    sql: "SELECT * FROM products WHERE id = ? LIMIT 1",
    args: [id],
  });
  return res.rows[0] ? rowToProduct(res.rows[0]) : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  await ensureSchema();
  const db = getDbClient();
  const res = await db.execute({ sql: "DELETE FROM products WHERE id = ?", args: [id] });
  return res.rowsAffected > 0;
}

export async function createCategory(name: string): Promise<StoredCategory> {
  await ensureSchema();
  const db = getDbClient();
  const slug = await uniqueSlug("categories", slugify(name) || "kategori");
  const category: StoredCategory = { slug, name: name.trim() };
  await db.execute({
    sql: "INSERT INTO categories (slug, name) VALUES (?, ?)",
    args: [category.slug, category.name],
  });
  return category;
}

export async function deleteCategory(
  slug: string
): Promise<{ ok: boolean; reason?: string }> {
  await ensureSchema();
  const db = getDbClient();

  const inUse = await db.execute({
    sql: "SELECT 1 FROM products WHERE category = ? LIMIT 1",
    args: [slug],
  });
  if (inUse.rows.length > 0) {
    return {
      ok: false,
      reason: "Bu kategoride ürünler var. Önce ürünleri başka bir kategoriye taşıyın veya silin.",
    };
  }

  await db.execute({ sql: "DELETE FROM categories WHERE slug = ?", args: [slug] });
  return { ok: true };
}
