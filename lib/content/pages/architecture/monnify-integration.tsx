import { Callout } from "@/components/docs/content/callout";
import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import { Mermaid } from "@/components/docs/content/mermaid";
import type { PageMeta } from "@/lib/content/types";
import { CreditCard, Lock, Wallet } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Architecture",
  title: "Monnify integration",
  lede: "Token issuance, Checkout, Tokenised-card Charge, and Transfers. Money moves in through Charge and back out through Transfers, automatically.",
};

export default function MonnifyIntegration() {
  return (
    <>
      <p>
        Every naira that moves through this platform moves through Monnify. The{" "}
        <code className="inline">payments</code> module is the only place that talks to Monnify directly, nothing
        else in the codebase holds a Monnify credential or constructs a Monnify request.
      </p>

      <h2 id="h-surfaces">The four surfaces</h2>
      <table>
        <tbody>
          <tr>
            <th>Surface</th>
            <th>Used for</th>
          </tr>
          <tr>
            <td>
              <strong>Auth token issuance</strong>
            </td>
            <td>
              <code className="inline">POST /v1/auth/token/issue</code>, client-credentials exchange, cached for
              an hour with a five-minute refresh buffer.
            </td>
          </tr>
          <tr>
            <td>
              <strong>Checkout</strong>
            </td>
            <td>
              <code className="inline">POST /v1/checkout/order</code>. Initial card tokenisation at subscription
              signup, requested with <code className="inline">tokenizeCard: true</code>.
            </td>
          </tr>
          <tr>
            <td>
              <strong>Tokenised-card Charge</strong>
            </td>
            <td>
              <code className="inline">POST /v1/tokenized-card/charge</code>. Executes every billing-cycle charge
              attempt and every dunning retry against the stored card reference.
            </td>
          </tr>
          <tr>
            <td>
              <strong>Transfers</strong>
            </td>
            <td>
              <code className="inline">GET /v1/transfers/banks</code>, <code className="inline">POST /v1/transfers/bank/lookup</code>,
              and <code className="inline">POST /v2/transfers/bank</code>. Moves a settled payment out to a
              merchant&apos;s bank account, see <a href="/merchants/payouts">Payouts</a>.
            </td>
          </tr>
        </tbody>
      </table>

      <Callout variant="note">
        <p>
          If Monnify credentials aren&apos;t configured for an environment, Checkout, Charge, and the bank transfer
          call all simulate a response rather than failing outright, a fake checkout link, a charge outcome with
          roughly an 85% simulated success rate, or a fabricated transfer reference. Useful for demos and local
          development, worth ruling out first if money movement behaves oddly in a non-production environment.
        </p>
      </Callout>

      <h2 id="h-inbound">Inbound webhooks from Monnify</h2>
      <p>
        Monnify&apos;s own payment and transfer events land on <code className="inline">POST /webhooks/monnify</code>{" "}
        and trigger internal state transitions, a settled charge, a failed charge, a completed transfer, each of
        which is what actually writes the corresponding domain event to the{" "}
        <a href="/concepts/event-store">event store</a>. The billing engine doesn&apos;t guess at payment outcomes
        from a synchronous API response alone; it waits for and verifies the authoritative webhook. The handler
        recognises <code className="inline">payment_success</code>, <code className="inline">payment_failed</code>,{" "}
        <code className="inline">payment_reversal</code>, <code className="inline">transfer.success</code>, and{" "}
        <code className="inline">transfer.failed</code>. It also declares <code className="inline">payout_success</code>,{" "}
        <code className="inline">payout_failed</code>, and <code className="inline">payout_refund</code> as
        possible event types, but has no handler for them, they&apos;re logged as unhandled and dropped, typed
        for, not processed.
      </p>

      <h2 id="h-shape">The shape of a charge attempt</h2>
      <Mermaid
        chart={`flowchart LR
    A["Billing cycle fires"]:::accent --> B["Charge API call"] --> C["Monnify webhook confirms outcome"] --> D["Event written · subscription updated"]:::accent2

    classDef accent fill:#c9971f,stroke:#8a6416,color:#ffffff,font-weight:600;
    classDef accent2 fill:#1e9a5a,stroke:#166e42,color:#ffffff,font-weight:600;
`}
      />

      <h2 id="h-why-webhook">Why the webhook is authoritative, not the initial response</h2>
      <p>
        A synchronous response from a charge API can be pending, ambiguous, or lost to a network blip on the way
        back. Treating Monnify&apos;s webhook, signed, and independently verifiable, as the source of truth for
        whether a charge actually succeeded is what keeps the subscription state machine honest even when a
        request/response pair doesn&apos;t complete cleanly. The same discipline applies on the way out: a
        transfer&apos;s immediate response sets a payout to <code className="inline">PENDING</code> or{" "}
        <code className="inline">FAILED</code>, but <code className="inline">transfer.success</code>/
        <code className="inline">transfer.failed</code> webhooks are what actually confirm it later.
      </p>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={3}>
        <CardLink
          href="/merchants/onboard-and-collect-payment"
          icon={CreditCard}
          title="Onboard a customer"
          description="Checkout and tokenisation, from the merchant's side."
        />
        <CardLink
          href="/merchants/payouts"
          icon={Wallet}
          title="Payouts"
          description="How a settled payment automatically reaches a merchant's bank account."
        />
        <CardLink
          href="/security/data-protection"
          icon={Lock}
          title="Data & encryption posture"
          description="How stored payment references are protected."
        />
      </CardGrid>
    </>
  );
}
