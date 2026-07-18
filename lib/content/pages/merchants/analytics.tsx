import { Card, CardGrid, CardLink } from "@/components/docs/content/card-grid";
import type { PageMeta } from "@/lib/content/types";
import { Compass, NotebookText, Repeat, TrendingDown, User, Wallet } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "For merchants",
  title: "Analytics",
  lede: "MRR, churn, recovery rate, and plan performance, computed on demand, always current.",
};

export default function MerchantsAnalytics() {
  return (
    <>
      <p>
        Adaeze used to find out how Lumen was doing by exporting payments to a spreadsheet at month-end. By the time
        she had a number, it was already three weeks stale. Analytics on this platform is a live read over the same
        event store that powers webhooks, the number on screen right now reflects the payment that settled a minute
        ago, not last month&apos;s export.
      </p>

      <h2 id="h-core">Core metrics</h2>
      <CardGrid cols={2}>
        <Card icon={Wallet} title="MRR / ARR">
          Monthly and annualised recurring revenue, computed from active subscriptions at their current plan price.
        </Card>
        <Card icon={TrendingDown} title="Churn rate">
          Share of subscribers who cancelled or lapsed into <code className="inline">expired</code> in the period.
        </Card>
        <Card icon={Repeat} title="Recovery rate">
          Share of failed payments recovered within the grace period, with attribution available for the channels
          that have a live trigger path today, automatic retry, WhatsApp, and USSD, see{" "}
          <a href="/concepts/recovery-orchestration">Recovery orchestration</a>.
        </Card>
        <Card icon={User} title="ARPU">
          Average revenue per active subscriber.
        </Card>
      </CardGrid>

      <h2 id="h-endpoints">Where to read it</h2>
      <table>
        <tbody>
          <tr>
            <th>Endpoint</th>
            <th>Returns</th>
          </tr>
          <tr>
            <td>
              <code className="inline">GET /analytics/metrics</code>
            </td>
            <td>The core snapshot, MRR, ARR, churn, recovery, ARPU, subscription counts.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">GET /analytics/overview</code>
            </td>
            <td>The full dashboard payload, metrics plus payments, customers, dunning, webhooks, and plan breakdown.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">GET /analytics/revenue-trend</code>
            </td>
            <td>Revenue over time, at day, week, or month granularity.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">GET /analytics/subscriptions/trend</code>
            </td>
            <td>New versus cancelled subscriptions over time, same granularity options.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">GET /analytics/plans</code>
            </td>
            <td>MRR and subscriber count per plan, which tier is actually carrying the business.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">GET /analytics/payments</code>
            </td>
            <td>Payment success rate, average amount, and attempt volume.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">GET /analytics/customers</code>
            </td>
            <td>Total customers, share with an active subscription, new customers in the period.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">GET /analytics/dunning</code>
            </td>
            <td>Past-due volume, grace-period volume, recovery rate.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">GET /analytics/webhooks</code>
            </td>
            <td>Delivery counts by status, delivered, failed, pending.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">GET /analytics/activity</code>
            </td>
            <td>A paginated feed of recent events, sourced straight from the event store.</td>
          </tr>
        </tbody>
      </table>

      <h2 id="h-why-onread">Why this is computed on demand, not batched</h2>
      <p>
        The alternative, a nightly job that rolls up numbers into a separate reporting table, is exactly the kind of
        second data path that quietly drifts from reality. Because these metrics are read-models over the same{" "}
        <a href="/concepts/event-store">event store</a> that drives webhooks, there&apos;s no batch delay and no
        separate table to reconcile against reality when something looks off.
      </p>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={2}>
        <CardLink
          href="/concepts/event-store"
          icon={NotebookText}
          title="The event store"
          description="Where every number on this page actually comes from."
        />
        <CardLink
          href="/concepts/recovery-orchestration"
          icon={Compass}
          title="Recovery orchestration"
          description="What feeds the dunning metrics specifically."
        />
      </CardGrid>
    </>
  );
}
