import { Card, CardGrid, CardLink } from "@/components/docs/content/card-grid";
import { Mermaid } from "@/components/docs/content/mermaid";
import { Steps, Step } from "@/components/docs/content/steps";
import type { PageMeta } from "@/lib/content/types";
import { CheckCircle2, FolderOpen, Mail, MessageCircle, TestTube2 } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Core concepts",
  title: "Recovery orchestration",
  lede: "One event triggers a real email, a Twilio-backed WhatsApp or SMS send, and three single-use links. Here's exactly what's live today, and what's still a stand-in.",
};

export default function RecoveryOrchestration() {
  return (
    <>
      <p>
        A failed charge writes a <code className="inline">PaymentFailed</code> domain event to the{" "}
        <a href="/concepts/event-store">event store</a>. That one write is what fans out to notifications, the
        same way it fans out to webhooks and analytics, no separate code path per channel. This page is what
        actually happens downstream of that event today, not a description of a channel network that doesn&apos;t
        exist yet.
      </p>

      <h2 id="h-schedule">The retry schedule</h2>
      <p>
        Dunning runs three scheduled retry attempts against the stored card: <strong>24 hours</strong>,{" "}
        <strong>72 hours</strong>, then <strong>7 days</strong> after the original failure. The subscription moves
        to <code className="inline">grace_period</code> once the second attempt has also failed, and to{" "}
        <code className="inline">suspended</code> if the third attempt fails too. Each attempt is a real charge
        against Monnify&apos;s Charge API, not a simulated retry, see{" "}
        <a href="/concepts/subscription-lifecycle">Subscription lifecycle</a>.
      </p>

      <Mermaid
        chart={`flowchart TD
    A["Charge fails"]:::accent --> B["subscription -> past_due"]
    B --> C["Retry scheduled: 24h later"]
    C --> D{"Attempt 2"}
    D -->|Success| Z["payment.recovered -> active"]:::accent2
    D -->|Fail too| E["subscription -> grace_period"]
    E --> F["Retry scheduled: 7 days later"]
    F --> G{"Attempt 3"}
    G -->|Success| Z
    G -->|Fail too| H["subscription -> suspended"]

    classDef accent fill:#c9971f,stroke:#8a6416,color:#ffffff,font-weight:600;
    classDef accent2 fill:#1e9a5a,stroke:#166e42,color:#ffffff,font-weight:600;
`}
      />
      <p className="body-secondary">
        Note there&apos;s no <code className="inline">grace_period</code> stop between the first failure and the
        second attempt, that state only appears once the second attempt has also failed, see{" "}
        <a href="/concepts/subscription-lifecycle">Subscription lifecycle</a> for why they&apos;re kept separate.
      </p>

      <h2 id="h-channels">What actually fires, channel by channel</h2>
      <CardGrid cols={2}>
        <Card icon={CheckCircle2} title="Email — fully live">
          Sent via SMTP on every recovery attempt, no exceptions. This is the one channel with no simulated
          fallback and no missing wiring.
        </Card>
        <Card icon={CheckCircle2} title="WhatsApp &amp; SMS — live, with a safety net">
          Sent via a direct Twilio REST call. If Twilio credentials aren&apos;t configured for an environment, the
          send is simulated rather than silently failing, useful for demos, worth knowing before you assume a
          message actually reached a phone.
        </Card>
        <Card icon={TestTube2} title="USSD — simulated only">
          A session endpoint exists in the shape a telco aggregator would expect (dial in, check status, pause,
          cancel), but there&apos;s no live short-code or telco integration behind it yet. Nothing about it reaches
          a real handset today.
        </Card>
        <Card icon={TestTube2} title="Inbound WhatsApp taps &amp; SMS replies — not wired">
          A subscriber tapping a button on a real WhatsApp message, or replying to a real SMS, doesn&apos;t reach
          this system yet, there&apos;s no live inbound receiver for either. The endpoints exist in the right
          shape for when that wiring lands.
        </Card>
      </CardGrid>

      <h2 id="h-links">The actual recovery mechanism: three single-use links</h2>
      <p>
        Underneath whichever channel reaches a subscriber, recovery resolves to one of three signed, single-use
        links, each valid for 7 days and redeemable exactly once: <strong>retry the charge</strong>,{" "}
        <strong>pause the subscription</strong>, or <strong>cancel it</strong>. That&apos;s the full set today,
        there&apos;s no update-payment-method link and no downgrade link yet, so a card that&apos;s actually
        expired can&apos;t be fixed through a recovery message alone; a merchant re-running{" "}
        <a href="/merchants/onboard-and-collect-payment">Checkout</a> for that customer is the current path.
      </p>

      <h2 id="h-flow">How a recovery attempt actually runs</h2>
      <Steps>
        <Step number={1} title="A charge attempt fails">
          <p>
            <code className="inline">PaymentFailed</code> writes to the event store, the subscription moves to{" "}
            <code className="inline">past_due</code>.
          </p>
        </Step>
        <Step number={2} title="The event processor queues notification jobs">
          <p>
            Picked up asynchronously via BullMQ, not fired inline on the request that recorded the failure, see{" "}
            <a href="/architecture/queues-and-async">Queues &amp; async processing</a>.
          </p>
        </Step>
        <Step number={3} title="Email sends, every time">
          <p>The durable baseline described above.</p>
        </Step>
        <Step number={4} title="WhatsApp and SMS send where a number is on file">
          <p>Real Twilio sends, or a simulated stand-in if Twilio isn&apos;t configured for that environment.</p>
        </Step>
        <Step number={5} title="Recovery, in practice, means the automatic retry">
          <p>
            The retry/pause/cancel link primitive exists internally and is real, generated by the dunning flow
            itself, but none of the notification channels embed it in the message body yet, and inbound WhatsApp
            taps aren&apos;t connected to Twilio&apos;s real webhook shape. Until that wiring lands, what actually
            recovers most subscriptions today is the scheduled retry itself, not a subscriber tapping something.
          </p>
        </Step>
      </Steps>

      <h2 id="h-reporting">What this feeds</h2>
      <p>
        Every dunning attempt, retried or not, rolls into the dunning metrics on a merchant&apos;s analytics:
        past-due volume, grace-period volume, and recovery rate. Recovery-by-channel attribution exists in the
        data model, but only for the channels that actually have a live trigger path today, automatic retries,
        WhatsApp, and USSD, see <a href="/merchants/analytics">Analytics</a>.
      </p>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={3}>
        <CardLink
          href="/channels/email"
          icon={Mail}
          title="Email"
          description="The one channel with nothing simulated about it."
        />
        <CardLink
          href="/channels/whatsapp"
          icon={MessageCircle}
          title="WhatsApp"
          description="Real sends, real fallback behaviour, and what a tap actually does."
        />
        <CardLink
          href="/architecture/queues-and-async"
          icon={FolderOpen}
          title="Queues & async processing"
          description="How retries are actually scheduled."
        />
      </CardGrid>
    </>
  );
}
