import { Callout } from "@/components/docs/content/callout";
import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import type { PageMeta } from "@/lib/content/types";
import { Check, Plug } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Security & trust",
  title: "Data & encryption posture",
  lede: "Passwords and secrets are hashed today. AES-256-GCM at rest exists as a utility, but isn't applied to any stored field yet.",
};

export default function DataProtection() {
  return (
    <>
      <p>
        This page exists to say plainly what&apos;s actually protecting stored data right now, not what the
        platform is capable of eventually protecting. The honest version is shorter than you might expect.
      </p>

      <h2 id="h-what">What&apos;s actually protected today</h2>
      <table>
        <tbody>
          <tr>
            <th>Data</th>
            <th>Protection</th>
          </tr>
          <tr>
            <td>Passwords</td>
            <td>bcrypt, 12 rounds. Never stored or logged in plaintext.</td>
          </tr>
          <tr>
            <td>API key secrets</td>
            <td>SHA-256 hashed. A lookup match, not a decrypt, the raw key is shown once and never stored.</td>
          </tr>
          <tr>
            <td>Refresh tokens &amp; password-reset tokens</td>
            <td>SHA-256 hashed at rest.</td>
          </tr>
        </tbody>
      </table>

      <Callout variant="note">
        <p>
          <strong>AES-256-GCM encryption exists in the codebase as a utility function, correctly implemented, with
          a random IV and an auth tag, but it isn&apos;t called anywhere on any stored field today.</strong> Stored
          payment references (Monnify tokens) and webhook secrets are not currently encrypted at rest, they&apos;re
          protected by the same access controls as the rest of the database, not by field-level encryption. If
          your integration assumed otherwise from an earlier read of this documentation, that assumption was
          wrong, and this is the correction. Wiring the existing utility to the fields it was built for is
          tracked work, not a documentation gap.
        </p>
      </Callout>

      <h2 id="h-what-not">What this platform doesn&apos;t attempt</h2>
      <p>
        This platform assumes customers are pre-verified via Monnify, it does not run its own KYC or
        identity-verification workflow, and doesn&apos;t hold BVN/NIN-grade identity data. What it stores is
        narrower and payments-specific: tokenised card references, not raw card numbers or identity documents. A
        full NDPR rights workflow also isn&apos;t implemented, that would be a deliberate addition, not something
        to assume is already covered.
      </p>

      <h2 id="h-transit">In transit</h2>
      <p>
        API traffic and dashboard sessions run over TLS. Raw card numbers never transit this platform&apos;s
        servers at all, they go directly from a customer&apos;s browser into Monnify&apos;s hosted Checkout session,
        tokenised before this system ever sees a reference to them, see{" "}
        <a href="/architecture/monnify-integration">Monnify integration</a>.
      </p>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={2}>
        <CardLink
          href="/security/webhook-verification"
          icon={Check}
          title="Webhook signature verification"
          description="The other half of the trust story, outbound, not at rest."
        />
        <CardLink
          href="/architecture/monnify-integration"
          icon={Plug}
          title="Monnify integration"
          description="Where the tokenised reference actually comes from."
        />
      </CardGrid>
    </>
  );
}
