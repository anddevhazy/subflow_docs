import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allSlugs } from "@/lib/nav";
import { getPageModule } from "@/lib/content/registry";
import { stubMeta, StubBody } from "@/lib/content/stub";
import { Toc } from "@/components/docs/Toc";

type Params = { slug: string[] };

export function generateStaticParams() {
  return allSlugs().map((slug) => ({ slug: slug.split("/") }));
}

function slugFromParams(slug: string[]): string | null {
  const joined = slug.join("/");
  return allSlugs().includes(joined) ? joined : null;
}

function resolvePage(slug: string) {
  const registered = getPageModule(slug);
  if (registered) return registered;
  return { meta: stubMeta(slug), Content: StubBody };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resolved = slugFromParams(slug);
  if (!resolved) return {};
  const { meta } = resolvePage(resolved);
  return {
    title: `${meta.title} | Subflow`,
    description: meta.lede,
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const resolved = slugFromParams(slug);
  if (!resolved) notFound();

  const { meta, Content } = resolvePage(resolved);

  return (
    <>
      <div className="flex min-w-0 flex-1 justify-center">
        <main className="w-full max-w-[740px] px-8 pt-10 pb-[100px]">
          <div className="mb-2 text-[13.5px] font-semibold text-gold-dark">{meta.eyebrow}</div>
          <div className="mb-2.5 flex items-start justify-between gap-5 max-[820px]:flex-col">
            <h1 className="text-[33px] leading-tight font-bold tracking-tight max-[820px]:text-[26px]">
              {meta.title}
            </h1>
          </div>
          <p className="mb-8 text-lg leading-[1.55] text-text-secondary">{meta.lede}</p>
          <div className="docs-prose">
            <Content />
          </div>
          <div className="mt-[60px] flex justify-between border-t border-border pt-6 text-sm text-text-muted">
            <span>Subflow</span>
            <span>Edit this page on GitHub</span>
          </div>
        </main>
      </div>
      <Toc />
    </>
  );
}
