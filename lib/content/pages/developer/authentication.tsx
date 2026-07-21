import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import { CodeBlock } from "@/components/docs/code-block";
import { Steps, Step } from "@/components/docs/content/steps";
import type { PageMeta } from "@/lib/content/types";
import { Bell, Timer } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Developer",
  title: "Authentication",
  lede: "Live and test keys per merchant. Bearer auth, rotation, and what happens the moment a request lands.",
};

export default function DeveloperAuthentication() {
  return (
    <>
      <p>
        Authentication is a bearer token, scoped to a single merchant. Pass it in the{" "}
        <code className="inline">Authorization</code> header on every request:
      </p>

      <CodeBlock
        code={`curl https://subscription-billing-engine-t7ss.onrender.com/subscriptions \\
  -H "Authorization: Bearer nsub_live_3f1a9c2e8b4d7061..."`}
        language="bash"
      />

      <h2 id="h-format">Key format</h2>
      <table>
        <tbody>
          <tr>
            <th>Prefix</th>
            <th>Environment</th>
          </tr>
          <tr>
            <td>
              <code className="inline">nsub_test_&lt;48 hex chars&gt;</code>
            </td>
            <td>Test, no real charges ever fire.</td>
          </tr>
          <tr>
            <td>
              <code className="inline">nsub_live_&lt;48 hex chars&gt;</code>
            </td>
            <td>Production.</td>
          </tr>
        </tbody>
      </table>
      <p>
        Only the key&apos;s hash and last four characters are stored, the full secret is shown exactly once, at
        creation or rotation.
      </p>

      <h2 id="h-getting">Getting a key</h2>
      <p>Dashboard → API Keys. Create a key, pick Live or Test, copy the secret before you navigate away.</p>

      <h2 id="h-order">What happens when a request arrives</h2>
      <Steps>
        <Step number={1} title="Extract the bearer token">
          <p>Missing or malformed → 401.</p>
        </Step>
        <Step number={2} title="Hash and look up">
          <p>
            The key is stored as a SHA-256 hash, never the raw value. No match → 401.
          </p>
        </Step>
        <Step number={3} title="Rate limit">
          <p>
            A single global limit applies across the API, not a per-key allowance yet. See{" "}
            <a href="/developer/rate-limits">Rate limits</a>.
          </p>
        </Step>
        <Step number={4} title="Execute, scoped to your merchantId">
          <p>
            Every resource you can read or write is scoped to your own merchant account, tenant isolation is
            enforced at this layer, not just in application logic.
          </p>
        </Step>
      </Steps>

      <h2 id="h-rotate">Rotating a key</h2>
      <p>
        Generate a new key, roll it out to your services, confirm the old key&apos;s usage has dropped to zero, then
        revoke it. If a key leaks, revoke it immediately and generate a fresh one, there&apos;s no
        &quot;un-revoke.&quot;
      </p>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={2}>
        <CardLink
          href="/developer/webhooks"
          icon={Bell}
          title="Webhooks"
          description="What to subscribe to once you're authenticated."
        />
        <CardLink
          href="/developer/rate-limits"
          icon={Timer}
          title="Rate limits"
          description="The one global limit every request shares today."
        />
      </CardGrid>
    </>
  );
}
