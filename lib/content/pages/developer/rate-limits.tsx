import { Callout } from "@/components/docs/content/callout";
import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import { CodeBlock } from "@/components/docs/code-block";
import type { PageMeta } from "@/lib/content/types";
import { Bell, KeyRound } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Developer",
  title: "Rate limits",
  lede: "One global limit, 100 requests per 60 seconds, shared by every caller. No per-key tiers yet.",
};

export default function RateLimits() {
  return (
    <>
      <Callout variant="note">
        <p>
          This is simpler than a lot of billing APIs you may have integrated with before: there&apos;s one limit,
          applied globally, not a matrix of per-endpoint or per-key allowances. If your integration needs more
          than that, talk to us before you build around an assumption this page doesn&apos;t actually make.
        </p>
      </Callout>

      <h2 id="h-limit">The limit</h2>
      <table>
        <tbody>
          <tr>
            <th>Scope</th>
            <th>Limit</th>
          </tr>
          <tr>
            <td>Every request, every endpoint</td>
            <td>100 requests per 60-second window</td>
          </tr>
        </tbody>
      </table>
      <p>
        There&apos;s no separate allowance for reads versus writes, no per-key tier, and no higher limit for
        inbound webhook delivery, everything shares the same window today.
      </p>

      <p>Exceeding it returns:</p>

      <CodeBlock
        code={`HTTP/1.1 429 Too Many Requests

{"statusCode":429,"message":"ThrottlerException: Too Many Requests"}`}
        language="json"
      />

      <h2 id="h-idempotency">No idempotency-key support yet</h2>
      <p>
        There&apos;s no <code className="inline">Idempotency-Key</code> header handling on write endpoints today.
        A retried request after a timeout or a 5xx is processed as a new request, not deduplicated for you. If
        that matters for your integration, generate your own client-side identifier and check for it (e.g. a
        matching customer + plan + timestamp) before retrying a create call.
      </p>

      <h2 id="h-more">If you need more</h2>
      <p>
        Most integrations run well under this limit. If a batch job, re-syncing a large customer base, for
        instance, needs more headroom, talk to us before running it rather than discovering the ceiling mid-sync.
      </p>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={2}>
        <CardLink
          href="/developer/authentication"
          icon={KeyRound}
          title="Authentication"
          description="How a key is scoped in the first place."
        />
        <CardLink
          href="/developer/webhooks"
          icon={Bell}
          title="Webhooks"
          description="Delivery retry, dead-letter, and replay."
        />
      </CardGrid>
    </>
  );
}
