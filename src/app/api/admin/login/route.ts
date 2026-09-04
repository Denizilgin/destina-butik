import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, getExpectedSessionToken, verifyPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const password = body?.password;

  if (typeof password !== "string" || !(await verifyPassword(password))) {
    return NextResponse.json({ error: "Şifre hatalı." }, { status: 401 });
  }

  const token = await getExpectedSessionToken();
  if (!token) {
    return NextResponse.json(
      { error: "Sunucuda ADMIN_PASSWORD tanımlı değil." },
      { status: 500 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
