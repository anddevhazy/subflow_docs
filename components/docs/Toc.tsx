"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

type Heading = { id: string; text: string };

export function Toc() {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("main h2[id], main h3[id]"),
    );
    setHeadings(elements.map((el) => ({ id: el.id, text: el.textContent ?? "" })));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-120px 0px -70% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  if (!headings.length) return <aside className="w-[220px] shrink-0 max-[1100px]:hidden" />;

  return (
    <aside className="sticky top-[146px] h-fit w-[220px] shrink-0 py-0 pr-5 pb-10 text-[13px] max-[1100px]:hidden">
      <div className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold text-text-muted">
        <Menu className="size-3.5" strokeWidth={2} /> On this page
      </div>
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={cn(
            "block border-l-2 border-border py-1 pl-2.5 text-text-secondary hover:border-gold hover:text-gold-dark",
            activeId === h.id && "border-gold text-gold-dark",
          )}
        >
          {h.text}
        </a>
      ))}
    </aside>
  );
}
