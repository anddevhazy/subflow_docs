import { CardGrid, Card, CardLink } from "@/components/docs/content/card-grid";
import type { PageMeta } from "@/lib/content/types";
import { BarChart3, Bell, Megaphone, RefreshCw } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Core concepts",
  title: "The event store",
  lede: "Every domain event, persisted once, read by webhooks, notifications, and analytics. One source of truth, not three.",
};

export default function EventStore() {
  return (
    <>
      <p>
        Here&apos;s a mistake that&apos;s easy to make and expensive to unwind: build webhooks against one data
        path, analytics against another, and notifications against a third. The three drift. A number in a
        merchant&apos;s dashboard stops matching what a webhook reported an hour ago, and nobody can say with
        confidence which one is right.
      </p>
      <p>
        The event store exists specifically to prevent that. Every domain event, a subscription created, a payment
        failed, an invoice paid, is written once, as an immutable, timestamped record. Webhooks, notifications, and
        analytics all read from this same store. They can disagree about how they present a fact. They cannot
        disagree about what the fact was.
      </p>

      <h2 id="h-events">What gets written</h2>
      <table>
        <tbody>
          <tr>
            <th>Event</th>
            <th>Fired when</th>
          </tr>
          <tr>
            <td>
              <code className="inline">SubscriptionCreated</code>
            </td>
            <td>A new subscription is created.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">SubscriptionUpdated</code>
            </td>
            <td>A plan change, pause, or resume happens.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">SubscriptionCancelled</code>
            </td>
            <td>A subscription is cancelled, by either side.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">SubscriptionRenewed</code>
            </td>
            <td>A billing cycle completes and the subscription rolls into the next period.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">PaymentFailed</code>
            </td>
            <td>A charge attempt fails.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">PaymentRecovered</code>
            </td>
            <td>A previously failed charge succeeds on retry.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">InvoicePaid</code>
            </td>
            <td>An invoice is settled in full.</td>
          </tr>
        </tbody>
      </table>

      <h2 id="h-consumers">Three consumers, one store</h2>
      <CardGrid cols={3}>
        <Card icon={Bell} title="Webhooks">
          Every subscribed event is delivered to your endpoint the moment it&apos;s written, see{" "}
          <a href="/developer/webhooks">Webhooks</a>.
        </Card>
        <Card icon={Megaphone} title="Notifications">
          Email, WhatsApp, SMS, and USSD recovery messages are triggered by the same events, read by the
          recovery-orchestration component.
        </Card>
        <Card icon={BarChart3} title="Analytics">
          MRR, churn, and recovery rate are computed on demand directly from event aggregates, not a separately
          maintained rollup table that can drift out of sync.
        </Card>
      </CardGrid>

      <h2 id="h-immutable">Why it&apos;s immutable</h2>
      <p>
        Once an event is written, it isn&apos;t edited or deleted. If a later action needs to correct something, it
        writes a new event that supersedes the old one in effect, the history of what actually happened stays intact
        either way. This is what makes webhook replay trustworthy: replaying an event from a week ago returns exactly
        what was true a week ago, not whatever the record has since been edited to say.
      </p>

      <h2 id="h-replay">What immutability buys you</h2>
      <ul>
        <li>
          <strong>Reliable webhook replay.</strong> Re-deliver any event by subscription ID or time range, and get
          back exactly what was originally sent, see <a href="/developer/webhooks">Webhooks</a>.
        </li>
        <li>
          <strong>Analytics you can trust.</strong> A number in the dashboard is always a live aggregate over real
          events, not a cached snapshot that might be stale.
        </li>
        <li>
          <strong>An answerable audit trail.</strong> &quot;What happened to this subscription, and when&quot; has
          one authoritative answer.
        </li>
      </ul>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={2}>
        <CardLink
          href="/developer/webhooks"
          icon={Bell}
          title="Webhooks"
          description="Subscribing to events, delivery, retry, and replay."
        />
        <CardLink
          href="/architecture/data-flow"
          icon={RefreshCw}
          title="Data flow"
          description="The engineering-level view of how an event reaches each consumer."
        />
      </CardGrid>
    </>
  );
}
