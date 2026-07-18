import { Callout } from "@/components/docs/content/callout";
import { Card, CardGrid, CardLink } from "@/components/docs/content/card-grid";
import { Steps, Step } from "@/components/docs/content/steps";
import type { PageMeta } from "@/lib/content/types";
import { Ban, CheckCircle2, Mail, SlidersHorizontal, User } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Customer portal",
  title: "Customer portal",
  lede: "A magic-link email and a 24-hour session. View, pause, resume, cancel, reactivate, switch plan, update contact details. No card-on-file, no update-payment-method action.",
};

export default function CustomerPortalOverview() {
  return (
    <>
      <p>
        There&apos;s no login screen a subscriber types a password into, and no account they set up in advance.
        A subscriber requests access with just their email; if it matches a customer record on your account,
        they get a link.
      </p>

      <h2 id="h-flow">How a subscriber gets in</h2>
      <Steps>
        <Step number={1} title="They request a link">
          <p>
            <code className="inline">POST /portal/login</code> with <code className="inline">email</code> and
            your <code className="inline">merchantId</code>. The dashboard&apos;s portal-login page does this for
            them if you point them at it.
          </p>
        </Step>
        <Step number={2} title="An email arrives">
          <p>Real SMTP delivery, not simulated, with a link to the portal session.</p>
        </Step>
        <Step number={3} title="The session lasts 24 hours">
          <p>
            Reusable, not single-use, a subscriber can come back and take another action on the same link until
            it expires. This is a genuinely different primitive from the single-use retry/pause/cancel links
            dunning messages use, see <a href="/concepts/recovery-orchestration">Recovery orchestration</a>, those
            two systems run in parallel and don&apos;t share code.
          </p>
        </Step>
      </Steps>

      <h2 id="h-actions">What a subscriber can do</h2>
      <CardGrid cols={2}>
        <Card icon={CheckCircle2} title="View">
          Subscription status, current plan, billing dates, invoice history, and payment/transaction history.
        </Card>
        <Card icon={Ban} title="Pause, resume, cancel, reactivate">
          The same lifecycle actions available from the dashboard, taken directly against their own subscription.
        </Card>
        <Card icon={SlidersHorizontal} title="Switch plan">
          Move to a different active plan on your account.
        </Card>
        <Card icon={User} title="Update contact details">
          Name and phone. Not email, that stays the identity the portal login resolves against.
        </Card>
      </CardGrid>

      <Callout variant="note">
        <p>
          There&apos;s no update-payment-method action, and no card-on-file data anywhere in the system, the
          portal&apos;s payment-method display is static placeholder text, not a real card record. A subscriber
          whose card needs updating is currently handled outside the portal, by you re-running Checkout for them.
        </p>
      </Callout>

      <h2 id="h-enforcement">A gap worth knowing before you rely on it</h2>
      <p>
        The <code className="inline">POST /portal/session/action</code> endpoint doesn&apos;t check your{" "}
        <a href="/merchants/customer-portal/configure">portal configuration</a> before executing an action, the
        settings only control what the portal UI shows. Anyone holding a valid session token can call pause,
        cancel, or switch-plan directly regardless of what you&apos;ve toggled off. Treat the configuration
        options as UI preferences today, not access control.
      </p>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={2}>
        <CardLink
          href="/merchants/customer-portal/configure"
          icon={SlidersHorizontal}
          title="Configure the portal"
          description="Every toggle, what it's supposed to do, and a real bug in how it's wired today."
        />
        <CardLink
          href="/concepts/recovery-orchestration"
          icon={Mail}
          title="Recovery orchestration"
          description="The separate, single-use link system dunning messages actually use."
        />
      </CardGrid>
    </>
  );
}
