import { Callout } from "@/components/docs/content/callout";
import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import { Mermaid } from "@/components/docs/content/mermaid";
import { Steps, Step } from "@/components/docs/content/steps";
import type { PageMeta } from "@/lib/content/types";
import { Plug, Receipt } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "For merchants",
  title: "Payouts",
  lede: "Set a bank account once. Every settled payment moves out to it automatically, minus the platform's take rate, no manual withdrawal step.",
};

export default function MerchantsPayouts() {
  return (
    <>
      <p>
        A subscription platform that only collects money isn&apos;t finished, it
        also has to move that money to the merchant it belongs to. This one does
        that automatically: the moment a payment settles, a transfer to the
        merchant&apos;s bank account fires without anyone tapping anything.
      </p>

      <h2 id="h-setup">Setting up a payout account</h2>
      <Steps>
        <Step number={1} title="List supported banks">
          <p>
            <code className="inline">GET /merchants/banks</code>, sourced live
            from Monnify, not a hardcoded list on this side.
          </p>
        </Step>
        <Step number={2} title="Verify the account before saving it">
          <p>
            <code className="inline">POST /merchants/bank/lookup</code> with an
            account number and bank code, returns the account holder&apos;s name
            for confirmation, the same verification step a bank transfer app
            would run before you send money anywhere.
          </p>
        </Step>
        <Step number={3} title="Save it to your profile">
          <p>
            <code className="inline">PATCH /merchants/me</code> with{" "}
            <code className="inline">bankCode</code>,{" "}
            <code className="inline">bankName</code>,{" "}
            <code className="inline">bankAccountNumber</code>,{" "}
            <code className="inline">bankAccountName</code>. Also available from
            the dashboard&apos;s Payout Settings page.
          </p>
        </Step>
      </Steps>
      <p className="body-secondary">
        No bank account on file means no payout, not an error, just nothing
        happens on that side. A merchant can collect payments before setting one
        up; the money simply won&apos;t move out until they do.
      </p>

      <h2 id="h-flow">What happens on a successful payment</h2>
      <Mermaid
        chart={`sequenceDiagram
    participant N as Monnify
    participant API as Subflow API
    participant B as Merchant's bank

    N->>API: payment_success webhook
    API->>API: Mark payment succeeded, write invoice.paid event
    API->>API: Compute take-rate fee, write PaymentFeeAssessed
    API->>API: Create payout record (PENDING) for net amount
    API->>N: POST /v2/transfers/bank
    N-->>API: Immediate result
    API->>API: Set payout SUCCESS or FAILED
    N->>API: transfer.success / transfer.failed webhook (later)
    API->>API: Confirm final payout status`}
      />
      <p>
        A payout is only ever attempted once per payment, if bank details are
        missing at the moment a payment settles, that payment simply
        doesn&apos;t generate a payout retroactively when a bank account is
        added later.
      </p>

      <h2 id="h-fee">The platform fee</h2>
      <p>
        Every settled payment carries a take rate, deducted before the payout
        goes out. The merchant never sees a separate invoice for it, it&apos;s
        netted out of the transfer itself: <code className="inline">netAmount = grossAmount - feeAmount</code>.
      </p>
      <ul>
        <li>
          <strong>Rate is snapshotted at charge time, not payout time.</strong>{" "}
          Every charge stores its own <code className="inline">feeRateApplied</code>, copied from the merchant&apos;s
          current <code className="inline">feeRate</code> the moment the charge is created. A merchant&apos;s rate
          changing mid-cycle never reaches back into a charge that&apos;s already in flight, retries settle at
          whatever rate they were created under.
        </li>
        <li>
          <strong>Integer math, no floats.</strong> Amounts are stored and computed in kobo as integers.{" "}
          <code className="inline">feeAmount = floor(grossAmount * feeRateApplied / 10000)</code>, using basis
          points, not a decimal percentage, so the math reconciles to the kobo against a bank statement instead of
          drifting.
        </li>
        <li>
          <strong>A fee floor, not a silent zero.</strong> A minimum fee applies whenever the percentage would
          otherwise round below it, so a small charge doesn&apos;t quietly waive the fee by rounding accident.
        </li>
        <li>
          <strong>Assessed once, idempotently.</strong> <code className="inline">PaymentFeeAssessed</code> is
          keyed on the payment ID; a re-delivered Monnify webhook checks for an existing event before writing a new
          one. The fee is never charged twice off the same payment.
        </li>
        <li>
          <strong>Only assessed against a payout that actually happens.</strong> If bank details are missing and no
          transfer executes, no fee is assessed either, there&apos;s nothing to take a cut of.
        </li>
        <li>
          <strong>Refunds reverse the fee too.</strong> A refund after settlement writes{" "}
          <code className="inline">PaymentFeeReversed</code>, and the reversed amount nets against the merchant&apos;s
          next payout, or goes out as a standalone reversing transfer if none is coming.
        </li>
      </ul>
      <p className="body-secondary">
        <code className="inline">GET /payouts/:id</code> returns the full breakdown, <code className="inline">
          grossAmount
        </code>, <code className="inline">feeRateApplied</code>, <code className="inline">feeAmount</code>, and{" "}
        <code className="inline">netAmount</code>, the same numbers carried in the payout webhook payload, so a
        merchant&apos;s own reconciliation and their dashboard view are always reading the same record.
      </p>

      <Callout variant="note">
        <p>
          Like Checkout and Charge, the transfer call simulates a response when
          Monnify credentials aren&apos;t configured for an environment, a
          fabricated transfer reference rather than a failure. Worth ruling out
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
            <td>
              Confirmed by Monnify, by either the immediate response or the
              later webhook.
            </td>
          </tr>
          <tr>
            <td>
              <code className="inline">FAILED</code>
            </td>
            <td>
              The transfer didn&apos;t go through. A failure reason is recorded
              where Monnify provides one.
            </td>
          </tr>
        </tbody>
      </table>
      <p className="body-secondary">
        A <code className="inline">REFUNDED</code> status exists in the data
        model but isn&apos;t set by any code path today, treat it as reserved,
        not active.
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
