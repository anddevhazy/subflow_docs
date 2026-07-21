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
  primaryBorderColor: "#e7e5e0",
  primaryTextColor: "#211f1c",
  lineColor: "#c7c4bc",
  background: "#f7f6f4",
};

const darkThemeVariables = {
  fontSize: "13.5px",
  primaryColor: "#2e2c27",
  primaryBorderColor: "#403d35",
  primaryTextColor: "#fbfaf8",
  lineColor: "#5c584c",
  background: "#211f1c",
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
