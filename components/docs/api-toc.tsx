"use client";

import { useEffect, useState, useRef } from "react";
import { apiTagGroups, type HttpMethod } from "@/lib/api-docs";
import { cn } from "@/lib/utils";

const methodColors: Record<HttpMethod, { bg: string; text: string }> = {
  GET: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  POST: {
    bg: "bg-blue-500/10 dark:bg-blue-500/15",
    text: "text-blue-600 dark:text-blue-400",
  },
  PATCH: {
    bg: "bg-amber-500/10 dark:bg-amber-500/15",
    text: "text-amber-600 dark:text-amber-400",
  },
  DELETE: {
    bg: "bg-red-500/10 dark:bg-red-500/15",
    text: "text-red-600 dark:text-red-400",
  },
};

export function ApiToc() {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Collect all element IDs we want to track
    const targets: string[] = [];
    apiTagGroups.forEach((group) => {
      targets.push(group.slug);
      group.endpoints.forEach((endpoint) => {
        const id = `${group.slug}-${endpoint.method.toLowerCase()}-${endpoint.path.replace(/[/:]/g, "-")}`;
        targets.push(id);
      });
    });

    const elements = targets
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    // Disconnect any existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Keep track of which elements are currently intersecting
    const intersectingMap = new Map<string, boolean>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          intersectingMap.set(entry.target.id, entry.isIntersecting);
        });

        // Find the first intersecting element in DOM order
        const currentActive = elements.find((el) => intersectingMap.get(el.id));
        if (currentActive) {
          setActiveId(currentActive.id);
        } else {
          // If none are currently intersecting, check if we've scrolled past some elements
          // Find the last element that is above the viewport
          const scrollPosition = window.scrollY + 120; // offset for the sticky header
          const pastElements = elements.filter(
            (el) => el.offsetTop <= scrollPosition
          );
          if (pastElements.length > 0) {
            setActiveId(pastElements[pastElements.length - 1].id);
          }
        }
      },
      {
        rootMargin: "-100px 0px -60% 0px", // triggers when elements are in the upper half of screen
        threshold: 0,
      }
    );

    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90; // offset to align with sticky header
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
      // Update hash in URL cleanly
      window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-sm tracking-tight text-foreground px-2">
          API Reference
        </h3>
        <p className="text-xs text-muted-foreground px-2">
          Table of Contents
        </p>
      </div>

      <nav className="space-y-4 max-h-[calc(100vh-14rem)] overflow-y-auto pr-2 scrollbar-thin">
        {apiTagGroups.map((group) => {
          const isGroupActive = activeId === group.slug;
          // Check if any of this group's children are active
          const isChildActive = group.endpoints.some((endpoint) => {
            const id = `${group.slug}-${endpoint.method.toLowerCase()}-${endpoint.path.replace(/[/:]/g, "-")}`;
            return activeId === id;
          });

          return (
            <div key={group.slug} className="space-y-1">
              <a
                href={`#${group.slug}`}
                onClick={(e) => handleClick(e, group.slug)}
                className={cn(
                  "block px-2 py-1 text-xs font-semibold rounded-md transition-colors hover:bg-muted/50",
                  isGroupActive || isChildActive
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground"
                )}
              >
                {group.tag}
              </a>

              <div className="border-l pl-2 ml-2 space-y-0.5">
                {group.endpoints.map((endpoint, i) => {
                  const id = `${group.slug}-${endpoint.method.toLowerCase()}-${endpoint.path.replace(/[/:]/g, "-")}`;
                  const isActive = activeId === id;
                  const colors = methodColors[endpoint.method];

                  return (
                    <a
                      key={`${endpoint.method}-${endpoint.path}-${i}`}
                      href={`#${id}`}
                      onClick={(e) => handleClick(e, id)}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1 text-[11px] font-mono rounded transition-colors hover:bg-muted/50",
                        isActive
                          ? "text-foreground font-semibold bg-muted"
                          : "text-muted-foreground"
                      )}
                    >
                      <span
                        className={cn(
                          "text-[9px] px-1 py-0.5 rounded font-bold uppercase select-none shrink-0 border border-transparent",
                          colors.bg,
                          colors.text,
                          endpoint.method === "GET" && "dark:border-emerald-500/10",
                          endpoint.method === "POST" && "dark:border-blue-500/10",
                          endpoint.method === "PATCH" && "dark:border-amber-500/10",
                          endpoint.method === "DELETE" && "dark:border-red-500/10"
                        )}
                      >
                        {endpoint.method}
                      </span>
                      <span className="truncate" title={endpoint.path}>
                        {endpoint.path}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
