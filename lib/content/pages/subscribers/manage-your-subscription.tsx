import { Callout } from "@/components/docs/content/callout";
import { Card, CardGrid, CardLink } from "@/components/docs/content/card-grid";
import { Steps, Step } from "@/components/docs/content/steps";
import type { PageMeta } from "@/lib/content/types";
import { Ban, CheckCircle2, Mail, Repeat, SlidersHorizontal, User } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "For subscribers",
  title: "Manage your subscription",
  lede: "One email, one link, a 24-hour session. No password, and it doesn't touch the merchant's own dashboard login.",
};

export default function ManageYourSubscription() {
  return (
    <>
      <h2 id="h-access">Getting in</h2>
      <Steps>
        <Step number={1} title="Request a link">
          <p>Enter the email you subscribed with on the merchant&apos;s portal login page.</p>
        </Step>
        <Step number={2} title="Check your email">
          <p>A link arrives if that address matches a customer record with that merchant.</p>
        </Step>
        <Step number={3} title="You're in for 24 hours">
          <p>
            The same link works again if you come back later the same day, you don&apos;t need to request a new
            one for every action.
          </p>
        </Step>
      </Steps>

      <h2 id="h-actions">What you can do</h2>
      <CardGrid cols={2}>
        <Card icon={CheckCircle2} title="View your subscription">
          Current plan, price, billing dates, invoice history, and past payment attempts.
        </Card>
        <Card icon={Ban} title="Pause, resume, cancel, reactivate">
          Stop billing without cancelling, come back later, or end it outright and change your mind afterward if
          the merchant allows reactivation.
        </Card>
        <Card icon={SlidersHorizontal} title="Switch plan">
          Move to a different plan the merchant offers, where enabled.
        </Card>
        <Card icon={User} title="Update your name or phone">
          Not your email, that stays how the portal recognises you.
        </Card>
      </CardGrid>

      <Callout variant="note">
        <p>
          There&apos;s no way to update a payment method from the portal yet, this platform doesn&apos;t store
          card details on a subscription at all today. If your card needs updating, that currently happens
          through the merchant re-running checkout with you, not through the portal.
        </p>
      </Callout>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={2}>
        <CardLink
          href="/concepts/recovery-orchestration"
          icon={Repeat}
          title="When a payment fails"
          description="What actually happens today if a charge doesn't go through."
        />
        <CardLink
          href="/merchants/customer-portal/overview"
          icon={Mail}
          title="Customer portal, from the merchant's side"
          description="How your merchant sets this up, and one real bug worth knowing about."
        />
      </CardGrid>
    </>
  );
}
