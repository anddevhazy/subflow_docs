import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import type { PageMeta } from "@/lib/content/types";
import { Compass, MessageCircle } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Channels",
  title: "Email",
  lede: "The baseline channel. Every recovery sequence sends one, whether or not WhatsApp or SMS also fire.",
};

export default function ChannelsEmail() {
  return (
    <>
      <p>
        Email is the one channel that fires on every recovery attempt, no exceptions. WhatsApp depends on a
        subscriber having WhatsApp; SMS depends on a phone number that accepts text; USSD depends on the subscriber
        dialling in themselves. Email just needs the address a subscriber signed up with, which every subscriber
        has, because it&apos;s how checkout confirmations and receipts already reach them.
      </p>

      <h2 id="h-what">What arrives by email</h2>
      <p>The same failed-charge notice as the other channels, formatted for a longer read and a written record.</p>
      <blockquote>
        Subject: Your Lumen Monthly payment didn&apos;t go through
        <br />
        Your card was charged ₦15,000 for Lumen Monthly and the payment failed.
      </blockquote>
      <p>
        Today&apos;s email is a plain notice, not yet a set of actionable links. The single-use retry, pause, and
        cancel links described in <a href="/concepts/recovery-orchestration">Recovery orchestration</a> exist as a
        mechanism, but embedding them in this specific message is still open work. Until then, a subscriber acting
        on a failed charge does so through WhatsApp or USSD, or through a merchant acting on their behalf.
      </p>

      <h2 id="h-role">Why it&apos;s the baseline</h2>
      <p>
        Email is sent in parallel with WhatsApp and SMS on every recovery attempt, not as a fallback that only
        fires if the others fail. It needs nothing beyond the address a subscriber signed up with, and it&apos;s
        the one channel with no configuration dependency, no provider to simulate around if credentials are
        missing, no telco arrangement to wait on. A written, addressable record of every failed charge is useful
        on its own, even before the other channels catch up to it.
      </p>

      <h2 id="h-scope">What email is, and isn&apos;t, used for</h2>
      <p>
        Scoped to dunning, not general product communication. Plan changes a merchant makes, receipts, and
        marketing don&apos;t run through this pipeline; it only sends what a subscriber needs to know about a
        specific failed charge.
      </p>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={2}>
        <CardLink
          href="/channels/whatsapp"
          icon={MessageCircle}
          title="WhatsApp"
          description="The richest channel, when a phone's on file."
        />
        <CardLink
          href="/concepts/recovery-orchestration"
          icon={Compass}
          title="Recovery orchestration"
          description="How email fits alongside the other three channels."
        />
      </CardGrid>
    </>
  );
}
