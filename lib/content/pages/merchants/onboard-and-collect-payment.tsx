import { Callout } from "@/components/docs/content/callout";
import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import { CodeBlock } from "@/components/docs/code-block";
import { Steps, Step } from "@/components/docs/content/steps";
import type { PageMeta } from "@/lib/content/types";
import { Plug, Receipt } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "For merchants",
  title: "Onboard a customer",
  lede: "Tokenise a card once via Monnify Checkout. Charge it automatically on every billing cycle after.",
};

export default function OnboardAndCollectPayment() {
  return (
    <>
      <p>
        The point of tokenisation is that you ask a customer for their card exactly once. Everything after that, the
        first charge, the renewal three months later, a retry after a decline, reuses the same reference. Neither
        your servers nor the Subscription Engine&apos;s ever store or see the raw card number.
      </p>

      <h2 id="h-flow">How a customer gets tokenised</h2>
      <Steps>
        <Step number={1} title="Your app requests a Checkout session">
          <CodeBlock
            code={`curl -X POST https://subscription-billing-engine-t7ss.onrender.com/customers/cus_01.../checkout-session \\
  -H "Authorization: Bearer nsub_live_..." \\
  -d '{"planId": "plan_lumen_monthly"}'`}
            language="bash"
          />
        </Step>
        <Step number={2} title="The customer completes card entry inside Monnify's hosted Checkout">
          <p>Card number, expiry, CVV, entered directly into Monnify&apos;s session, never posted to your backend or ours.</p>
        </Step>
        <Step number={3} title="Monnify tokenises the card and returns a reference">
          <p>That token is what gets stored against the customer and reused for every future charge.</p>
        </Step>
        <Step number={4} title="The subscription activates">
          <p>
            Immediately if there&apos;s no trial; on the trial&apos;s end date otherwise. See{" "}
            <a href="/concepts/subscription-lifecycle">Subscription lifecycle</a>.
          </p>
        </Step>
      </Steps>

      <h2 id="h-recurring">Reusing the token</h2>
      <p>
        Every billing-cycle charge (<a href="/merchants/billing-and-invoicing">Billing & invoicing</a>) and every
        dunning retry (<a href="/concepts/recovery-orchestration">Recovery orchestration</a>) fires against the same
        stored token via Monnify&apos;s Charge API, the customer is never asked to re-enter their card unless the card
        itself changes.
      </p>

      <h2 id="h-update-card">When a card changes</h2>
      <p>
There&apos;s no subscriber-facing self-service flow for this specifically, the{" "}
        <a href="/merchants/customer-portal/overview">customer portal</a> has no update-payment-method action,
        there&apos;s no card-on-file concept anywhere in the system to update. A merchant re-runs Checkout for
        that customer from the dashboard&apos;s &quot;Open checkout&quot; action instead, which swaps the stored
        reference the same way the original onboarding did. The old token is discarded; nothing about the
        subscription&apos;s billing cycle or history changes.
      </p>

      <Callout variant="note">
        <p>
          A merchant can also onboard a customer from the dashboard directly, useful for migrating an existing
          customer base onto the platform, by sending them a hosted Checkout link instead of building the flow into
          your own app first.
        </p>
      </Callout>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={2}>
        <CardLink
          href="/merchants/billing-and-invoicing"
          icon={Receipt}
          title="Billing & invoicing"
          description="What happens on every cycle after onboarding."
        />
        <CardLink
          href="/architecture/monnify-integration"
          icon={Plug}
          title="Monnify integration"
          description="Checkout, Charge, and the token issuance surface underneath both."
        />
      </CardGrid>
    </>
  );
}
