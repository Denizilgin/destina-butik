"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Şifre hatalı.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <p className="mb-1 text-center font-display text-2xl text-charcoal">
        Destina <span className="text-gold">Butik</span>
      </p>
      <h1 className="mb-8 text-center text-sm uppercase tracking-widest text-charcoal-soft">
        Yönetim Paneli
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Şifre"
          autoFocus
          className="rounded-md border border-nude px-4 py-3 text-sm outline-none focus:border-gold"
        />
        {error && <p className="text-sm text-plum">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="rounded-full bg-charcoal py-3 text-sm font-semibold text-white transition hover:bg-charcoal-soft disabled:opacity-50"
        >
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
}
