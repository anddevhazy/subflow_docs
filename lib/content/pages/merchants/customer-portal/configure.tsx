import { Callout } from "@/components/docs/content/callout";
import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import type { PageMeta } from "@/lib/content/types";
import { DoorOpen, Plug } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Customer portal",
  title: "Configure the customer portal",
  lede: "Toggles for plan switching, cancellation, and what a subscriber can edit, saved from the dashboard's Settings page. One of them doesn't reach the live portal yet.",
};

export default function ConfigureCustomerPortal() {
  return (
    <>
      <p>
        Portal settings live on the merchant record itself, <code className="inline">customerPortalSettings</code>{" "}
        on <code className="inline">PATCH /merchants/me</code>, and the dashboard&apos;s Settings → Customer Portal
        page is the normal way to edit them. The options: whether a subscriber can switch plans, whether they can
        cancel, whether cancellation captures a reason, and which contact fields they can edit.
      </p>

      <Callout variant="note">
        <p>
          <strong>This is currently broken in a specific, narrow way, not a design choice.</strong> The dashboard
          saves settings nested under <code className="inline">test</code>/<code className="inline">live</code>{" "}
          keys, but the portal reads the settings object flat. In practice this means the plan-switching toggle
          and cancellation-reason capture don&apos;t take effect on a real subscriber&apos;s session today,
          regardless of what you save. View and pause/resume/cancel/reactivate aren&apos;t affected, those default
          to on either way. This is a real bug in the current build, not a documentation gap, fixing the read side
          to unwrap <code className="inline">test</code>/<code className="inline">live</code> (or the write side
          to stop nesting) resolves it.
        </p>
      </Callout>

      <h2 id="h-options">The options, as designed</h2>
      <table>
        <tbody>
          <tr>
            <th>Option</th>
            <th>What it&apos;s meant to do</th>
            <th>Actually reaches the live portal?</th>
          </tr>
          <tr>
            <td>Allow plan switching</td>
            <td>Show the plan-switch screen in the portal.</td>
            <td>No, see above.</td>
          </tr>
          <tr>
            <td>Allow cancellation</td>
            <td>Show a Cancel action at all.</td>
            <td>
              Effectively yes, defaults fail open when the setting isn&apos;t reachable.
            </td>
          </tr>
          <tr>
            <td>Collect a cancellation reason</td>
            <td>Prompt for a reason before cancelling completes.</td>
            <td>
              No, and even where the prompt renders, the selected reason isn&apos;t sent to the server today, the
              cancel action fires without it.
            </td>
          </tr>
          <tr>
            <td>Editable name / phone</td>
            <td>Let a subscriber update their own contact details.</td>
            <td>Yes, these default to on.</td>
          </tr>
          <tr>
            <td>Show invoice history</td>
            <td>Display past invoices in the portal.</td>
            <td>Yes, defaults to on.</td>
          </tr>
        </tbody>
      </table>

      <h2 id="h-server">Not enforced server-side, either way</h2>
      <p>
        Even once the nesting bug is fixed, these settings only ever controlled what the portal&apos;s UI shows.
        The action endpoint itself doesn&apos;t check them, see{" "}
        <a href="/merchants/customer-portal/overview">Customer portal</a>. Don&apos;t treat any of this as an
        access-control layer.
      </p>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={2}>
        <CardLink
          href="/merchants/customer-portal/overview"
          icon={DoorOpen}
          title="Customer portal overview"
          description="What a subscriber can actually do today."
        />
        <CardLink
          href="/architecture/monnify-integration"
          icon={Plug}
          title="Monnify integration"
          description="Where a subscriber's payment actually gets tokenised, since the portal doesn't handle that."
        />
      </CardGrid>
    </>
  );
}
