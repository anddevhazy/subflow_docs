import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import { CodeBlock } from "@/components/docs/code-block";
import { Steps, Step } from "@/components/docs/content/steps";
import type { PageMeta } from "@/lib/content/types";
import { CreditCard, RefreshCw } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "For merchants",
  title: "Create a plan",
  lede: "Name, price, interval, trial. From an idea for a pricing tier to something a customer can subscribe to.",
};

export default function CreateAPlan() {
  return (
    <>
      <p>
        A plan is the thing a customer actually subscribes to. Everything downstream, the billing cycle, the invoice
        amount, the proration math on an upgrade, reads from the plan definition. Get this right once and the rest
        of the lifecycle takes care of itself.
      </p>

      <h2 id="h-fields">What a plan needs</h2>
      <table>
        <tbody>
          <tr>
            <th>Field</th>
            <th>What goes in</th>
          </tr>
          <tr>
            <td>
              <strong>Name</strong>
            </td>
            <td>
              &quot;Lumen Monthly,&quot; &quot;Pro Annual&quot;, whatever your customers will recognise on their
              statement.
            </td>
          </tr>
          <tr>
            <td>
              <strong>Price</strong>
            </td>
            <td>The amount charged per billing cycle. NGN today, the only settlement currency the dashboard offers.</td>
          </tr>
          <tr>
            <td>
              <strong>Interval</strong>
            </td>
            <td>Monthly, quarterly, yearly, or a custom interval you define.</td>
          </tr>
          <tr>
            <td>
              <strong>Trial period</strong>
            </td>
            <td>
              Optional. Days before the first charge fires. A subscription sits in{" "}
              <code className="inline">trialing</code> for this window.
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="h-create">Creating one</h2>
      <Steps>
        <Step number={1} title="Dashboard: Plans → New plan">
          <p>Fill in the fields above. Submit.</p>
        </Step>
        <Step number={2} title="Or via the API">
          <CodeBlock
            code={`curl -X POST https://subscription-billing-engine-t7ss.onrender.com/plans \\
  -H "Authorization: Bearer nsub_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Lumen Monthly",
    "amount": 15000,
    "currency": "NGN",
    "interval": "monthly",
    "trialDays": 7
  }'`}
            language="bash"
          />
        </Step>
        <Step number={3} title="It's live immediately">
          <p>Any customer you subscribe against this plan ID picks up these terms. No redeploy, no propagation delay.</p>
        </Step>
      </Steps>
      <p className="body-secondary">
        Amounts are in major currency units, naira, not kobo, so a ₦15,000 plan is <code className="inline">amount: 15000</code>.
      </p>

      <h2 id="h-update">Updating and retiring a plan</h2>
      <p>
        You can update a plan&apos;s name and description freely. Changing the price or interval on an existing plan
        does <strong>not</strong> retroactively change what active subscribers on that plan are charged, existing
        subscriptions keep their original terms until they&apos;re explicitly migrated to a new plan. This is
        intentional: silently changing what someone already agreed to pay is the kind of thing that should require
        an explicit action, not a side effect of an unrelated edit.
      </p>
      <p>
        Deactivating a plan stops new subscriptions from being created against it. Existing subscriptions on a
        deactivated plan continue to bill normally.
      </p>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={2}>
        <CardLink
          href="/merchants/onboard-and-collect-payment"
          icon={CreditCard}
          title="Onboard a customer"
          description="Subscribe someone to the plan you just created."
        />
        <CardLink
          href="/concepts/subscription-lifecycle"
          icon={RefreshCw}
          title="Subscription lifecycle"
          description="What state a subscription moves through after it's created."
        />
      </CardGrid>
    </>
  );
}
