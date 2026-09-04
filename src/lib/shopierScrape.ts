export type ScrapedShopierProduct = {
  name: string;
  price: number;
  image: string;
  isNew: boolean;
  inStock: boolean;
};

/**
 * Shopier product pages embed a `let { product: $product, ... } = {"page":"product",...}`
 * state blob server-side. We locate it by the `"page":"product"` marker and extract the
 * balanced JSON object around it (regex alone can't handle nested braces reliably).
 */
function extractBalancedJson(html: string, marker: string): string | null {
  const markerIndex = html.indexOf(marker);
  if (markerIndex === -1) return null;
  const start = html.lastIndexOf("{", markerIndex);
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < html.length; i++) {
    const ch = html[i];
    if (inString) {
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return html.slice(start, i + 1);
    }
  }
  return null;
}

function safeParse(json: string): Record<string, unknown> | null {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function scrapeShopierProduct(rawUrl: string): Promise<ScrapedShopierProduct> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("Geçersiz bir link girdiniz.");
  }

  if (!/(^|\.)shopier\.com$/i.test(url.hostname)) {
    throw new Error("Lütfen bir shopier.com ürün linki girin.");
  }

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; DestinaButikBot/1.0; +https://www.shopier.com)",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Shopier sayfasına ulaşılamadı. Linki kontrol edin.");
  }

  const html = await res.text();

  const stateJson = extractBalancedJson(html, '"page":"product"');
  const state = stateJson ? safeParse(stateJson) : null;
  const product = state?.product as Record<string, unknown> | undefined;

  const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
  const image = imageMatch?.[1];

  if (!product?.name || !image) {
    throw new Error(
      "Bu linkten ürün bilgisi okunamadı. Linkin doğru bir Shopier ürün sayfası olduğundan emin olun."
    );
  }

  const price = product.price as Record<string, unknown> | undefined;
  const priceSource = String(price?.price_without_cent ?? "0");
  const parsedPrice = Math.round(
    parseFloat(priceSource.replace(/\./g, "").replace(",", "."))
  );

  const labels = product.labels as Record<string, { enabled?: boolean }> | undefined;

  return {
    name: String(product.name).trim(),
    price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
    image,
    isNew: !!labels?.new?.enabled,
    inStock: !labels?.out_of_stock?.enabled,
  };
}
