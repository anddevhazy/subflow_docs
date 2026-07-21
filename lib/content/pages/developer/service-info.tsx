import { Card, CardGrid, CardLink } from "@/components/docs/content/card-grid";
import { CodeBlock } from "@/components/docs/code-block";
import type { PageMeta } from "@/lib/content/types";
import { Bell, Plug, Radio, Server } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Developer",
  title: "Service info",
  lede: "A debug console for the one webhook direction that's easy to get wrong: Monnify calling into you, not you calling out.",
};

export default function ServiceInfo() {
  return (
    <>
      <p>
        Every outbound webhook on this platform, the ones covered in{" "}
        <a href="/developer/webhooks">Webhooks</a>, has a matching inbound leg
        you don&apos;t control: Monnify calling <em>this</em> API to confirm a
        charge or a checkout outcome. Service info exists to make that leg
        debuggable, since it&apos;s the one integration point where &quot;is
        this actually configured right&quot; isn&apos;t answerable from your own
        logs.
      </p>

      <h2 id="h-snapshot">Service snapshot</h2>
      <p>
        <code className="inline">GET /service-info</code>, authenticated,
        returns:
      </p>
      <CodeBlock
        code={`{
  "serviceName": "Subflow",
  "environment": "production",
  "serverTime": "2026-08-14T11:02:33Z",
  "nodeVersion": "v20.14.0",
  "monnifyWebhookUrl": "https://subscription-billing-engine-t7ss.onrender.com/webhooks/monnify",
  "webhookSecretConfigured": true,
  "monnifyApiUrl": "https://api.monnify.com"
}`}
        language="json"
      />
      <p>
        <code className="inline">monnifyWebhookUrl</code> is the exact URL to
        hand Monnify when configuring inbound delivery for your account.{" "}
        <code className="inline">webhookSecretConfigured</code> answers the
        single most common support question before it becomes one: whether this
        environment can actually verify Monnify&apos;s signature at all.
      </p>

      <h2 id="h-log">Incoming request log</h2>
      <p>
        <code className="inline">GET /service-info/requests</code>, paginated,
        returns the actual requests this service has received, method, path,
        headers, signature, timestamp, body, and the status code it responded
        with, capped at the most recent 500. Useful for the exact moment Monnify
        says they sent a webhook and your dashboard shows no corresponding
        event: this is where you check whether the request arrived at all, and
        if it did, why it might have failed signature verification.
      </p>

      <h2 id="h-echo">A connectivity check</h2>
      <p>
        <code className="inline">POST /service-info/echo</code> is
        unauthenticated by design, it exists purely to confirm a request from a
        given network path actually reaches this service, before you spend time
        debugging auth or signing.
      </p>

      <Card icon={Server} title="Not a general debugging tool">
        This is scoped narrowly to the Monnify inbound leg. It doesn&apos;t log
        or replay your own outbound webhook deliveries, that history lives on
        the dashboard&apos;s Webhooks page instead.
      </Card>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={3}>
        <CardLink
          href="/architecture/monnify-integration"
          icon={Plug}
          title="Monnify integration"
          description="What the inbound webhook actually confirms."
        />
        <CardLink
          href="/security/webhook-verification"
          icon={Bell}
          title="Webhook signature verification"
          description="The signing scheme this log helps you debug."
        />
        <CardLink
          href="/architecture/mission-control"
          icon={Radio}
          title="Mission control"
          description="The live feed for events already inside the system, not the inbound leg."
        />
      </CardGrid>
    </>
  );
}
