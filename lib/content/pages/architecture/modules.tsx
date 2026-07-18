import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import type { PageMeta } from "@/lib/content/types";
import { Plug, RefreshCw } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Architecture",
  title: "Modules",
  lede: "Nineteen domain modules and five shared-infrastructure ones. What each is responsible for, and who it talks to.",
};

export default function ArchitectureModules() {
  return (
    <>
      <p>
        This is a NestJS monolith organised into modules by domain, not a fleet of microservices. Module boundaries
        give the same separation of ownership a service boundary would, without the deployment and network
        overhead, every module runs in the same process, talking to its neighbours through TypeScript imports
        rather than HTTP.
      </p>

      <h2 id="h-table">What each module owns</h2>
      <table>
        <tbody>
          <tr>
            <th>Module</th>
            <th>Owns</th>
          </tr>
          <tr>
            <td>
              <code className="inline">auth</code>
            </td>
            <td>Signup, login, JWT access/refresh issuance and rotation.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">merchants</code>
            </td>
            <td>The merchant entity itself, the tenant root everything else scopes to.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">api-keys</code>
            </td>
            <td>Live/test key issuance, rotation, revocation.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">plans</code>
            </td>
            <td>Pricing plan CRUD and deactivation.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">customers</code>
            </td>
            <td>Customer records, scoped per merchant.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">subscriptions</code>
            </td>
            <td>The lifecycle state machine, create, pause, resume, cancel, reactivate, change plan.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">billing</code>
            </td>
            <td>
              Charge orchestration (invoice → Monnify charge → status transition) and proration math. Not exposed
              through its own controller, called internally by subscriptions and dunning.
            </td>
          </tr>
          <tr>
            <td>
              <code className="inline">invoices</code>
            </td>
            <td>Invoice queries and line-item detail.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">payments</code>
            </td>
            <td>
              Checkout, the Monnify integration client, and Monnify&apos;s inbound webhook receiver, see{" "}
              <a href="/architecture/monnify-integration">Monnify integration</a>.
            </td>
          </tr>
          <tr>
            <td>
              <code className="inline">dunning</code>
            </td>
            <td>The three-attempt retry schedule and grace-period transitions on a failed charge.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">notifications</code>
            </td>
            <td>Email, SMS, and WhatsApp delivery, queued per domain event.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">recovery-channels</code>
            </td>
            <td>
              Single-use recovery links (retry/pause/cancel), plus the WhatsApp-inbound and USSD-session endpoints,
              see <a href="/concepts/recovery-orchestration">Recovery orchestration</a>.
            </td>
          </tr>
          <tr>
            <td>
              <code className="inline">mail</code>
            </td>
            <td>SMTP delivery and email-template resolution, the transport underneath the Email channel.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">webhooks</code>
            </td>
            <td>Outbound event delivery, retry, dead-letter handling, and replay.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">events</code>
            </td>
            <td>
              The event store and its processor, the substrate every other module&apos;s history reads from, plus a
              nested Mission Control sub-module for live event streaming, see{" "}
              <a href="/architecture/mission-control">Mission control</a>.
            </td>
          </tr>
          <tr>
            <td>
              <code className="inline">analytics</code>
            </td>
            <td>
              Merchant-facing metrics, computed as a read-model over <code className="inline">events</code>.
            </td>
          </tr>
          <tr>
            <td>
              <code className="inline">audit</code>
            </td>
            <td>Workspace action history, who did what, queryable per merchant.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">service-info</code>
            </td>
            <td>
              Diagnostics for the inbound Monnify webhook leg, see <a href="/developer/service-info">Service info</a>.
            </td>
          </tr>
          <tr>
            <td>
              <code className="inline">queues</code>
            </td>
            <td>
              Registers the four BullMQ queues (dunning, webhooks, notifications, events) shared across the
              modules above, see <a href="/architecture/queues-and-async">Queues &amp; async processing</a>.
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="h-shared">Shared infrastructure</h2>
      <table>
        <tbody>
          <tr>
            <th>Module</th>
            <th>Owns</th>
          </tr>
          <tr>
            <td>
              <code className="inline">common</code>
            </td>
            <td>
              Global guards (<code className="inline">JwtAuthGuard</code>, <code className="inline">ApiKeyGuard</code>),
              filters, and interceptors applied across every route.
            </td>
          </tr>
          <tr>
            <td>
              <code className="inline">config</code>
            </td>
            <td>Environment configuration, typed and centralized.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">database</code>
            </td>
            <td>TypeORM configuration and migrations.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">health</code>
            </td>
            <td>Health-check endpoint for infrastructure monitoring.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">redis</code>
            </td>
            <td>The Redis client provider BullMQ (and rate limiting) runs on.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">shared</code>
            </td>
            <td>Enums and cross-cutting utilities used by more than one domain module. Not a NestJS module itself.</td>
          </tr>
        </tbody>
      </table>

      <p className="body-secondary">
        A <code className="inline">chaos</code> module also exists, fault injection for QA and staging, disabled
        outright in production. It&apos;s internal tooling, not part of the public surface this documentation
        covers.
      </p>

      <h2 id="h-discipline">Why the boundary matters even in one process</h2>
      <p>
        A module doesn&apos;t reach into another module&apos;s repository directly, it goes through that
        module&apos;s service layer, the same discipline a network boundary would force. This is what keeps the
        option open to peel a module out into its own service later, without a rewrite, if a specific one
        (payments, most likely) ever needs to scale or deploy independently of the rest.
      </p>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={2}>
        <CardLink
          href="/architecture/monnify-integration"
          icon={Plug}
          title="Monnify integration"
          description="A closer look at what the payments module actually wraps."
        />
        <CardLink
          href="/architecture/data-flow"
          icon={RefreshCw}
          title="Data flow"
          description="How events and webhooks connect across module boundaries."
        />
      </CardGrid>
    </>
  );
}
