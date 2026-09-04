import { NextRequest, NextResponse } from "next/server";
import { scrapeShopierProduct } from "@/lib/shopierScrape";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const url = body?.url;

  if (typeof url !== "string" || !url.trim()) {
    return NextResponse.json({ error: "Lütfen bir Shopier ürün linki girin." }, { status: 400 });
  }

  try {
    const data = await scrapeShopierProduct(url.trim());
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ürün bilgisi alınamadı.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
