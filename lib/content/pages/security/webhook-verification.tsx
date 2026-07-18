import { Callout } from "@/components/docs/content/callout";
import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import { CodeBlock } from "@/components/docs/code-block";
import { Steps, Step } from "@/components/docs/content/steps";
import type { PageMeta } from "@/lib/content/types";
import { Bell, CheckCircle2, Lock } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Security & trust",
  title: "Webhook signature verification",
  lede: "Every webhook is signed with HMAC-SHA256 over the raw body. Here's exactly how to verify one, and one gap worth knowing about.",
};

export default function WebhookVerification() {
  return (
    <>
      <p>
        Anyone who knows your webhook URL can POST to it. Signature verification is what lets you tell the
        difference between an event this platform actually sent and someone else&apos;s request pretending to be
        one.
      </p>

      <h2 id="h-headers">What arrives with every delivery</h2>
      <CodeBlock
        language="text"
        code={`x-signature: 5d9c8f3a1b7e2d4c6a0f8b3e...
x-timestamp: 1755168153000
x-event-type: payment.failed
Content-Type: application/json`}
      />

      <p>
        <code className="inline">x-signature</code> is the HMAC-SHA256 of the raw request body, hex-encoded, using
        your webhook&apos;s secret, the one shown once when you created the webhook. <code className="inline">x-timestamp</code>{" "}
        is a Unix millisecond timestamp attached to the request; <code className="inline">x-event-type</code>{" "}
        mirrors the <code className="inline">type</code> field already in the body.
      </p>

      <Callout variant="note">
        <p>
          Precision worth having: the signature covers the raw body only, <code className="inline">HMAC(body, secret)</code>,
          the timestamp is sent alongside it but isn&apos;t part of the signed material. That means checking{" "}
          <code className="inline">x-timestamp</code> against a window doesn&apos;t give you cryptographic replay
          protection the way it would if the timestamp were mixed into the signature. Dedupe on the event{" "}
          <code className="inline">id</code> in the body instead, see the checklist below, that&apos;s what
          actually protects you against a delivery being processed twice.
        </p>
      </Callout>

      <h2 id="h-verify">Verifying, step by step</h2>
      <Steps>
        <Step number={1} title="Read the raw body">
          <p>Before any JSON parsing. The signature is computed over the exact bytes sent, not a re-serialized copy.</p>
        </Step>
        <Step number={2} title="Compute the expected signature">
          <p>
            <code className="inline">HMAC_SHA256(secret, raw_body)</code>, hex-encoded.
          </p>
        </Step>
        <Step number={3} title="Compare in constant time">
          <p>
            <code className="inline">crypto.timingSafeEqual</code> in Node,{" "}
            <code className="inline">hmac.compare_digest</code> in Python. Never plain string equality, timing
            differences leak information an attacker can use.
          </p>
        </Step>
        <Step number={4} title="Process only on a match">
          <p>Otherwise return 401 and log the event for investigation.</p>
        </Step>
        <Step number={5} title="Dedupe on the event id">
          <p>
            Deliveries are at-least-once. Store the event <code className="inline">id</code> after successful
            processing; if you see it again, return 200 without reprocessing.
          </p>
        </Step>
      </Steps>

      <h2 id="h-node">Node.js</h2>
      <CodeBlock
        language="javascript"
        code={`const crypto = require('crypto');

function verify(rawBody, signatureHeader, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signatureHeader),
  );
}`}
      />

      <h2 id="h-python">Python</h2>
      <CodeBlock
        language="python"
        code={`import hmac, hashlib

def verify(raw_body, signature_header, secret):
    expected = hmac.new(
        secret.encode(), raw_body, hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(expected, signature_header)`}
      />

      <h2 id="h-checklist">Checklist</h2>
      <ul className="[&>li]:flex [&>li]:items-start [&>li]:gap-2 [&_svg]:mt-[3px] [&_svg]:shrink-0 [&_svg]:text-green-dark">
        <li>
          <CheckCircle2 className="size-4" strokeWidth={2} /> Verify the signature over the raw body on every
          request. Reject on mismatch.
        </li>
        <li>
          <CheckCircle2 className="size-4" strokeWidth={2} /> Dedupe using the event <code className="inline">id</code>,
          this is your actual replay protection, deliveries are at-least-once and the timestamp header alone
          doesn&apos;t prevent a resend.
        </li>
        <li>
          <CheckCircle2 className="size-4" strokeWidth={2} /> Return 2xx quickly. Push heavy processing to your own
          queue instead of doing it inline.
        </li>
        <li>
          <CheckCircle2 className="size-4" strokeWidth={2} /> Keep your webhook URL stable, update the subscription
          before changing DNS, not after.
        </li>
      </ul>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={2}>
        <CardLink
          href="/developer/webhooks"
          icon={Bell}
          title="Webhooks"
          description="Event types, payload shape, retry behaviour."
        />
        <CardLink
          href="/security/data-protection"
          icon={Lock}
          title="Data & encryption posture"
          description="What's encrypted at rest today, and what isn't yet."
        />
      </CardGrid>
    </>
  );
}
