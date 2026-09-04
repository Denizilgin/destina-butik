"use client";

import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";

type AccordionSection = {
  title: string;
  content: string;
  highlight?: boolean;
};

export default function InfoAccordion({ sections }: { sections: AccordionSection[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(1);

  return (
    <div className="divide-y divide-nude border-y border-nude">
      {sections.map((section, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={section.title}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between py-4 text-left"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-charcoal">
                {section.title}
                {section.highlight && (
                  <Info size={14} className="text-plum" aria-hidden />
                )}
              </span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-charcoal-soft transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ${
                isOpen ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]"
              }`}
              style={{ display: "grid" }}
            >
              <div className="overflow-hidden">
                <p
                  className={`text-sm leading-relaxed text-charcoal-soft ${
                    section.highlight ? "font-medium text-plum" : ""
                  }`}
                >
                  {section.content}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
