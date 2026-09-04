import { NextRequest, NextResponse } from "next/server";
import { readCategories, createCategory } from "@/lib/store";

export async function GET() {
  return NextResponse.json(await readCategories());
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "Kategori adı gerekli." }, { status: 400 });
  }
  const category = await createCategory(name);
  return NextResponse.json(category, { status: 201 });
}
