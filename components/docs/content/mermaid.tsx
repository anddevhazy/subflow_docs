"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTheme } from "next-themes";

type MermaidProps = {
  chart: string;
  className?: string;
};

const lightThemeVariables = {
  fontSize: "13.5px",
  primaryColor: "#ffffff",
  primaryBorderColor: "#e5e2d9",
  primaryTextColor: "#1a1a17",
  lineColor: "#c9c5b8",
  background: "#fafaf7",
};

const darkThemeVariables = {
  fontSize: "13.5px",
  primaryColor: "#201e16",
  primaryBorderColor: "#3a3626",
  primaryTextColor: "#f2f0e8",
  lineColor: "#5a5644",
  background: "#1c1a13",
};

export function Mermaid({ chart, className }: MermaidProps) {
  const id = useId().replace(/:/g, "-");
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;

    import("mermaid").then(async ({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        fontFamily: "var(--font-sans, ui-sans-serif)",
        flowchart: { curve: "basis", padding: 12 },
        themeVariables: resolvedTheme === "dark" ? darkThemeVariables : lightThemeVariables,
      });

      const { svg: rendered } = await mermaid.render(`mermaid-${id}-${resolvedTheme}`, chart);
      if (!cancelled) setSvg(rendered);
    });

    return () => {
      cancelled = true;
    };
  }, [chart, id, resolvedTheme]);

  return (
    <div
      ref={containerRef}
      className={`mermaid-diagram mb-6 overflow-x-auto rounded-xl border border-border bg-muted p-5 ${className ?? ""}`}
    >
      {svg ? (
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <div className="py-8 text-center text-[12.5px] text-text-muted">Loading diagram…</div>
      )}
    </div>
  );
}
