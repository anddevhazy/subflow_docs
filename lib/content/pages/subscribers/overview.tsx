import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import type { PageMeta } from "@/lib/content/types";
import { Repeat, Settings } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "For subscribers",
  title: "For subscribers",
  lede: "Request a link by email. View, pause, resume, cancel, reactivate, or switch plan yourself, no support ticket, no password.",
};

export default function SubscribersOverview() {
  return (
    <>
      <p>
        If you&apos;re paying for something on Subflow, this is the side built for you. There&apos;s no account to
        set up in advance, you don&apos;t need to remember a password, and you don&apos;t need to email the
        merchant to make a change you can make yourself.
      </p>

      <CardGrid cols={2}>
        <CardLink
          href="/subscribers/manage-your-subscription"
          icon={Settings}
          title="Manage your subscription"
          description="Request access, and everything you can do once you're in."
        />
        <CardLink
          href="/concepts/recovery-orchestration"
          icon={Repeat}
          title="When a payment fails"
          description="What happens the moment a charge doesn't go through, and how recovery reaches you today."
        />
      </CardGrid>

      <h2 id="h-start">Where to start</h2>
      <p>
        Ask your merchant for their portal link, or go to <code className="inline">/portal/login</code> on their
        dashboard domain and enter the email you subscribed with. See{" "}
        <a href="/subscribers/manage-your-subscription">Manage your subscription</a> for what happens next.
      </p>
    </>
  );
}
