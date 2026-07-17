"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "@/components/docs/copy-button";
import { highlightCode } from "@/lib/shiki";
import { cn } from "@/lib/utils";

type CodeBlockProps = {
  code: string;
  language?: string;
  title?: string;
  className?: string;
};

const languageLabels: Record<string, string> = {
  bash: "Shell",
  javascript: "Node.js",
  typescript: "TypeScript",
  json: "JSON",
};

export function CodeBlock({ code, language = "json", title, className }: CodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    highlightCode(code, language).then((result) => {
      if (!cancelled) setHtml(result);
    });

    return () => {
      cancelled = true;
    };
  }, [code, language]);

  const label = title ?? languageLabels[language] ?? language;

  return (
    <div
      className={cn(
        "mb-5 overflow-hidden rounded-xl border border-[#24252b] bg-[#15161a]",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-[#24252b] bg-[#1b1c21] px-4 py-2">
        <span className="font-mono text-xs text-[#9a9a94]">{label}</span>
        <CopyButton value={code} />
      </div>

      <div className="shiki-code-block overflow-x-auto px-[18px] py-4">
        {html ? (
          <div className="min-w-0" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <pre className="m-0 text-[13.5px] leading-[1.6] text-[#e6e6df]">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
