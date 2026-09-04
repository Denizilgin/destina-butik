"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageGallery({
  images,
  productName,
  soldOut,
}: {
  images: string[];
  productName: string;
  soldOut?: boolean;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3 sm:flex-row-reverse sm:gap-4">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-ivory">
        <Image
          src={images[active]}
          alt={productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-cover ${soldOut ? "grayscale-[35%] opacity-80" : ""}`}
        />
        {soldOut && (
          <span className="absolute bottom-3 left-3 rounded-md bg-charcoal-soft/90 px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wide text-white shadow-sm">
            Tükendi
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto sm:w-20 sm:flex-col sm:overflow-y-auto">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              aria-label={`${productName} görsel ${i + 1}`}
              className={`relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-md ring-2 transition sm:w-full ${
                active === i ? "ring-gold" : "ring-transparent"
              }`}
            >
              <Image
                src={img}
                alt=""
                fill
                loading="lazy"
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
