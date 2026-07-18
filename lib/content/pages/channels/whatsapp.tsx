import { Callout } from "@/components/docs/content/callout";
import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import type { PageMeta } from "@/lib/content/types";
import { Mail, Repeat, Smartphone } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Channels",
  title: "WhatsApp",
  lede: "A real Twilio send on every failed charge, with a simulated stand-in if Twilio isn't configured. Inbound taps aren't wired yet.",
};

export default function ChannelsWhatsapp() {
  return (
    <>
      <p>
        WhatsApp sends go out via a direct call to Twilio&apos;s REST API on every recovery attempt where a number
        is on file, in parallel with the email that always fires regardless, see <a href="/channels/email">Email</a>.
      </p>

      <Callout variant="note">
        <p>
          If Twilio credentials aren&apos;t configured for an environment, the send is simulated rather than
          silently failing, the request looks and logs like a real Twilio call, but nothing reaches a phone. Worth
          checking before assuming a message was actually delivered in a given environment.
        </p>
      </Callout>

      <h2 id="h-what">What arrives on WhatsApp</h2>
      <p>A failed-charge notice.</p>
      <blockquote>Your payment of ₦15,000 didn&apos;t go through.</blockquote>

      <h2 id="h-links">Acting on it</h2>
      <p>
        Recovery resolves through the same single-use links covered in{" "}
        <a href="/concepts/recovery-orchestration">Recovery orchestration</a>: retry, pause, or cancel. There&apos;s
        no downgrade action today, so a message offering that isn&apos;t accurate to what the platform can actually
        do yet.
      </p>

      <h2 id="h-inbound">Tapping a button on a real message</h2>
      <p>
        This is the part that isn&apos;t wired up: a subscriber tapping an inline button on an actual WhatsApp
        message doesn&apos;t reach this system today. An inbound endpoint exists in roughly the shape a real
        WhatsApp Business API webhook would need, but it isn&apos;t connected to Twilio&apos;s actual webhook
        format yet. Until that lands, a WhatsApp recovery message is a one-way notice, the subscriber&apos;s next
        step happens elsewhere, not by tapping the message itself.
      </p>

      <h2 id="h-scope">What this channel is, and isn&apos;t, for</h2>
      <p>
        Scoped to dunning, a failed-charge notice and nothing else. Not a general-purpose interface for plans,
        team management, or analytics, those live on the merchant dashboard.
      </p>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={3}>
        <CardLink
          href="/channels/sms"
          icon={Smartphone}
          title="SMS"
          description="The other Twilio-backed channel, same caveats."
        />
        <CardLink
          href="/channels/email"
          icon={Mail}
          title="Email"
          description="The one channel with nothing simulated about it."
        />
        <CardLink
          href="/concepts/recovery-orchestration"
          icon={Repeat}
          title="Recovery orchestration"
          description="What's live, what's simulated, across every channel."
        />
      </CardGrid>
    </>
  );
}
