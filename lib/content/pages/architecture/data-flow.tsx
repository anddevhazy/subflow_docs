import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import { Mermaid } from "@/components/docs/content/mermaid";
import type { PageMeta } from "@/lib/content/types";
import { FolderOpen, NotebookText } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Architecture",
  title: "Data flow",
  lede: "How a single event, a payment failing, a subscription renewing, reaches webhooks, notifications, and analytics without three separate write paths.",
};

export default function DataFlow() {
  return (
    <>
      <p>
        This is the engineering-level companion to <a href="/concepts/event-store">The event store</a>, same idea,
        closer to the code.
      </p>

      <h2 id="h-path">One write, three reads</h2>
      <Mermaid
        chart={`flowchart TD
    A["Domain action\n(e.g. charge fails)"]:::accent --> B["Event written to event store"]:::accent2
    B --> C["webhooks module\n(delivers to subscribers)"]
    B --> D["dunning module\n(triggers recovery orchestration)"]
    B --> E["analytics module\n(read-model aggregation)"]

    classDef accent fill:#c9971f,stroke:#8a6416,color:#ffffff,font-weight:600;
    classDef accent2 fill:#1e9a5a,stroke:#166e42,color:#ffffff,font-weight:600;
`}
      />

      <h2 id="h-why-one">Why this isn&apos;t three separate write paths</h2>
      <p>
        The tempting shortcut is to have the subscriptions module call the notifications module directly on a
        failure, and separately increment an analytics counter, and separately queue a webhook. Three call sites,
        three chances for one of them to be missed on a future code change. Writing one event and letting three
        independent consumers read it means adding a fourth consumer later, a data warehouse export, say,
        doesn&apos;t require touching the subscriptions module at all.
      </p>

      <h2 id="h-processor">The event processor</h2>
      <p>
        The <code className="inline">events</code> module&apos;s processor is what turns a written event into
        action for its consumers, it&apos;s the dispatcher, not the event store itself. It runs asynchronously via
        BullMQ (see <a href="/architecture/queues-and-async">Queues & async processing</a>), so writing an event
        and reacting to it are decoupled: a slow webhook delivery never blocks the request that triggered the
        underlying domain action.
      </p>

      <h2 id="h-consistency">What this buys, concretely</h2>
      <ul>
        <li>
          A merchant&apos;s analytics dashboard and their webhook stream can never disagree about whether an event
          happened, they&apos;re reading the same rows.
        </li>
        <li>Adding a new webhook event type is a subscription change, not a new write path.</li>
        <li>
          Replaying a webhook (<a href="/developer/webhooks">Webhooks</a>) is just re-running the dispatch step
          against an already-durable event, nothing about the underlying fact is reconstructed or guessed at.
        </li>
      </ul>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={2}>
        <CardLink
          href="/concepts/event-store"
          icon={NotebookText}
          title="The event store"
          description="The conceptual version of this page."
        />
        <CardLink
          href="/architecture/queues-and-async"
          icon={FolderOpen}
          title="Queues & async processing"
          description="How the dispatch step actually runs."
        />
      </CardGrid>
    </>
  );
}
