import { NextRequest, NextResponse } from "next/server";
import { readProducts, createProduct } from "@/lib/store";

export async function GET() {
  const products = await readProducts();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const { name, price, image, category, isNew, inStock, shopierUrl } = body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof price !== "number" ||
    !(price > 0) ||
    typeof image !== "string" ||
    !image.trim() ||
    typeof category !== "string" ||
    !category.trim() ||
    typeof shopierUrl !== "string" ||
    !shopierUrl.trim()
  ) {
    return NextResponse.json({ error: "Eksik veya geçersiz alanlar var." }, { status: 400 });
  }

  const product = await createProduct({
    name,
    price,
    image,
    category,
    isNew: !!isNew,
    inStock: inStock !== false,
    shopierUrl,
  });

  return NextResponse.json(product, { status: 201 });
}
