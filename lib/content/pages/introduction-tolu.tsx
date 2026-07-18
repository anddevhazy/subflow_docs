import { Callout } from "@/components/docs/content/callout";
import { CardGrid, Card, CardLink } from "@/components/docs/content/card-grid";
import type { PageMeta } from "@/lib/content/types";
import {
  Code2,
  Compass,
  Construction,
  Mail,
  MessageCircle,
  Monitor,
  Phone,
  Store,
  Target,
  UserCheck,
  Zap,
} from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Get started",
  title: "It starts with Tolu.",
  lede: "The subscription that almost cancelled itself.",
};

export default function IntroductionTolu() {
  return (
    <>
      <p>
        Tolu pays ₦4,500 a month for an online course platform she&apos;s three
        modules into. Payday lands on the 28th, her card charges on the 25th.
        Most months that&apos;s fine, there&apos;s just enough float. This month
        there isn&apos;t.
      </p>
      <p>
        The charge fails. On a system with no recovery logic, that&apos;s the
        end of it: silent cancellation, no message, no second attempt. Tolu
        doesn&apos;t even know her subscription is gone until she tries to log
        in three days later and finds herself locked out of a course she was two
        modules from finishing.
      </p>
      <p>
        She didn&apos;t cancel. Nobody told her anything was wrong. The
        subscription just stopped, because a charge failed on the wrong day and
        nothing was built to notice.
      </p>

      <h2 id="h-demo-video">Demo video</h2>
      <div className="mb-5 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
        <div className="flex aspect-video items-center justify-center bg-linear-to-br from-[#fbf4e1] via-[#f7f0dd] to-[#efe3c2] px-6 text-center">
          <video
            className="max-h-full max-w-full rounded-lg"
            controls
            src="/videos/Subflow_Demo.mov"
          />
        </div>
      </div>

      <h2 id="h-adaeze">And there is Adaeze</h2>
      <p>
        Adaeze runs the platform Tolu subscribes to. Forty-something paying
        customers, growing every month, and until recently she was tracking
        who&apos;d paid, who&apos;d lapsed, and who needed a nudge in a
        spreadsheet she updated by hand every few days.
      </p>
      <p>
        She isn&apos;t bad at this. She built the whole platform herself. But
        recurring billing isn&apos;t the product she set out to build, it&apos;s
        the tax she pays for having a product worth paying for monthly. Every
        failed card is revenue that just quietly stops arriving, and by the time
        she notices a customer has lapsed, it&apos;s often too late to win them
        back with anything better than a cold &quot;hey, did you mean to
        cancel?&quot; email.
      </p>
      <p>Subflow is for both of them.</p>

      <h2 id="h-what-it-is">What Subflow is</h2>
      <p>
        Subflow gives Adaeze a billing layer that doesn&apos;t lose Tolu over a
        bad-timing decline.
      </p>
      <p>
        Adaeze creates a plan through the API, ₦4,500/month, seven-day trial.
        Tolu subscribes through Adaeze&apos;s checkout flow; her card is
        tokenised once through Monnify Checkout and stored for reuse. Every month,
        the engine attempts the charge automatically against that stored card.
      </p>
      <p>
        On the 25th, the charge fails. Instead of silently dropping the
        subscription, the engine moves it to{" "}
        <code className="inline">past_due</code> and opens a grace period. A
        WhatsApp message goes to Tolu the same hour:{" "}
        <em>
          &quot;Your payment for [Adaeze&apos;s platform] didn&apos;t go
          through.&quot;
        </em>{" "}
        Payday lands three days later. The scheduled retry on the dunning
        timeline fires against her card, now funded, and it succeeds. The
        subscription returns to <code className="inline">active</code>, no gap,
        no re-signup, no lost course progress, and no action Tolu had to take at
        all.
      </p>
      <p>
        Every transition (the failed charge, the grace period, the retry, the
        recovery) is written to an append-only event store. A webhook fires to
        Adaeze&apos;s system the moment the subscription recovers, so her
        platform re-grants access automatically, with no manual check on her
        end.
      </p>
      <p>
        Adaeze opens her dashboard that evening and sees it in the numbers: one
        past-due subscription, recovered on schedule, MRR unaffected.
      </p>
      <p>That is Subflow.</p>

      <Callout variant="note">
        <p>
          <strong>
            Billing that recovers before a customer even notices something
            broke.
          </strong>{" "}
          Every charge, every retry, every recovered subscription writes to a
          ledger a merchant can actually see.
        </p>
      </Callout>

      <h2 id="h-connects">What Subflow actually connects</h2>
      <p>Three sides. One event store.</p>
      <CardGrid cols={3}>
        <Card icon={Store} title="Merchants">
          Businesses running recurring revenue, SaaS platforms, gyms, streaming
          services, content subscriptions, recurring giving. They get plan
          management, automated invoicing, multi-channel recovery, and a
          real-time view of MRR, churn, and recovery performance, without
          building any of it themselves.
        </Card>
        <Card icon={Code2} title="Downstream developers">
          Engineers integrating the engine into a merchant&apos;s product, or
          building a customer-facing billing experience on top of it. They get a
          documented API, signed webhooks, and on-demand event replay, no
          support ticket required for a standard integration.
        </Card>
        <Card icon={UserCheck} title="Subscribers">
          The merchant&apos;s end customers. A self-service portal to pause,
          cancel, or update payment methods on their own terms isn&apos;t
          shipped yet, today what they get is a real-time notice when a charge
          fails, email always, WhatsApp or SMS where a number&apos;s on file,
          and the automatic retries that follow it.
        </Card>
      </CardGrid>
      <p>
        Connecting any two of these solves a piece of the problem. A merchant
        with only a payment gateway can collect money but can&apos;t recover it
        when it fails. A developer with only an API reference can integrate a
        charge but not a lifecycle. Connecting all three is what turns &quot;we
        accept recurring payments&quot; into &quot;we don&apos;t quietly lose
        the ones that almost got away.&quot;
      </p>

      <h2 id="h-underneath">What is underneath</h2>
      <p>
        Every payment runs through the <strong>Monnify API</strong>, Checkout for
        tokenisation, the Charge API for each billing-cycle attempt, and inbound
        Monnify webhooks that trigger internal state transitions the moment a
        payment event lands, confirmed asynchronously, not guessed at from a
        synchronous response.
      </p>
      <p>
        The service itself is a NestJS API on PostgreSQL, with BullMQ and Redis
        running recovery and webhook-delivery jobs asynchronously so a slow
        WhatsApp provider or a flaky downstream endpoint never blocks a request.
        JWT access and refresh tokens authenticate merchant users; every
        business resource is scoped to a{" "}
        <code className="inline">merchantId</code> at the data-access layer, not
        just the application layer.
      </p>
      <p>
        Recovery reaches subscribers on whichever channel keeps working when the
        others don&apos;t:
      </p>

      <CardGrid cols={2}>
        <CardLink
          href="/channels/web"
          icon={Monitor}
          title="Web"
          description={
            <>
              <strong>For merchants and developers.</strong> Merchant dashboard
              for plan and subscription management, analytics, API keys, and
              webhooks. There&apos;s no separate subscriber-facing app yet.
            </>
          }
        />
        <CardLink
          href="/channels/email"
          icon={Mail}
          title="Email"
          description={
            <>
              <strong>For subscribers, always.</strong> The durable, fully-live
              baseline. Fires on every recovery attempt, no configuration
              dependency, no simulated fallback.
            </>
          }
        />
        <CardLink
          href="/channels/whatsapp"
          icon={MessageCircle}
          title="WhatsApp"
          description={
            <>
              <strong>For subscribers, on charge failure.</strong> A real
              Twilio-backed notice. Acting on it today happens through other
              means, not yet a tap on the message itself.
            </>
          }
        />
        <CardLink
          href="/channels/sms"
          icon={Mail}
          title="SMS"
          description={
            <>
              <strong>For subscribers without WhatsApp.</strong> The same
              Twilio-backed notice over a rail every handset supports. Replying
              to it doesn&apos;t do anything yet, there&apos;s no inbound
              receiver.
            </>
          }
        />
        <CardLink
          href="/channels/ussd"
          icon={Phone}
          title="USSD"
          description={
            <>
              <strong>Designed, not yet live.</strong> A menu flow to check
              subscription status, pause, or cancel, correctly shaped for a real
              short-code provider, but with no telco arrangement behind it
              today.
            </>
          }
        />
      </CardGrid>

      <p>
        Behind the channels: notification fan-out driven by one event, not
        duplicated logic per provider. One event store that webhooks,
        notifications, and analytics all read from, rather than three systems
        slowly drifting out of sync with each other. See{" "}
        <a href="/concepts/recovery-orchestration">Recovery orchestration</a>{" "}
        for exactly what&apos;s live today versus what&apos;s still a stand-in.
      </p>

      <h2 id="h-next">Where to go from here</h2>
      <CardGrid cols={2}>
        <CardLink
          href="/mission"
          icon={Target}
          title="The mission"
          description="Five business objectives, six things deliberately left out of this release, and how the build maps to the hackathon brief."
        />
        <CardLink
          href="/how-it-works"
          icon={Compass}
          title="How it works"
          description="Adaeze creates a plan. Tolu subscribes. A charge fails. The scheduled retry recovers it. The event store, end to end."
        />
        <CardLink
          href="/architecture/overview"
          icon={Construction}
          title="Architecture"
          description="Modules, the event store, and where webhooks and analytics both read from one source of truth."
        />
        <CardLink
          href="/quick-start"
          icon={Zap}
          title="Quick start"
          description="Create a plan, subscribe a test customer, and trigger a failed charge to watch recovery happen live."
        />
      </CardGrid>

      <Callout variant="tip">
        <p>
          Every page on this site is written to give you something useful in the
          first thirty seconds, and depth if you stay. If you came in cold,
          start with <a href="/how-it-works">How it works</a>. If you came in
          technical, start with{" "}
          <a href="/architecture/overview">Architecture</a>.
        </p>
      </Callout>
    </>
  );
}
