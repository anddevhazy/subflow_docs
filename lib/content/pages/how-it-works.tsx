import { Callout } from "@/components/docs/content/callout";
import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import { Mermaid } from "@/components/docs/content/mermaid";
import { Steps, Step } from "@/components/docs/content/steps";
import type { PageMeta } from "@/lib/content/types";
import { Bell, Store, UserCheck } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Get started",
  title: "How it works",
  lede: "A merchant creates a plan. A customer subscribes. Monnify collects the charge. If it fails, recovery kicks in. The whole arc, end to end, in one page.",
};

export default function HowItWorks() {
  return (
    <>
      <p>
        Adaeze runs Lumen, a fitness app charging ₦15,000 a month. She needs
        three things from a billing system: get paid on time, don&apos;t lose a
        member to a card that quietly expired, and know at a glance whether the
        business is growing or leaking. Here&apos;s what happens on the
        Subscription Engine, from the moment she defines a plan to the moment a
        failed charge recovers itself.
      </p>

      <Mermaid
        chart={`flowchart TD
    A["1. Merchant creates a plan"]:::accent --> B["2. Customer subscribes\n(card tokenised via Checkout)"]
    B --> C["3. Billing cycle fires"]
    C --> D["4. Charge attempted via Monnify"]:::accent
    D -->|success| E["5a. Invoice paid, event stored"]:::accent2
    D -->|failure| F["5b. past_due → grace period"]
    F --> G["6. Recovery fires: email / WhatsApp / SMS / USSD"]
    G --> H["7. Recovered, subscription returns to active"]:::accent2

    classDef accent fill:#c9971f,stroke:#8a6416,color:#ffffff,font-weight:600;
    classDef accent2 fill:#1e9a5a,stroke:#166e42,color:#ffffff,font-weight:600;
`}
      />

      <h2 id="h-plan">1. Adaeze creates a plan</h2>

      <Steps>
        <Step number={1} title="She opens the merchant dashboard">
          <p>
            Signed up last week with her work email, verified, and landed in the
            plans screen with an empty state.
          </p>
        </Step>
        <Step number={2} title="She fills in the plan">
          <p>
            Name: &quot;Lumen Monthly.&quot; Price: ₦15,000. Interval: monthly.
            Trial: 7 days. Submit.
          </p>
        </Step>
        <Step number={3} title="The plan is live">
          <p>
            It shows up wherever her app reads plans from the API, no redeploy
            needed on her end.
          </p>
        </Step>
      </Steps>
      <p className="body-secondary">
        See <a href="/merchants/create-a-plan">Create a plan</a> for the full
        field list, including quarterly, yearly, and custom intervals.
      </p>

      <h2 id="h-subscribe">2. A customer subscribes</h2>
      <p>
        A new member opens Lumen&apos;s app, picks the monthly plan, and enters
        a card. Lumen&apos;s app calls the Subscription Engine, which hands back
        a Monnify Checkout session. The customer completes card entry inside that
        session, the raw card number never touches Lumen&apos;s servers or the
        Subscription Engine&apos;s. Monnify tokenises the card and returns a
        reference. That reference is what gets charged on every future billing
        cycle; nobody re-enters card details again unless the card itself
        changes.
      </p>

      <h2 id="h-cycle">3. The billing cycle fires</h2>
      <p>
        Seven days later, the trial ends and the first billing cycle starts. The
        subscription is <code className="inline">trialing</code> right up until
        that moment, then flips to <code className="inline">active</code> as the
        first charge attempt begins.
      </p>

      <h2 id="h-charge">4. The charge runs against Monnify</h2>
      <p>
        The billing engine calls Monnify&apos;s Charge API with the stored token.
        Two branches from here.
      </p>

      <h2 id="h-success">5a. It succeeds</h2>
      <p>
        An invoice is marked paid with line-item detail. An{" "}
        <code className="inline">InvoicePaid</code> event writes to the event
        store. Adaeze&apos;s MRR ticks up by ₦15,000 the next time she opens her
        analytics, no batch job to wait on, since analytics reads the same event
        store the webhook pipeline does.
      </p>

      <h2 id="h-failure">5b. It fails</h2>
      <p>
        Say the member&apos;s card expired last week and they haven&apos;t
        noticed. The Charge API call returns, but that response alone isn&apos;t
        what decides the outcome, Monnify&apos;s own webhook confirms it a moment
        later, and that&apos;s the signal the billing engine actually trusts.
        Once it lands: the subscription transitions to{" "}
        <code className="inline">past_due</code>, a grace period starts, and a{" "}
        <code className="inline">PaymentFailed</code> event writes to the event
        store. Nothing here is a cron job scanning for failures after the fact,
        but it&apos;s a confirmed webhook driving the transition, not a
        synchronous guess. See{" "}
        <a href="/architecture/monnify-integration">Monnify integration</a>.
      </p>

      <h2 id="h-recovery">
        6. Recovery fires, on the channel that actually reaches them
      </h2>
      <p>
        Within minutes, not days, an email goes out with a record of the
        failure, every time, no exceptions. If a phone number&apos;s on file, a
        WhatsApp or SMS notice sends too, over a real Twilio integration. The
        automatic recovery path itself is more limited than a full self-serve
        menu today: it resolves through one of three single-use links, retry,
        pause, or cancel, wired into WhatsApp and USSD interactions, not yet
        into the email body itself or an SMS reply. There&apos;s no Downgrade
        option on that path, but a subscriber isn&apos;t stuck either way,
        they can request a{" "}
        <a href="/merchants/customer-portal/overview">customer portal</a>{" "}
        link separately and pause, cancel, or switch plans there instead. See{" "}
        <a href="/concepts/recovery-orchestration">Recovery orchestration</a>{" "}
        for the exact, current shape of this, channel by channel.
      </p>

      <Callout variant="note">
        <p>
          The developer maintaining Lumen&apos;s backend doesn&apos;t have to
          poll for any of this. A <code className="inline">payment.failed</code>{" "}
          webhook fires the moment the charge failure is confirmed; a{" "}
          <code className="inline">payment.recovered</code> webhook fires the
          moment recovery succeeds. See{" "}
          <a href="/developer/webhooks">Webhooks</a>.
        </p>
      </Callout>

      <h2 id="h-recovered">7. The subscription recovers</h2>
      <p>
        A retried charge succeeds, whether triggered automatically on the
        dunning schedule or via one of the recovery links above. The
        subscription transitions back to <code className="inline">active</code>.
        A new invoice is marked paid. A{" "}
        <code className="inline">PaymentRecovered</code> event writes to the
        event store, and Adaeze&apos;s dashboard shows the recovery in her
        dunning metrics the next time she looks, no manual reconciliation, no
        spreadsheet.
      </p>

      <h2 id="h-loop">The loop, closed</h2>
      <p>
        Every one of these steps, plan created, card tokenised, charge
        attempted, event stored, message sent, webhook delivered, traces back to
        the same event store. That&apos;s what makes the analytics trustworthy
        and the webhook replay reliable: there&apos;s one write path, read three
        different ways.
      </p>

      <CardGrid cols={3}>
        <CardLink
          href="/merchants/overview"
          icon={Store}
          title="Merchants"
          description="Plans, billing, and analytics from the operator's side."
        />
        <CardLink
          href="/concepts/recovery-orchestration"
          icon={UserCheck}
          title="Recovery"
          description="The recovery experience from the customer's side, and what's live today."
        />
        <CardLink
          href="/developer/webhooks"
          icon={Bell}
          title="Developers"
          description="The events that let you build on top of any of this."
        />
      </CardGrid>
    </>
  );
}
