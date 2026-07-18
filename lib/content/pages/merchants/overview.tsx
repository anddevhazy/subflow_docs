import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import type { PageMeta } from "@/lib/content/types";
import { BarChart3, CreditCard, DoorOpen, FileText, Receipt, Wallet } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "For merchants",
  title: "For merchants",
  lede: "Stop building billing logic in-house. Plans, customers, invoices, dunning, and analytics, one API, one dashboard.",
};

export default function MerchantsOverview() {
  return (
    <>
      <p>
        Adaeze&apos;s first version of Lumen&apos;s billing was a cron job and a spreadsheet. It worked until it
        didn&apos;t, a card would fail silently, a member would want to pause instead of cancel and have no way to
        ask for that, and every month-end she&apos;d manually add up payments in a separate tab to guess at revenue.
        None of that is a Lumen-specific problem. It&apos;s what happens when recurring billing is treated as a
        feature instead of a system.
      </p>
      <p>Here&apos;s what you can actually do.</p>

      <CardGrid cols={2}>
        <CardLink
          href="/merchants/create-a-plan"
          icon={FileText}
          title="Create a plan"
          description="Name, price, interval, monthly, quarterly, yearly, or custom, with optional trial support."
        />
        <CardLink
          href="/merchants/onboard-and-collect-payment"
          icon={CreditCard}
          title="Onboard a customer"
          description="Tokenise a card once via Monnify Checkout. Charge it automatically on every billing cycle after."
        />
        <CardLink
          href="/merchants/billing-and-invoicing"
          icon={Receipt}
          title="Billing & invoicing"
          description="Invoices generate themselves on schedule. Proration on plan changes is a preview today, not yet a charge."
        />
        <CardLink
          href="/merchants/payments"
          icon={Wallet}
          title="Payments"
          description="Checkout sessions, charges, and payment attempts, the money-movement record behind every invoice."
        />
        <CardLink
          href="/merchants/payouts"
          icon={Wallet}
          title="Payouts"
          description="Set a bank account once. Every settled payment moves out to it automatically."
        />
        <CardLink
          href="/merchants/customer-portal/overview"
          icon={DoorOpen}
          title="Customer portal"
          description="Let subscribers view, pause, resume, cancel, and switch plans themselves, no support ticket required."
        />
        <CardLink
          href="/merchants/analytics"
          icon={BarChart3}
          title="Analytics"
          description="MRR, churn, recovery rate, and plan performance, computed on demand, always current."
        />
      </CardGrid>

      <h2 id="h-why">Why this works</h2>
      <p>
        <strong>One: the billing cycle runs itself.</strong> Invoices generate, charges fire, and outcomes write to
        the event store without you tapping anything, see <a href="/merchants/billing-and-invoicing">Billing &amp;
        invoicing</a>.
      </p>
      <p>
        <strong>Two: a failed payment isn&apos;t a lost customer by default.</strong> The moment a charge fails,
        three scheduled retries and a real-time notification, email always, plus a Twilio-backed WhatsApp or SMS
        send where a number&apos;s on file, run inside the grace period, not after someone happens to check a
        report. See <a href="/concepts/recovery-orchestration">Recovery orchestration</a> for exactly what&apos;s
        live today.
      </p>

      <h2 id="h-surfaces">Where you work</h2>
      <table>
        <tbody>
          <tr>
            <th>Surface</th>
            <th>What you do there</th>
          </tr>
          <tr>
            <td>
              <strong>Merchant dashboard</strong>
            </td>
            <td>Create plans, manage customers and subscriptions, watch analytics, configure webhooks, rotate API keys.</td>
          </tr>
          <tr>
            <td>
              <strong>API</strong>
            </td>
            <td>Everything the dashboard does, programmatically, for merchants embedding subscription management into their own product.</td>
          </tr>
          <tr>
            <td>
              <strong>Audit log</strong>
            </td>
            <td>Every material action, plan changes, API key rotation, webhook configuration, recorded and queryable.</td>
          </tr>
        </tbody>
      </table>
      <p className="body-secondary">
        One user per merchant account today, there&apos;s no invite flow or role tier yet, whoever has the login
        has full access.
      </p>

      <h2 id="h-start">Where to start</h2>
      <p>
        If you&apos;re new, start with <a href="/merchants/create-a-plan">Create a plan</a>. If you already have
        plans and want to know how money actually moves, go to{" "}
        <a href="/merchants/billing-and-invoicing">Billing & invoicing</a>.
      </p>
    </>
  );
}
