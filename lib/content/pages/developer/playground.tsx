"use client";

import { useState } from "react";
import { Callout } from "@/components/docs/content/callout";
import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import { CodeBlock } from "@/components/docs/code-block";
import { StatusBadge } from "@/components/docs/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { webhookEvents } from "@/lib/api-docs";
import { API_BASE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { PageMeta } from "@/lib/content/types";
import { Bell, KeyRound, Timer } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Developer",
  title: "Playground",
  lede: "Code samples in four languages, five payment scenarios with the exact webhook they produce, and the full event catalog. No live requests fire from this page.",
};

type Scenario = {
  id: string;
  title: string;
  description: string;
  status: string;
  webhookType: string;
  payload: object;
};

const scenarios: Scenario[] = [
  {
    id: "success",
    title: "Successful payment",
    description: "Customer completes checkout. Subscription activates, invoice marked paid.",
    status: "active",
    webhookType: "invoice.paid",
    payload: {
      id: "evt_success",
      type: "invoice.paid",
      data: {
        invoice: { id: "inv_001", status: "paid", total: "15000.00", currency: "NGN" },
        payment: { id: "9a1b2c3d-...", status: "succeeded", monnifyTransactionId: "TXN-MONNIFY-001234" },
        subscription: { id: "sub_001", status: "active" },
      },
      createdAt: "2026-07-01T10:30:00.000Z",
    },
  },
  {
    id: "insufficient",
    title: "Insufficient funds",
    description: "The first charge attempt fails. Subscription moves to past_due, retry scheduled 24 hours out.",
    status: "past_due",
    webhookType: "payment.failed",
    payload: {
      id: "evt_failed",
      type: "payment.failed",
      data: {
        payment: { id: "9b2c3d4e-...", status: "failed", failureReason: "Insufficient funds" },
        invoice: { id: "inv_002", status: "failed", total: "15000.00" },
      },
      createdAt: "2026-08-01T00:10:00.000Z",
    },
  },
  {
    id: "grace",
    title: "Second attempt also fails",
    description: "24 hours later, the retry fails too. Subscription moves to grace_period, next retry 7 days out.",
    status: "grace_period",
    webhookType: "payment.failed",
    payload: {
      id: "evt_expired",
      type: "payment.failed",
      data: {
        payment: { id: "9b2c3d4e-...", status: "failed", failureReason: "Card expired" },
        invoice: { id: "inv_002", status: "failed", total: "15000.00" },
      },
      createdAt: "2026-08-02T00:10:00.000Z",
    },
  },
  {
    id: "recovered",
    title: "Payment recovered",
    description: "A retried charge succeeds, automatically or via a redeemed recovery link. Subscription restored.",
    status: "active",
    webhookType: "payment.recovered",
    payload: {
      id: "evt_recovered",
      type: "payment.recovered",
      data: {
        payment: { id: "9b2c3d4e-...", status: "succeeded", monnifyTransactionId: "TXN-MONNIFY-005678" },
        invoice: { id: "inv_002", status: "paid", total: "15000.00" },
      },
      createdAt: "2026-08-03T14:00:00.000Z",
    },
  },
  {
    id: "cancelled",
    title: "Subscription cancelled",
    description: "Cancelled via the API or dashboard. No further billing.",
    status: "cancelled",
    webhookType: "subscription.cancelled",
    payload: {
      id: "evt_cancelled",
      type: "subscription.cancelled",
      data: {
        subscription: { id: "sub_001", status: "cancelled", cancelledAt: "2026-07-20T12:00:00.000Z" },
      },
      createdAt: "2026-07-20T12:00:00.000Z",
    },
  },
];

const curlExample = `curl -X POST "${API_BASE_URL}/subscriptions" \\
  -H "Authorization: Bearer <access_token>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "customerId": "c1u2s3t4-d5e6-7890-cust-123456789abc",
    "planId": "p1l2a3n4-d5e6-7890-plan-123456789abc",
    "callbackUrl": "https://acme.ng/billing/callback"
  }'`;

const nodeExample = `const axios = require("axios");

const client = axios.create({
  baseURL: "${API_BASE_URL}",
  headers: {
    Authorization: "Bearer " + process.env.SUBFLOW_ACCESS_TOKEN,
    "Content-Type": "application/json",
  },
});

async function createSubscription() {
  const { data } = await client.post("/subscriptions", {
    customerId: "c1u2s3t4-d5e6-7890-cust-123456789abc",
    planId: "p1l2a3n4-d5e6-7890-plan-123456789abc",
    callbackUrl: "https://acme.ng/billing/callback",
  });
  console.log(data.data.checkoutUrl);
}`;

const pythonExample = `import requests

BASE_URL = "${API_BASE_URL}"
headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json",
}

response = requests.post(
    f"{BASE_URL}/subscriptions",
    headers=headers,
    json={
        "customerId": "c1u2s3t4-d5e6-7890-cust-123456789abc",
        "planId": "p1l2a3n4-d5e6-7890-plan-123456789abc",
        "callbackUrl": "https://acme.ng/billing/callback",
    },
)
print(response.json()["data"]["checkoutUrl"])`;

const phpExample = `<?php
$ch = curl_init("${API_BASE_URL}/subscriptions");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer " . $accessToken,
        "Content-Type: application/json",
    ],
    CURLOPT_POSTFIELDS => json_encode([
        "customerId" => "c1u2s3t4-d5e6-7890-cust-123456789abc",
        "planId" => "p1l2a3n4-d5e6-7890-plan-123456789abc",
        "callbackUrl" => "https://acme.ng/billing/callback",
    ]),
]);
$response = curl_exec($ch);
$data = json_decode($response, true);
echo $data["data"]["checkoutUrl"];`;

type CodeTab = "curl" | "node" | "python" | "php";

export default function Playground() {
  const [activeScenario, setActiveScenario] = useState(scenarios[0].id);
  const [codeTab, setCodeTab] = useState<CodeTab>("curl");

  const scenario = scenarios.find((s) => s.id === activeScenario) ?? scenarios[0];

  const codeExamples: Record<CodeTab, string> = {
    curl: curlExample,
    node: nodeExample,
    python: pythonExample,
    php: phpExample,
  };

  return (
    <>
      <p>
        Everything on this page is static, no request actually leaves your browser. It exists to show request
        shapes in the language you&apos;re integrating in, and the exact webhook payload a given outcome produces,
        without you having to run the calls yourself first.
      </p>

      <Callout variant="note">
        <p>
          Every example authenticates with a JWT bearer token, not an API key. Issuing and rotating API keys works
          today, but no endpoint currently accepts one for authentication, see{" "}
          <a href="/developer/authentication">Authentication</a>.
        </p>
      </Callout>

      <h2 id="h-examples">Create a subscription, in four languages</h2>
      <div className="mb-3.5 flex flex-wrap gap-2">
        {(["curl", "node", "python", "php"] as CodeTab[]).map((tab) => (
          <Button
            key={tab}
            variant={codeTab === tab ? "default" : "outline"}
            size="sm"
            onClick={() => setCodeTab(tab)}
          >
            {tab === "curl" ? "cURL" : tab === "node" ? "Node.js" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>
      <CodeBlock
        code={codeExamples[codeTab]}
        language={codeTab === "curl" ? "bash" : codeTab === "node" ? "javascript" : codeTab}
      />

      <h2 id="h-scenarios">Payment scenarios</h2>
      <p>
        Select a scenario to see the subscription status it produces and the exact webhook payload your handler
        would receive. The second and third scenarios are deliberately separate, see{" "}
        <a href="/concepts/recovery-orchestration">Recovery orchestration</a> for why the second failed attempt,
        not the first, is what actually opens the grace period.
      </p>
      <div className="mb-3.5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveScenario(s.id)}
            className={cn(
              "cursor-pointer rounded-xl border border-border p-4 text-left transition-all hover:shadow-sm",
              activeScenario === s.id
                ? "border-gold bg-gold/5 ring-1 ring-gold/20"
                : "hover:border-foreground/20",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13.5px] font-semibold">{s.title}</span>
              <StatusBadge status={s.status} />
            </div>
            <p className="mt-2 text-[12.5px] text-text-muted">{s.description}</p>
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Webhook: {scenario.webhookType}</CardTitle>
            <StatusBadge status={scenario.status} />
          </div>
          <CardDescription>{scenario.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock code={JSON.stringify(scenario.payload, null, 2)} language="json" title="Outbound webhook payload" />
        </CardContent>
      </Card>

      <h2 id="h-catalog">Webhook event catalog</h2>
      <p>The complete set of events this platform dispatches, all seven of them.</p>
      <div className="space-y-4">
        {webhookEvents.map((event) => (
          <Card key={event.type}>
            <CardHeader>
              <code className="inline w-fit">{event.type}</code>
              <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={JSON.stringify(event.payload, null, 2)} language="json" />
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={3}>
        <CardLink
          href="/developer/authentication"
          icon={KeyRound}
          title="Authentication"
          description="Why every example above uses a JWT, not an API key."
        />
        <CardLink
          href="/developer/webhooks"
          icon={Bell}
          title="Webhooks"
          description="Delivery, retry, dead-letter, and replay, in full."
        />
        <CardLink
          href="/developer/rate-limits"
          icon={Timer}
          title="Rate limits"
          description="The one global limit every request in this playground would share."
        />
      </CardGrid>
    </>
  );
}
