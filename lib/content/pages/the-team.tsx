import { Callout } from "@/components/docs/content/callout";
import { CardGrid, Card, CardLink } from "@/components/docs/content/card-grid";
import type { PageMeta } from "@/lib/content/types";
import { Compass, CreditCard, Target } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Get started",
  title: "Team Sentry",
  lede: "2 guys who've lost a number of weekends to billing cron jobs.",
};

export default function TheTeam() {
  return (
    <>
      <p>
        Subflow is built by{" "}
        <strong className="font-extrabold">Team Sentry</strong>, 2 fresh
        graduates, for the{" "}
        <strong className="font-extrabold">
          Monnify x DevCareer Hackathon 2026
        </strong>
        .
      </p>
      <p>
        The dynamics of handling subscriptions is a problem we&apos;ve both
        faced at different times during our careers when trying to add
        subscriptions to gig apps we&apos;ve built. Hence, it&apos;s technically
        an internal frustration for us.
      </p>
      <p>
        Many times we&apos;ve had to pull off feature work to patch the same
        recurring-billing gaps, e.g a webhook that silently stopped firing, a
        customer who wanted to pause instead of cancel and had no way to do it,
        a Friday-night card decline nobody saw until Monday. Each of those fixes
        was reasonable on its own, however, together they were a second product
        nobody entirely.
      </p>
      <p>
        So this for us is an opportunity to build that product properly, which
        is a real subscription lifecycle, with an event store instead of three
        different write paths for webhooks and analytics, and a recovery flow
        that reaches a customer on the channel they actually check instead of an
        email that sits unread.
      </p>

      <h2 id="h-builders">The builders</h2>
      <CardGrid cols={2}>
        <Card icon={Compass} title="Benjamin Nkem - Team lead & Software Engineer">
          Owns the subscription lifecycle, the event store, and the backend as a
          whole, all the pieces everything else is built on top of and the
          merchant dashboard.
        </Card>
        <Card icon={CreditCard} title="Ayowole Sodipe - Software Engineer">
          Owns the frontend and the Monnify integration, Customer Portal,
          Documentation and API Reference.
        </Card>
      </CardGrid>

      <h2 id="h-why">Why this exists</h2>
      <p>
        Most subscription tooling available to a Nigerian business is either a
        raw set of payment primitives, tokenised cards, a charge endpoint, that
        still leaves the billing logic, the recovery logic, and the reporting to
        be built from scratch.
      </p>
      <p>
        Or a subscription platform built for a market where a customer is more
        reliably reached by email than by WhatsApp, SMS, or a USSD code.
        Neither fits a business collecting recurring naira payments from
        customers who live on their phones, not their inboxes.
      </p>
      <p>
        Subflow is the version built for that reality, the
        Nigerian reality: recurring billing that works the way payment behaviour
        actually works here, and recovery that reaches people on the rails
        they&apos;re already using.
      </p>

      <h2 id="h-next">What to read next</h2>
      <CardGrid cols={2}>
        <CardLink
          href="/mission"
          icon={Target}
          title="The mission"
          description="The objectives behind the build, and what's explicitly out of scope."
        />
        <CardLink
          href="/how-it-works"
          icon={Compass}
          title="How it works"
          description="The full arc, end to end."
        />
      </CardGrid>
    </>
  );
}
