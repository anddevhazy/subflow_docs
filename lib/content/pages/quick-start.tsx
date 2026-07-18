import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import { CodeBlock } from "@/components/docs/code-block";
import { Steps, Step } from "@/components/docs/content/steps";
import type { PageMeta } from "@/lib/content/types";
import { BarChart3, Bell, Compass, RefreshCw } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Get started",
  title: "Quick start",
  lede: "Five real API calls: create a key, a plan, a customer, a subscription, and a webhook. No fabricated shortcuts, no endpoints that don't exist.",
};

export default function QuickStart() {
  return (
    <>
      <p>
        Every call below hits the real API. Responses are wrapped in the standard envelope,{" "}
        <code className="inline">{"{ status, data, message }"}</code>, trimmed here to the parts that matter.
      </p>

      <Steps>
        <Step number={1} title="Sign in, then create a test API key">
          <CodeBlock
            code={`curl -X POST https://monnify-subscription-engine.onrender.com/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email": "founder@acme.ng", "password": "securePass123"}'

curl -X POST https://monnify-subscription-engine.onrender.com/api-keys \\
  -H "Authorization: Bearer <access_token>" \\
  -H "Content-Type: application/json" \\
  -d '{"environment": "test", "name": "Integration Key"}'`}
            language="bash"
          />
          <CodeBlock
            code={`{
  "status": "success",
  "data": {
    "apiKey": { "id": "k1e2y3i4-...", "prefix": "nsub_test_", "lastFour": "9c2e" },
    "rawKey": "nsub_test_7f3a9c2e1b8d4f6a0e5c3d2b1a9f8e7d6c5b4a3f"
  },
  "message": "Resource created successfully"
}`}
            language="json"
          />
          <p className="body-secondary">
            Save <code className="inline">rawKey</code> now, it&apos;s shown once. One caveat worth knowing before
            you build around it: issuing and rotating keys works today, but no endpoint currently authenticates a
            request with one, every call below still needs the JWT bearer token from login. See{" "}
            <a href="/developer/authentication">Authentication</a>.
          </p>
        </Step>

        <Step number={2} title="Create a plan">
          <CodeBlock
            code={`curl -X POST https://monnify-subscription-engine.onrender.com/plans \\
  -H "Authorization: Bearer <access_token>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Pro Plan",
    "amount": 15000,
    "currency": "NGN",
    "interval": "monthly",
    "trialDays": 14
  }'`}
            language="bash"
          />
          <p className="body-secondary">Amounts are major currency units, ₦15,000 is 15000, not kobo.</p>
        </Step>

        <Step number={3} title="Create a customer">
          <CodeBlock
            code={`curl -X POST https://monnify-subscription-engine.onrender.com/customers \\
  -H "Authorization: Bearer <access_token>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Chidi Nwosu",
    "email": "chidi@example.com",
    "phone": "+2348012345678"
  }'`}
            language="bash"
          />
        </Step>

        <Step number={4} title="Create a subscription and redirect to checkout">
          <CodeBlock
            code={`curl -X POST https://monnify-subscription-engine.onrender.com/subscriptions \\
  -H "Authorization: Bearer <access_token>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "customerId": "<customer id from step 3>",
    "planId": "<plan id from step 2>",
    "callbackUrl": "https://acme.ng/billing/callback"
  }'`}
            language="bash"
          />
          <CodeBlock
            code={`{
  "status": "success",
  "data": {
    "subscription": { "id": "s1u2b3s4-...", "status": "pending" },
    "checkoutUrl": "https://checkout.monnify.com/pay/abc123",
    "paymentId": "9a1b2c3d-...",
    "invoiceId": "i1n2v3o4-..."
  },
  "message": "Resource created successfully"
}`}
            language="json"
          />
          <p className="body-secondary">
            Redirect your customer to <code className="inline">checkoutUrl</code>. Monnify confirms the outcome by
            webhook, not by the checkout redirect alone, before the subscription moves to{" "}
            <code className="inline">trialing</code> or <code className="inline">active</code>. See{" "}
            <a href="/architecture/monnify-integration">Monnify integration</a>.
          </p>
        </Step>

        <Step number={5} title="Register a webhook and pull analytics">
          <CodeBlock
            code={`curl -X POST https://monnify-subscription-engine.onrender.com/webhooks \\
  -H "Authorization: Bearer <access_token>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://webhook.site/your-id",
    "events": ["invoice.paid", "payment.failed", "payment.recovered"]
  }'`}
            language="bash"
          />
          <p>Then pull your merchant analytics snapshot:</p>
          <CodeBlock
            code={`curl https://monnify-subscription-engine.onrender.com/analytics/metrics \\
  -H "Authorization: Bearer <access_token>"`}
            language="bash"
          />
          <p className="body-secondary">
            MRR, churn, and recovery rate, computed from the same event store your webhook just read from, rate
            fields are 0-100 percentages, not fractions.
          </p>
        </Step>
      </Steps>

      <h2 id="h-next">What&apos;s next</h2>
      <CardGrid cols={2}>
        <CardLink
          href="/how-it-works"
          icon={Compass}
          title="How it works"
          description="The full arc, end to end, with the reasoning behind each step."
        />
        <CardLink
          href="/concepts/subscription-lifecycle"
          icon={RefreshCw}
          title="Subscription lifecycle"
          description="All eight states, and what moves a subscription between them."
        />
        <CardLink
          href="/developer/webhooks"
          icon={Bell}
          title="Webhooks"
          description="Every event type, payload shape, and signature verification."
        />
        <CardLink
          href="/merchants/analytics"
          icon={BarChart3}
          title="Analytics"
          description="MRR, churn, recovery rate, and where each number comes from."
        />
      </CardGrid>
    </>
  );
}
