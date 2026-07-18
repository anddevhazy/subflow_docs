import { Callout } from "@/components/docs/content/callout";
import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import { Mermaid } from "@/components/docs/content/mermaid";
import { Steps, Step } from "@/components/docs/content/steps";
import type { PageMeta } from "@/lib/content/types";
import { Plug, Receipt } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "For merchants",
  title: "Payouts",
  lede: "Set a bank account once. Every settled payment moves out to it automatically, no manual withdrawal step.",
};

export default function MerchantsPayouts() {
  return (
    <>
      <p>
        A subscription platform that only collects money isn&apos;t finished, it also has to move that money to
        the merchant it belongs to. This one does that automatically: the moment a payment settles, a transfer to
        the merchant&apos;s bank account fires without anyone tapping anything.
      </p>

      <h2 id="h-setup">Setting up a payout account</h2>
      <Steps>
        <Step number={1} title="List supported banks">
          <p>
            <code className="inline">GET /merchants/banks</code>, sourced live from Monnify, not a hardcoded list on
            this side.
          </p>
        </Step>
        <Step number={2} title="Verify the account before saving it">
          <p>
            <code className="inline">POST /merchants/bank/lookup</code> with an account number and bank code,
            returns the account holder&apos;s name for confirmation, the same verification step a bank transfer
            app would run before you send money anywhere.
          </p>
        </Step>
        <Step number={3} title="Save it to your profile">
          <p>
            <code className="inline">PATCH /merchants/me</code> with{" "}
            <code className="inline">bankCode</code>, <code className="inline">bankName</code>,{" "}
            <code className="inline">bankAccountNumber</code>, <code className="inline">bankAccountName</code>.
            Also available from the dashboard&apos;s Payout Settings page.
          </p>
        </Step>
      </Steps>
      <p className="body-secondary">
        No bank account on file means no payout, not an error, just nothing happens on that side. A merchant can
        collect payments before setting one up; the money simply won&apos;t move out until they do.
      </p>

      <h2 id="h-flow">What happens on a successful payment</h2>
      <Mermaid
        chart={`sequenceDiagram
    participant N as Monnify
    participant API as Subflow API
    participant B as Merchant's bank

    N->>API: payment_success webhook
    API->>API: Mark payment succeeded, write invoice.paid event
    API->>API: Create payout record (PENDING)
    API->>N: POST /v2/transfers/bank
    N-->>API: Immediate result
    API->>API: Set payout SUCCESS or FAILED
    N->>API: transfer.success / transfer.failed webhook (later)
    API->>API: Confirm final payout status`}
      />
      <p>
        The payout amount is the full settled payment, there&apos;s no visible platform-fee deduction in this
        build. A payout is only ever attempted once per payment, if bank details are missing at the moment a
        payment settles, that payment simply doesn&apos;t generate a payout retroactively when a bank account is
        added later.
      </p>

      <Callout variant="note">
        <p>
          Like Checkout and Charge, the transfer call simulates a response when Monnify credentials aren&apos;t
          configured for an environment, a fabricated transfer reference rather than a failure. Worth ruling out
          first if a payout looks stuck in a non-production environment.
        </p>
      </Callout>

      <h2 id="h-status">Payout status</h2>
      <table>
        <tbody>
          <tr>
            <th>Status</th>
            <th>Meaning</th>
          </tr>
          <tr>
            <td>
              <code className="inline">PENDING</code>
            </td>
            <td>Transfer initiated, outcome not yet confirmed.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">SUCCESS</code>
            </td>
            <td>Confirmed by Monnify, by either the immediate response or the later webhook.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">FAILED</code>
            </td>
            <td>The transfer didn&apos;t go through. A failure reason is recorded where Monnify provides one.</td>
          </tr>
        </tbody>
      </table>
      <p className="body-secondary">
        A <code className="inline">REFUNDED</code> status exists in the data model but isn&apos;t set by any code
        path today, treat it as reserved, not active.
      </p>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={2}>
        <CardLink
          href="/architecture/monnify-integration"
          icon={Plug}
          title="Monnify integration"
          description="The Transfers surface, alongside Checkout and Charge."
        />
        <CardLink
          href="/merchants/billing-and-invoicing"
          icon={Receipt}
          title="Billing & invoicing"
          description="Where the payment a payout is based on actually comes from."
        />
      </CardGrid>
    </>
  );
}
