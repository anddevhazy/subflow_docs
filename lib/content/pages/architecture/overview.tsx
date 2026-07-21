import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import { CodeBlock } from "@/components/docs/code-block";
import { Mermaid } from "@/components/docs/content/mermaid";
import type { PageMeta } from "@/lib/content/types";
import { Blocks, Plug, Puzzle, RefreshCw } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Architecture",
  title: "Architecture",
  lede: "One NestJS API. Postgres for the ledger. Redis and BullMQ for everything that shouldn't block a response.",
};

export default function ArchitectureOverview() {
  return (
    <>
      <p>This is the altitude page, read it once, then drill into any chapter on the left.</p>

      <h2 id="h-stack">The stack</h2>
      <table>
        <tbody>
          <tr>
            <th>Layer</th>
            <th>Technology</th>
          </tr>
          <tr>
            <td>Framework</td>
            <td>NestJS 11, TypeScript</td>
          </tr>
          <tr>
            <td>Database</td>
            <td>PostgreSQL + TypeORM</td>
          </tr>
          <tr>
            <td>Queue / async jobs</td>
            <td>BullMQ + Redis</td>
          </tr>
          <tr>
            <td>Auth</td>
            <td>JWT, access + refresh tokens</td>
          </tr>
          <tr>
            <td>Payments</td>
            <td>Monnify API</td>
          </tr>
          <tr>
            <td>API docs</td>
            <td>
              Swagger, served at <code className="inline">/docs</code>
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="h-shape">The shape of the system</h2>
      <p>
        One NestJS process, organised into modules by domain, not a microservice mesh. A request comes in through a
        controller, runs through service-layer domain logic, and reads or writes through a repository. Anything
        that shouldn&apos;t block the response, a webhook delivery, a dunning retry, invoice generation, goes onto a
        BullMQ queue backed by Redis instead of running inline.
      </p>

      <Mermaid
        chart={`flowchart LR
    subgraph "API layer"
        C[Controllers]
        S[Services]
    end
    subgraph Domain
        E[Event store]:::accent2
        SM[Subscription state machine]
    end
    subgraph Workers
        BQ[BullMQ]:::accent
        DW[Dunning worker]
        WW[Webhook worker]
    end
    subgraph External
        N[Monnify API]
        MW[Merchant webhooks]
    end

    C --> S
    S --> SM
    S --> E
    E --> BQ
    BQ --> DW
    BQ --> WW
    WW --> MW
    N --> S
    DW --> S

    classDef accent fill:#322f29,stroke:#1f1d19,color:#ffffff,font-weight:600;
    classDef accent2 fill:#1e9a5a,stroke:#166e42,color:#ffffff,font-weight:600;
`}
      />
      <p className="body-secondary">
        Postgres backs the API and Domain layers via TypeORM; Redis backs the BullMQ layer. Both omitted above to
        keep the module relationships legible.
      </p>

      <h2 id="h-domain">The domain model</h2>

      <CodeBlock
        code={`merchants
  ├── users (one per merchant today, no role tiers yet)
  ├── api_keys
  ├── plans
  ├── customers
  │     ├── subscriptions
  │           ├── invoices → invoice_items
  │           └── payments → payment_attempts
  ├── webhooks → webhook_deliveries
  ├── audit_logs
  └── event_store`}
        language="text"
      />

      <p>
        Every business entity below <code className="inline">Merchant</code> carries a{" "}
        <code className="inline">merchantId</code> for tenant isolation, enforced at the data-access layer, not only
        in application code. See <a href="/architecture/modules">Modules</a> for what owns each part of this.
      </p>
      <p className="body-secondary">
        The schema has room for more than one user per merchant, but nothing in the API creates a second one yet,
        there&apos;s no invite flow and no role differentiation today.
      </p>

      <h2 id="h-decisions">A few deliberate choices</h2>
      <table>
        <tbody>
          <tr>
            <th>Decision</th>
            <th>Why</th>
          </tr>
          <tr>
            <td>One NestJS monolith, not microservices</td>
            <td>
              Operational simplicity at this scale. Module boundaries give the same separation of concerns without
              the deployment overhead.
            </td>
          </tr>
          <tr>
            <td>Analytics as a read-model over the event store</td>
            <td>One data path means analytics and webhooks can never quietly drift apart from each other.</td>
          </tr>
          <tr>
            <td>Notification fan-out driven by the same event, not per-caller logic</td>
            <td>
              A failed charge writes one event; email, WhatsApp, and SMS dispatch reads from that, not from
              separate call sites scattered across the codebase, see{" "}
              <a href="/concepts/recovery-orchestration">Recovery orchestration</a>.
            </td>
          </tr>
          <tr>
            <td>BullMQ over inline processing for anything slow or external</td>
            <td>A webhook delivery or a WhatsApp send shouldn&apos;t hold open the request that triggered it.</td>
          </tr>
        </tbody>
      </table>

      <h2 id="h-next">What to read next</h2>
      <CardGrid cols={2}>
        <CardLink
          href="/architecture/modules"
          icon={Puzzle}
          title="Modules"
          description="What each of the nineteen domain modules owns."
        />
        <CardLink
          href="/architecture/monnify-integration"
          icon={Plug}
          title="Monnify integration"
          description="The three payment surfaces this is built on."
        />
        <CardLink
          href="/architecture/data-flow"
          icon={RefreshCw}
          title="Data flow"
          description="How one event reaches three consumers."
        />
        <CardLink
          href="/architecture/resilience"
          icon={Blocks}
          title="Resilience & scale"
          description="Async by default, retried with backoff."
        />
      </CardGrid>
    </>
  );
}
