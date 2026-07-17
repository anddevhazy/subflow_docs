"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Circle } from "lucide-react";
import { NAV, ICONS } from "@/lib/nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function DocsSidebar({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const activeSlug = pathname.replace(/^\//, "");

  return (
    <ScrollArea className={cn("h-full", className)}>
      <nav className="px-3.5 pt-6 pb-[60px]">
        {NAV.map((group) => (
          <div className="mb-5" key={group.group}>
            <div className="mb-2 px-2.5 text-xs font-semibold text-text-muted">
              {group.group}
            </div>
            {group.items.map((item) => {
              const Icon = ICONS[item.slug] ?? Circle;
              const active = item.slug === activeSlug;
              return (
                <Link
                  key={item.slug}
                  href={`/${item.slug}`}
                  onClick={onNavigate}
                  className={cn(
                    "mb-px flex items-center gap-2.5 rounded-[7px] px-2.5 py-1.5 text-sm text-text-secondary hover:bg-muted hover:text-foreground",
                    active && "bg-gold-light font-semibold text-gold-dark hover:bg-gold-light hover:text-gold-dark",
                  )}
                >
                  <Icon className="size-3.5 shrink-0 opacity-85" />
                  {item.title}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </ScrollArea>
  );
}
