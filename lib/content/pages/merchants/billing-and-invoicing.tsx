import { Callout } from "@/components/docs/content/callout";
import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import { Mermaid } from "@/components/docs/content/mermaid";
import { Steps, Step } from "@/components/docs/content/steps";
import type { PageMeta } from "@/lib/content/types";
import { BarChart3, RefreshCw } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "For merchants",
  title: "Billing & invoicing",
  lede: "Invoices generate themselves. Charges fire themselves. Proration on a plan change is previewed today, not yet charged automatically.",
};

export default function BillingAndInvoicing() {
  return (
    <>
      <p>
        Here&apos;s the thing most new merchants are surprised by: after a subscription is created, you don&apos;t
        tap anything. The billing cycle runs on its own, an invoice generates itself with line-item detail, a charge
        fires against the stored card, and the outcome, paid or failed, writes to the event store automatically.
        Your job is to watch the dashboard, not operate it.
      </p>

      <h2 id="h-cycle">How a billing cycle runs</h2>
      <Mermaid
        chart={`sequenceDiagram
    participant App as Merchant app
    participant API as Subflow API
    participant Monnify as Monnify Checkout
    participant WH as Monnify webhook
    participant ES as Event store

    App->>API: POST /subscriptions
    API->>API: Create invoice + payment
    API-->>App: checkoutUrl
    App->>Monnify: Redirect customer
    Monnify->>WH: POST /webhooks/monnify (payment_success)
    WH->>WH: Verify Monnify signature
    WH->>API: Mark payment succeeded
    API->>API: Activate subscription
    API->>ES: Emit invoice.paid event
    ES->>App: Deliver webhook (x-signature)`}
      />
      <Steps>
        <Step number={1} title="The cycle boundary arrives">
          <p>Determined by the plan&apos;s interval and the subscription&apos;s anchor date, the date the subscription first went active.</p>
        </Step>
        <Step number={2} title="An invoice generates">
          <p>Line items reflect the plan price, plus any proration from a mid-cycle change (see below).</p>
        </Step>
        <Step number={3} title="A charge attempt fires">
          <p>Against the tokenised card on file, via Monnify&apos;s Charge API.</p>
        </Step>
        <Step number={4} title="The outcome writes to the event store">
          <p>
            Success → <code className="inline">InvoicePaid</code>. Failure → <code className="inline">PaymentFailed</code>,
            and the subscription moves to <code className="inline">past_due</code>. See{" "}
            <a href="/concepts/subscription-lifecycle">Subscription lifecycle</a>.
          </p>
        </Step>
      </Steps>

      <h2 id="h-proration">Proration on plan changes</h2>
      <p>
        A customer upgrades from &quot;Lumen Monthly&quot; to &quot;Lumen Pro&quot; halfway through a billing cycle.
        The proration math itself is real: it works out the credit for the unused portion of the old plan and the
        prorated cost of the new one for the remainder of the current cycle, and shows it to you before you confirm
        the change.
      </p>
      <Callout variant="note">
        <p>
          What&apos;s not automated yet is collecting that prorated amount, changing a plan today applies
          immediately at the new price starting next cycle, but doesn&apos;t itself trigger a mid-cycle charge or
          credit. Treat the proration preview as accurate math you&apos;ll need to reconcile manually for now, not
          as a charge that already happened.
        </p>
      </Callout>

      <h2 id="h-attempts">Every attempt, tracked</h2>
      <p>
        Every charge attempt, successful or failed, is recorded as a payment attempt, linked to its invoice and its
        subscription. If a charge fails and later recovers through dunning, you see both attempts on the same
        invoice, in order, not just the final outcome. This is what makes a support conversation (&quot;why was I
        charged twice&quot;) answerable from the dashboard instead of an escalation to engineering.
      </p>

      <h2 id="h-failure">When a charge fails</h2>
      <p>
        The subscription transitions to <code className="inline">past_due</code>, a grace period begins, and
        recovery starts on the subscriber&apos;s preferred channel. None of this requires you to do anything,
        it&apos;s the same mechanism covered in <a href="/how-it-works">How it works</a> and detailed in{" "}
        <a href="/concepts/recovery-orchestration">Recovery orchestration</a>.
      </p>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={2}>
        <CardLink
          href="/concepts/subscription-lifecycle"
          icon={RefreshCw}
          title="Subscription lifecycle"
          description="The full state machine, including grace periods and suspension."
        />
        <CardLink
          href="/merchants/analytics"
          icon={BarChart3}
          title="Analytics"
          description="How billing outcomes roll up into MRR, churn, and recovery rate."
        />
      </CardGrid>
    </>
  );
}
