"use client";

import { useState } from "react";
import { Truck, RefreshCcw, ShieldCheck } from "lucide-react";

const messages = [
  { icon: Truck, text: "Tüm Ürünlerde Ücretsiz Kargo" },
  { icon: RefreshCcw, text: "14 Gün İçinde Kolay Değişim" },
  { icon: ShieldCheck, text: "Güvenli Alışveriş Garantisi" },
];

export default function AnnouncementBar() {
  const [index] = useState(0);

  return (
    <div className="bg-charcoal text-cream text-xs sm:text-sm tracking-wide">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2">
        {messages.map(({ icon: Icon, text }, i) => (
          <span
            key={text}
            className={`items-center gap-1.5 ${
              i === index ? "flex" : "hidden sm:flex"
            } ${i > 0 ? "sm:before:content-['·'] sm:before:mx-3 sm:before:text-mink" : ""}`}
          >
            <Icon size={14} strokeWidth={1.75} aria-hidden />
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
