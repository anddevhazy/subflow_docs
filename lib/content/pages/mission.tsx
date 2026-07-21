import { CardGrid, Card, CardLink } from "@/components/docs/content/card-grid";
import type { PageMeta } from "@/lib/content/types";
import {
  Bell,
  Building2,
  Compass,
  Construction,
  Divide,
  DoorOpen,
  FileText,
  Puzzle,
  RefreshCw,
  Repeat,
  UserCheck,
} from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Get started",
  title: "The mission",
  lede: "Tolu's card fails on the 25th. This is what got built so that isn't the end of the story.",
};

export default function Mission() {
  return (
    <>
      <p>
        This was built for the Monnify Developer Challenge. What follows is what
        we chose to build.
      </p>

      <h2 id="h-track">Why this exists</h2>
      <p>
        A Checkout API and a Charge API are primitives, not a product. Every
        team that wants recurring billing on Monnify rails currently has to
        invent a subscription state machine, a proration formula, a dunning
        sequence, and a self-service portal on their own, and most of them get
        the unhappy paths wrong the first time because nobody budgets real time
        for a card that fails on a Friday, or on the 25th, three days before
        payday, the way Tolu&apos;s did.
      </p>
      <p>
        On a naive system, that failed charge is the end of it: silent
        cancellation, no message, no second attempt. This is the layer that
        means it doesn&apos;t have to be.
      </p>

      <h2 id="h-must-include">What got built</h2>
      <p>
        A managed recurring-billing layer needs a handful of things working
        together, and we are providing it all.
      </p>

      <CardGrid cols={2}>
        <Card icon={FileText} title="Plan management">
          <p>
            Name, price, interval, and optional trial, created through the API
            or the merchant dashboard, live the moment they&apos;re submitted.
            See <a href="/merchants/create-a-plan">Create a plan</a>.
          </p>
        </Card>
        <Card icon={RefreshCw} title="Billing cycles">
          <p>
            Monthly, quarterly, yearly, and custom intervals, with trial support
            built into the subscription lifecycle rather than bolted on as a
            flag. See{" "}
            <a href="/concepts/subscription-lifecycle">
              Subscription lifecycle
            </a>
            .
          </p>
        </Card>
        <Card icon={Divide} title="Proration">
          <p>
            The math is real, and so is the collection: a mid-cycle upgrade
            computes the credit for the unused portion of the old plan and the
            prorated cost of the new one, then charges the difference
            automatically. See{" "}
            <a href="/merchants/billing-and-invoicing">
              Billing &amp; invoicing
            </a>
            .
          </p>
        </Card>
        <Card icon={Repeat} title="Dunning & failed-payment recovery">
          <p>
            Three scheduled retries, and a real notification on the failure,
            email every time, WhatsApp and SMS via Twilio where a number&apos;s
            on file. USSD and inbound replies exist as endpoints but aren&apos;t
            connected to a real telco yet. See{" "}
            <a href="/concepts/recovery-orchestration">
              Recovery orchestration
            </a>{" "}
            for the honest breakdown.
          </p>
        </Card>
        <Card icon={UserCheck} title="Customer self-service portal">
          <p>
            A subscriber requests a magic-link email and gets a 24-hour portal
            session, view, pause, resume, cancel, reactivate, switch plan,
            update contact details, and update the card on file, all gated by
            what the merchant has configured. See{" "}
            <a href="/merchants/customer-portal/overview">Customer portal</a>{" "}
            for the full detail.
          </p>
        </Card>
        <Card icon={Bell} title="Webhooks for downstream systems">
          <p>
            Every domain event, signed, retried with backoff, dead-lettered on
            exhaustion, and replayable by subscription ID or time range. See{" "}
            <a href="/developer/webhooks">Webhooks</a>.
          </p>
        </Card>
      </CardGrid>

      <h2 id="h-key-apis">The Monnify primitives underneath</h2>
      <p>
        Monnify&apos;s payment primitives are the foundation this whole layer
        sits on. Four surfaces are wired in today, token issuance, Checkout,
        Tokenised-card Charge, and Transfers, the last of these closes the loop:
        a settled payment automatically moves out to a merchant&apos;s bank
        account, not just in. See{" "}
        <a href="/architecture/monnify-integration">Monnify integration</a> for
        the precise detail, and <a href="/merchants/payouts">Payouts</a> for how
        it reaches a merchant&apos;s account.
      </p>

      <table>
        <thead>
          <tr>
            <th>API</th>
            <th>What it does in this system</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Auth token issuance</td>
            <td>
              Client-credentials exchange, cached for an hour, everything else
              below depends on it.
            </td>
          </tr>
          <tr>
            <td>Checkout API</td>
            <td>
              Hosted card entry at subscription signup, requested with
              tokenisation on. The raw card number never touches this
              platform&apos;s servers.
            </td>
          </tr>
          <tr>
            <td>Tokenised-card Charge</td>
            <td>
              The stored reference reused for every billing-cycle charge and
              every dunning retry, so a subscriber enters a card once and never
              again unless it changes.
            </td>
          </tr>
        </tbody>
      </table>

      <p>
        Full detail, including what happens if Monnify credentials aren&apos;t
        configured in an environment:{" "}
        <a href="/architecture/monnify-integration">Monnify integration</a>.
      </p>

      <h2 id="h-judged-on">Under the hood</h2>
      <p>
        None of the above holds up if the engineering underneath it is thin, so
        here&apos;s the depth, the parts a five-minute demo won&apos;t show you.
      </p>

      <CardGrid cols={2}>
        <Card icon={Compass} title="A real state machine">
          <p>
            Eight explicit states, not a boolean and a hope: pending, trialing,
            active, past_due, grace_period, suspended, cancelled, expired. Every
            transition writes an immutable domain event rather than being
            inferred after the fact from a pile of payment rows. See{" "}
            <a href="/concepts/subscription-lifecycle">
              Subscription lifecycle
            </a>
            .
          </p>
        </Card>
        <Card icon={Repeat} title="Dunning that isn't one email">
          <p>
            Three scheduled retries over a week, a real notification fan-out
            driven by one event, not per-channel call sites, and jobs that queue
            and retry rather than drop on a provider hiccup. See{" "}
            <a href="/concepts/recovery-orchestration">
              Recovery orchestration.
            </a>{" "}
          </p>
        </Card>
        <Card icon={Building2} title="Tenant isolation, not a filter">
          <p>
            Every business entity below the merchant carries a merchantId,
            enforced at the data-access layer, not only in application-level
            checks, so a bug in one controller can&apos;t leak another
            merchant&apos;s data. There&apos;s one user per merchant account
            today, no role tiers yet, that&apos;s a real gap against a
            &quot;team&quot; expectation, not a design choice. See{" "}
            <a href="/architecture/overview">Architecture</a>.
          </p>
        </Card>
        <Card icon={Puzzle} title="APIs meant for someone else's team">
          <p>
            A documented resource model, signed and replayable webhooks, and an
            interactive Swagger reference served straight from the API. See{" "}
            <a href="/developer/rate-limits">Rate limits</a>. See also{" "}
            <a href="/developer/webhooks">Webhooks</a>.
          </p>
        </Card>
      </CardGrid>

      <h2 id="h-unhappy-paths">What happens when the charge fails</h2>
      <p>
        This is the part that actually matters, not the happy path where every
        card clears, but what happens on the day it doesn&apos;t. Tolu&apos;s
        card declining three days before payday is the whole reason this exists,
        so here&apos;s exactly what happens next, and to the merchant on the
        other side of it too.
      </p>

      <table>
        <thead>
          <tr>
            <th>Unhappy path</th>
            <th>How it&apos;s handled</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Card decline on a billing cycle</td>
            <td>
              Subscription moves to <code className="inline">past_due</code>, a
              grace period starts, recovery fires within minutes. See{" "}
              <a href="/how-it-works">How it works</a>.
            </td>
          </tr>
          <tr>
            <td>Expired card nobody noticed</td>
            <td>
              The most common real-world failure mode, and the reason recovery
              leads with a retry link rather than a bare &quot;payment
              failed&quot; notice. See{" "}
              <a href="/concepts/recovery-orchestration">
                Recovery orchestration
              </a>
              .
            </td>
          </tr>
          <tr>
            <td>Grace period lapses with no recovery</td>
            <td>
              Subscription moves to <code className="inline">suspended</code>,
              not straight to cancelled, so a subscriber can still self-serve
              their way back without re-onboarding as a new signup.
            </td>
          </tr>
          <tr>
            <td>A merchant&apos;s webhook endpoint is down</td>
            <td>
              Deliveries retry with backoff across five attempts over roughly
              four hours, then dead-letter, then replay on demand once the
              endpoint is fixed. See <a href="/developer/webhooks">Webhooks</a>.
            </td>
          </tr>
          <tr>
            <td>A subscriber wants to pause, not cancel</td>
            <td>
              A first-class action a merchant can take on a subscriber&apos;s
              behalf today, see{" "}
              <a href="/concepts/subscription-lifecycle">
                Subscription lifecycle
              </a>
              .
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="h-scale">How it scales</h2>
      <p>
        This was built to prove a concept in a weekend. But it&apos;s not built
        like a weekend project, it&apos;s positioned for national and
        continental scale.
      </p>

      <table>
        <thead>
          <tr>
            <th>Concern</th>
            <th>How this is positioned for it</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>More merchants, more subscribers</td>
            <td>
              Tenant isolation is enforced at the data-access layer, not bolted
              on with an application-side filter that a future query could
              forget. Onboarding a new merchant is a signup, not a schema
              change.
            </td>
          </tr>
          <tr>
            <td>More events, more webhooks, more notifications</td>
            <td>
              Nothing in the recovery or delivery path runs inline on a request.
              BullMQ on Redis carries every webhook delivery, every dunning
              retry, every notification send, so throughput scales by adding
              workers, not by the API getting slower under load. See{" "}
              <a href="/architecture/queues-and-async">
                Queues &amp; async processing
              </a>
              .
            </td>
          </tr>
          <tr>
            <td>A provider outage</td>
            <td>
              Email, WhatsApp, SMS, and Monnify itself can all have a bad hour
              without a lost recovery attempt or a lost charge, jobs queue and
              retry instead of failing silently. See{" "}
              <a href="/architecture/resilience">Resilience &amp; scale</a>.
            </td>
          </tr>
          <tr>
            <td>A second consumer of the same data</td>
            <td>
              Analytics, notifications, and webhooks all read the same event
              store rather than three separately maintained paths that can
              quietly drift from each other. Adding a fourth consumer later is a
              subscription, not a rewrite. See{" "}
              <a href="/concepts/event-store">The event store</a>.
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="h-commitments">Three commitments of ours</h2>
      <p>
        A recurring-billing layer sits on top of somebody else&apos;s money and
        somebody else&apos;s customer relationship. We took that personal.
      </p>

      <table>
        <thead>
          <tr>
            <th>Commitment</th>
            <th>What it means here</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Every webhook we send is provably ours.</td>
            <td>
              HMAC-SHA256 signatures on every delivery, verifiable independently
              by the receiving service. The signature covers the raw body, not
              the timestamp, see{" "}
              <a href="/security/webhook-verification">
                Webhook signature verification
              </a>{" "}
              for the precise scheme and why you should dedupe on the event id
              rather than lean on the timestamp header for replay protection.
            </td>
          </tr>
          <tr>
            <td>
              A retried or replayed request never becomes a duplicate charge.
            </td>
            <td>
              True for webhook replay, stable event IDs make reprocessing safe
              by construction. Not yet true for API writes, there&apos;s no
              idempotency-key support on endpoints like subscription creation
              today.
            </td>
          </tr>
          <tr>
            <td>Sensitive data is protected, and access to it is narrow.</td>
            <td>
              Passwords and secrets are hashed today. AES-256-GCM encryption for
              stored payment references exists as a utility in the codebase but
              isn&apos;t wired to any field yet, that&apos;s a real gap, not a
              documentation nuance. See{" "}
              <a href="/security/data-protection">
                Data &amp; encryption posture
              </a>
              .
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="h-next">What to read next</h2>
      <CardGrid cols={2}>
        <CardLink
          href="/introduction-tolu"
          icon={DoorOpen}
          title="Introduction"
          description="Tolu's story. The thesis. The recovery channels, as they actually stand today."
        />
        <CardLink
          href="/how-it-works"
          icon={Compass}
          title="How it works"
          description="A merchant creates a plan. A customer subscribes. A charge fails. Recovery closes the loop."
        />
        <CardLink
          href="/architecture/overview"
          icon={Construction}
          title="Architecture"
          description="The stack, the module boundaries, the deliberate choices."
        />
        <CardLink
          href="/developer/webhooks"
          icon={Bell}
          title="Webhooks"
          description="The API ergonomics story, for the downstream developer reading this."
        />
      </CardGrid>
    </>
  );
}
