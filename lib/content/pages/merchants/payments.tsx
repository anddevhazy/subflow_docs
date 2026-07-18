import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import type { PageMeta } from "@/lib/content/types";
import { Plug, Receipt, RefreshCw } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "For merchants",
  title: "Payments",
  lede: "Checkout sessions, charges, and payment attempts, the money-movement record underneath every invoice.",
};

export default function MerchantsPayments() {
  return (
    <>
      <p>
        Invoices tell you what a customer owes. Payments tell you what actually happened when the platform tried to
        collect it, every checkout session, every charge attempt, and every outcome Monnify reported back, in one
        place on the dashboard.
      </p>

      <h2 id="h-what">What&apos;s on this page</h2>
      <table>
        <tbody>
          <tr>
            <th>View</th>
            <th>What it shows</th>
          </tr>
          <tr>
            <td>Stat cards</td>
            <td>Succeeded, pending, and failed counts, plus a total, for the current view.</td>
          </tr>
          <tr>
            <td>Payment table</td>
            <td>
              Payment id, linked invoice, amount, status, and attempt count, paginated. Opening a row shows full
              detail for that payment.
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="h-vs-invoices">Payments versus invoices</h2>
      <p>
        An invoice is generated on a billing-cycle boundary and represents what&apos;s owed, see{" "}
        <a href="/merchants/billing-and-invoicing">Billing &amp; invoicing</a>. A payment is the actual charge
        attempt against that invoice, and there can be more than one: a failed attempt followed by a successful
        retry both show up here, against the same invoice, in order. If a support conversation ever needs
        &quot;why does this look like two charges,&quot; this page has the answer, not a guess.
      </p>

      <h2 id="h-source">Where the data comes from</h2>
      <p>
        Every attempt is recorded win or lose, sourced from Monnify&apos;s Checkout and Tokenised-card Charge
        surfaces and confirmed by Monnify&apos;s inbound webhook, not inferred from a synchronous response alone. See{" "}
        <a href="/architecture/monnify-integration">Monnify integration</a> for exactly how that confirmation works.
      </p>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={3}>
        <CardLink
          href="/merchants/billing-and-invoicing"
          icon={Receipt}
          title="Billing & invoicing"
          description="Where an invoice comes from before a payment attempt exists."
        />
        <CardLink
          href="/architecture/monnify-integration"
          icon={Plug}
          title="Monnify integration"
          description="The three real surfaces behind every attempt on this page."
        />
        <CardLink
          href="/concepts/recovery-orchestration"
          icon={RefreshCw}
          title="Recovery orchestration"
          description="What happens after a failed attempt shows up here."
        />
      </CardGrid>
    </>
  );
}
