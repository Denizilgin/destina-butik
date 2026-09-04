import { NextRequest, NextResponse } from "next/server";
import { updateProduct, deleteProduct } from "@/lib/store";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const patch = await req.json().catch(() => null);
  if (!patch) {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const updated = await updateProduct(id, patch);
  if (!updated) {
    return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ok = await deleteProduct(id);
  if (!ok) {
    return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
