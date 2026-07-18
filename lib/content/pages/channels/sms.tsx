import { Callout } from "@/components/docs/content/callout";
import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import type { PageMeta } from "@/lib/content/types";
import { Mail, Phone, Repeat } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Channels",
  title: "SMS",
  lede: "A real Twilio text on a failed charge. Replying to it doesn't do anything yet, there's no inbound receiver.",
};

export default function ChannelsSms() {
  return (
    <>
      <p>
        SMS sends via the same Twilio integration as WhatsApp, over a raw REST call, with the same simulated
        stand-in if Twilio credentials aren&apos;t configured. It reaches subscribers WhatsApp can&apos;t, and for
        some customer bases it&apos;s the more realistic default: not everyone has WhatsApp, but nearly everyone
        can receive a text. An <a href="/channels/email">email</a> with the same notice goes out in parallel
        regardless.
      </p>

      <h2 id="h-what">What arrives by SMS</h2>
      <blockquote>Subflow: payment of ₦15,000 failed.</blockquote>

      <Callout variant="note">
        <p>
          There&apos;s no inbound SMS receiver today, so a &quot;reply YES to retry&quot; prompt isn&apos;t
          accurate yet, an actual reply doesn&apos;t reach the system. Until that lands, SMS here is a one-way
          notice: it tells a subscriber something needs attention, but doesn&apos;t itself carry the fix.
        </p>
      </Callout>

      <h2 id="h-scope">What this channel is, and isn&apos;t, for</h2>
      <p>
        Scoped to dunning, a failed-charge notice and nothing else. A subscriber who needs to actually retry,
        pause, or cancel resolves that through <a href="/concepts/recovery-orchestration">the single-use links</a>{" "}
        wired into WhatsApp and USSD today, or through a merchant acting on their behalf, not through this
        channel directly.
      </p>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={3}>
        <CardLink
          href="/channels/email"
          icon={Mail}
          title="Email"
          description="The channel that fires no matter what happens here."
        />
        <CardLink
          href="/channels/ussd"
          icon={Phone}
          title="USSD"
          description="No data connection needed, still simulated end to end."
        />
        <CardLink
          href="/concepts/recovery-orchestration"
          icon={Repeat}
          title="Recovery orchestration"
          description="What's actually live versus simulated, across every channel."
        />
      </CardGrid>
    </>
  );
}
