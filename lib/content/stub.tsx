import { ArrowLeft, ArrowRight } from "lucide-react";
import { groupFor, titleFor, DESCRIPTIONS } from "@/lib/nav";
import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import type { PageMeta } from "./types";

export function stubMeta(slug: string): PageMeta {
  const group = groupFor(slug);
  return {
    eyebrow: group ? group.group : "Docs",
    title: titleFor(slug),
    lede: DESCRIPTIONS[slug] || "Documentation for this page.",
  };
}

export function StubBody() {
  return (
    <>
      <div className="mb-5 inline-block rounded-md border border-[#f0dfae] bg-gold-light px-2.5 py-1 text-xs font-semibold text-gold-dark">
        Template page, content pending
      </div>
      <p className="text-text-secondary">
        This page follows the same structure as the built-out pages (Introduction, How it works, Webhooks, Webhook
        signature verification). Draft it from{" "}
        <code className="inline">docs-reference/BRD_Monnify_Subscriptions_Engine.md</code>,{" "}
        <code className="inline">docs-reference/PRD_Monnify_Subscriptions_Engine.md</code>, and{" "}
        <code className="inline">docs-reference/BACKEND_README.md</code> to complete this section.
      </p>
      <div className="mt-7">
        <CardGrid cols={2}>
          <CardLink href="/introduction" icon={ArrowLeft} title="Introduction" description="Back to the start." />
          <CardLink
            href="/how-it-works"
            icon={ArrowRight}
            title="How it works"
            description="See the full arc end to end."
          />
        </CardGrid>
      </div>
    </>
  );
}
