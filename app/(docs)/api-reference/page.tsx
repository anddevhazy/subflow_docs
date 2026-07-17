import type { Metadata } from "next";
import Link from "next/link";
import { ApiEndpoint } from "@/components/docs/api-endpoint";
import { ApiToc } from "@/components/docs/api-toc";
import { apiTagGroups } from "@/lib/api-docs";
import { API_BASE_URL, SWAGGER_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "API Reference",
  description: "Complete API documentation for Subflow.",
};

export default function ApiReferencePage() {
  return (
    <div className="flex min-w-0 flex-1 justify-center">
      <div className="flex w-full max-w-[1000px] items-start gap-10 px-8 pt-10 pb-[100px]">
        <div className="min-w-0 flex-1 space-y-10">
          <div>
            <div className="mb-2 text-[13.5px] font-semibold text-gold-dark">
              REST API v1.0
            </div>
            <h1 className="text-[33px] leading-tight font-bold tracking-tight max-[820px]:text-[26px]">
              API Reference
            </h1>
            <p className="mt-4 text-lg leading-[1.55] text-text-secondary">
              All endpoints return a standard JSON envelope. Authenticate with{" "}
              <code className="inline">Authorization: Bearer &lt;token&gt;</code>.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <span className="text-text-muted">
                Base URL:{" "}
                <code className="inline">{API_BASE_URL}</code>
              </span>
              <Link
                href={SWAGGER_URL}
                target="_blank"
                className="text-gold-dark hover:underline"
              >
                Open Swagger UI
              </Link>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2 xl:hidden">
            {apiTagGroups.map((group) => (
              <a
                key={group.slug}
                href={`#${group.slug}`}
                className="rounded-full border border-border px-3 py-1 text-xs font-medium text-text-secondary transition-colors hover:border-gold/30 hover:bg-gold/5 hover:text-foreground"
              >
                {group.tag}
              </a>
            ))}
          </nav>

          <div className="border-t border-border" />

          {apiTagGroups.map((group) => (
            <section
              key={group.slug}
              id={group.slug}
              className="scroll-mt-24 space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{group.tag}</h2>
                <p className="mt-2 text-text-secondary">{group.description}</p>
              </div>
              <div className="space-y-6">
                {group.endpoints.map((endpoint, i) => (
                  <ApiEndpoint
                    key={`${endpoint.method}-${endpoint.path}-${i}`}
                    endpoint={endpoint}
                    id={`${group.slug}-${endpoint.method.toLowerCase()}-${endpoint.path.replace(/[/:]/g, "-")}`}
                  />
                ))}
              </div>
              <div className="border-t border-border" />
            </section>
          ))}

          <div className="rounded-xl border border-border bg-muted/30 p-6">
            <h3 className="font-semibold">Response envelope</h3>
            <p className="mt-2 text-sm text-text-secondary">
              All successful responses follow this structure:
            </p>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-zinc-950 p-4 font-mono text-xs text-zinc-100">
              {`{
  "status": "success",
  "data": { ... },
  "message": "Operation successful"
}`}
            </pre>
          </div>
        </div>

        <aside className="sticky top-[130px] hidden w-60 shrink-0 max-h-[calc(100vh-160px)] overflow-y-auto pr-1 xl:block">
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <ApiToc />
          </div>
        </aside>
      </div>
    </div>
  );
}
