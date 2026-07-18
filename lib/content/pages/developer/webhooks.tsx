import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import { CodeBlock } from "@/components/docs/code-block";
import { Mermaid } from "@/components/docs/content/mermaid";
import type { PageMeta } from "@/lib/content/types";
import { Check, Timer } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Developer",
  title: "Webhooks",
  lede: "Subscribe once. Every domain event, delivered with retry, dead-letter handling, and replay by subscription ID or time range.",
};

export default function DeveloperWebhooks() {
  return (
    <>
      <p>
        Efe maintains the backend for a bookkeeping tool that resells access via the Subscription Engine, his product
        needs to know the moment a customer&apos;s subscription lapses, so it can gate a feature, and the moment it
        recovers, so it can un-gate it. Polling for that would mean a cron job hitting the API on a guess-and-check
        schedule. Webhooks mean his system reacts within moments of the event actually happening, and never has to
        guess.
      </p>

      <h2 id="h-events">Event types</h2>
      <table>
        <tbody>
          <tr>
            <th>Event</th>
            <th>Fires when</th>
          </tr>
          <tr>
            <td>
              <code className="inline">subscription.created</code>
            </td>
            <td>A new subscription is created.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">subscription.updated</code>
            </td>
            <td>A plan change, pause, or resume.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">subscription.cancelled</code>
            </td>
            <td>A subscription is cancelled.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">subscription.renewed</code>
            </td>
            <td>A billing cycle completes successfully.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">invoice.paid</code>
            </td>
            <td>An invoice is settled in full.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">payment.failed</code>
            </td>
            <td>A billing-cycle charge attempt fails.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">payment.recovered</code>
            </td>
            <td>A previously failed charge succeeds on retry.</td>
          </tr>
        </tbody>
      </table>

      <h2 id="h-subscribe">Subscribing</h2>

      <CodeBlock
        code={`curl -X POST https://monnify-subscription-engine.onrender.com/webhooks \\
  -H "Authorization: Bearer nsub_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://efe-ledgerly.example.com/webhooks/monnify-subs",
    "events": ["payment.failed", "payment.recovered", "subscription.cancelled"]
  }'`}
        language="bash"
      />

      <p>
        Response includes a <code className="inline">secret</code>, shown exactly once. Save it, it&apos;s what
        you&apos;ll use to verify every delivery. See{" "}
        <a href="/security/webhook-verification">Webhook signature verification</a>.
      </p>

      <h2 id="h-payload">Payload shape</h2>

      <CodeBlock
        code={`{
  "id": "evt_01HMFB...",
  "type": "payment.failed",
  "data": {
    "subscriptionId": "sub_01HMFC...",
    "customerId": "cus_01HMFD...",
    "invoiceId": "inv_01HMFE...",
    "amount": 1500000,
    "currency": "NGN",
    "failureReason": "card_declined"
  },
  "createdAt": "2026-08-14T11:02:33Z",
  "correlationId": "cor_01HMFB..."
}`}
        language="json"
      />
      <p className="body-secondary">
        There&apos;s no <code className="inline">merchantId</code> or <code className="inline">apiVersion</code>{" "}
        field in the body, the delivery itself is already scoped to your webhook, and there&apos;s one API
        version today.
      </p>

      <h2 id="h-retry">Delivery and retries</h2>
      <p>
        Order is not guaranteed across events for the same subscription, use <code className="inline">createdAt</code>{" "}
        if ordering matters to your handler. On a non-2xx response, delivery retries on a fixed schedule, five
        attempts total:
      </p>
      <Mermaid
        chart={`sequenceDiagram
    participant ES as Event store
    participant Q as BullMQ queue
    participant W as Webhook worker
    participant M as Your endpoint

    ES->>Q: Enqueue delivery job
    Q->>W: Process job
    W->>W: Sign payload (HMAC-SHA256)
    W->>M: POST with x-signature, x-timestamp, x-event-type
    alt 2xx response
        M-->>W: 200 OK
        W->>ES: Mark delivered
    else Non-2xx or timeout
        M-->>W: Error
        W->>Q: Schedule retry
        Note over Q: 1m, 5m, 15m, 1h, 4h
        Q->>W: Retry attempt
        alt 5 attempts exhausted
            W->>ES: Mark dead_letter
        end
    end`}
      />
      <table>
        <tbody>
          <tr>
            <th>Attempt</th>
            <th>Delay since last</th>
          </tr>
          <tr>
            <td>1</td>
            <td>1 minute</td>
          </tr>
          <tr>
            <td>2</td>
            <td>5 minutes</td>
          </tr>
          <tr>
            <td>3</td>
            <td>15 minutes</td>
          </tr>
          <tr>
            <td>4</td>
            <td>1 hour</td>
          </tr>
          <tr>
            <td>5</td>
            <td>4 hours</td>
          </tr>
        </tbody>
      </table>
      <p>
        After the fifth attempt fails, the delivery moves to a dead-letter state, visible in your dashboard, and
        replayable manually once your endpoint is healthy again.
      </p>

      <h2 id="h-replay">Replay</h2>
      <p>
        Request re-delivery of events by subscription ID or by time range, useful after your own outage, or when
        debugging a handler that silently dropped events during a bad deploy.
      </p>

      <CodeBlock
        code={`curl -X POST https://monnify-subscription-engine.onrender.com/webhooks/replay \\
  -H "Authorization: Bearer nsub_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "subscriptionId": "sub_01HMFC...",
    "from": "2026-08-01T00:00:00Z",
    "to": "2026-08-14T00:00:00Z"
  }'`}
        language="bash"
      />

      <p>
        Replayed deliveries carry the same event <code className="inline">id</code> as the original, your
        idempotency check (below) means reprocessing them is safe by construction, not by convention.
      </p>

      <h2 id="h-idempotency">Idempotency</h2>
      <p>
        Treat every webhook as at-least-once. Store the event <code className="inline">id</code> after successful
        processing; if you see it again, return 200 without reprocessing. A simple{" "}
        <code className="inline">events_processed(event_id PRIMARY KEY, received_at)</code> table covers almost
        every case.
      </p>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={2}>
        <CardLink
          href="/security/webhook-verification"
          icon={Check}
          title="Signature verification"
          description="How to confirm a delivery actually came from us."
        />
        <CardLink
          href="/developer/rate-limits"
          icon={Timer}
          title="Rate limits"
          description="Throughput on the API side, for when you're not just receiving."
        />
      </CardGrid>
    </>
  );
}
