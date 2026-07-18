import { CardGrid, Card, CardLink } from "@/components/docs/content/card-grid";
import type { PageMeta } from "@/lib/content/types";
import { ArrowRight, Bell, Code2, Mail, MessageCircle, Monitor, Phone, Store, UserCheck, Zap } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Get started",
  title: "Think about GOTV and DSTV",
  lede: "A subscription engine for merchants who'd rather ship a product than a payments team. For context:",
};

export default function Introduction() {
  return (
    <>
      <p>
        MultiChoice&apos;s pay-TV platforms serve tens of millions of subscribers across Africa, and in Nigeria
        alone, DStv and GOtv still hold something close to 60% of the pay-TV market. But look closely at how renewal
        actually works: it&apos;s prepaid, and it&apos;s entirely manual. There&apos;s no card on file quietly
        auto-debiting on the first of the month.
      </p>
      <p>
        Every single cycle, a subscriber has to actively go to the MyGOtv app, dial *288#, or use a bank USSD code,
        and pay again, or the decoder disconnects.
      </p>
      <p>
        MultiChoice has been public about the biggest driver of its Nigerian subscriber losses: inflation, currency
        pressure, repeated price hikes. That&apos;s real, and it&apos;s not what this is about.
      </p>
      <p>
        But sitting underneath that macro story is a smaller, quieter kind of churn that a fully manual renewal
        model almost guarantees: the subscriber who isn&apos;t trying to leave. The one who gets busy, forgets the
        date, means to renew on Friday, and by Sunday the screen just says &quot;Please Subscribe&quot; with nothing
        else, no reminder that arrived in time, no one-tap way to fix it from wherever they are, no attempt made to
        win them back before they shrug and decide to just wait until next month, or don&apos;t come back at all.
      </p>
      <p>
        Anyways, this isn&apos;t a GOTV problem specifically. It&apos;s what happens to any subscription business
        built without a recovery layer: the happy path, subscriber remembers, subscriber pays, subscriber watches
        their shows, takes no engineering at all.
      </p>
      <p>
        It&apos;s the other path, the one where a payment doesn&apos;t happen automatically and nobody proactively
        closes that gap, that determines how much revenue quietly leaks out the side every single month, across
        tens of millions of subscribers.
      </p>
      <p>
        Subflow is built for exactly that gap. Plans, customers, and subscriptions have a real
        lifecycle. A lapsed or failed payment doesn&apos;t wait for someone to notice, it starts a recovery sequence
        on email, WhatsApp, SMS, or USSD within minutes, on whichever rail the subscriber actually uses. Every event
        is written once, to one place, and read by webhooks, notifications, and analytics alike.
      </p>

      <h2 id="h-what-it-is">What Monnify Subscriptions is</h2>
      <p>
        A multi-tenant Subscription-as-a-Service API built on Monnify&apos;s payment infrastructure. A merchant signs
        up, defines pricing plans, and starts collecting recurring payments, without writing a line of billing
        logic themselves. Underneath, every card charge, every invoice, and every recovery attempt runs through the
        same four Monnify surfaces: Checkout for tokenisation, Charge for the recurring debit, Transfers for payout
        splits, and signed webhooks tying it all back together.
      </p>
      <p>
        The platform ships as three applications sharing one API: this documentation and API reference, a merchant
        dashboard for running the business day to day, and a customer portal where a subscriber manages their own
        plan without ever emailing the merchant.
      </p>

      <h2 id="h-connects">What Monnify Subscriptions connects</h2>
      <p>Three sides. One event store underneath all of them.</p>
      <CardGrid cols={3}>
        <Card icon={Store} title="Merchants">
          The businesses running subscriptions, from a solo creator to a multi-seat operations team. They get plans,
          invoicing, recovery, and analytics without building any of it themselves.
        </Card>
        <Card icon={Code2} title="Downstream developers">
          Engineers integrating the API into a merchant&apos;s product, or building on top of it. They get
          documented resources, signed webhooks, and reliable replay.
        </Card>
        <Card icon={UserCheck} title="Subscribers">
          The merchant&apos;s own customers. They get a portal to manage their subscription and a recovery flow that
          reaches them on the channel they actually use, web, email, WhatsApp, SMS, or USSD.
        </Card>
      </CardGrid>
      <p>
        Connecting any two of these solves a piece of the problem. All three together is what makes the platform
        something a merchant can depend on operationally, not just a checkout button.
      </p>

      <h2 id="h-underneath">What is underneath</h2>
      <p>
        Every charge, every tokenisation, every payout split runs through <strong>Monnify</strong>, Checkout API,
        Tokenised Cards, Charge API, and Transfers API, wired together behind one billing engine. Monnify moves the
        money; the engine decides when to move it, what to do when it fails, and who to tell.
      </p>
      <p>
        There is no AI or machine-learning layer in this release. Recovery sequencing is a deterministic,
        configurable orchestration component, not a model, because the goal here is a predictable, auditable
        billing system, not a scored one.
      </p>

      <h2 id="h-channels">Five channels, one API underneath</h2>
      <CardGrid cols={2}>
        <CardLink href="/channels/web" icon={Monitor} title="Web" description="The API, the merchant dashboard, and the customer portal." />
        <CardLink
          href="/channels/email"
          icon={Mail}
          title="Email"
          description="The always-on baseline. Fires on every recovery attempt, no exceptions."
        />
        <CardLink
          href="/channels/whatsapp"
          icon={MessageCircle}
          title="WhatsApp"
          description="Retry Now, Pause, or Downgrade, right inside a failed-charge message."
        />
        <CardLink
          href="/channels/sms"
          icon={Mail}
          title="SMS"
          description="Reply YES to retry. Works on any phone, any network."
        />
        <CardLink
          href="/channels/ussd"
          icon={Phone}
          title="USSD"
          description="Check status, pause, or cancel, no data connection needed."
        />
      </CardGrid>

      <h2 id="h-next">Where to go from here</h2>
      <CardGrid cols={2}>
        <CardLink
          href="/how-it-works"
          icon={ArrowRight}
          title="How it works"
          description="Walk through the whole arc, end to end, in one page."
        />
        <CardLink
          href="/quick-start"
          icon={Zap}
          title="Quick start"
          description="Three ways to feel the engine in five minutes."
        />
        <CardLink
          href="/merchants/overview"
          icon={Store}
          title="For merchants"
          description="Plans, customers, invoices, and analytics."
        />
        <CardLink
          href="/developer/webhooks"
          icon={Bell}
          title="Webhooks"
          description="Subscribe once, receive every domain event forever."
        />
      </CardGrid>
    </>
  );
}
