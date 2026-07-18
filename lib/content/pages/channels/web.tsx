import { Card, CardGrid, CardLink } from "@/components/docs/content/card-grid";
import type { PageMeta } from "@/lib/content/types";
import { Activity, BookOpen, DoorOpen, Store } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Channels",
  title: "Web",
  lede: "The API and docs site, the merchant dashboard, and a customer portal, three applications, one API underneath.",
};

export default function ChannelsWeb() {
  return (
    <>
      <p>Everything on this platform is reachable through three applications, all sitting on top of the same API.</p>

      <h2 id="h-three">The three applications</h2>
      <CardGrid cols={3}>
        <Card icon={BookOpen} title="API & docs">
          This site, plus the interactive Swagger reference at <code className="inline">/docs</code> on the API
          itself. For developers integrating the platform into their own product.
        </Card>
        <Card icon={Store} title="Merchant dashboard">
          Plans, customers, subscriptions, invoices, payments, payouts, analytics, webhooks, API keys, and audit
          logs. Where a merchant runs the business day to day.
        </Card>
        <Card icon={DoorOpen} title="Customer portal">
          Where a subscriber views and manages their own subscription, reached by requesting a magic-link email,
          not a persistent login. See <a href="/merchants/customer-portal/overview">Customer portal</a>.
        </Card>
      </CardGrid>

      <h2 id="h-auth">Sign-in</h2>
      <table>
        <tbody>
          <tr>
            <th>App</th>
            <th>Auth</th>
          </tr>
          <tr>
            <td>Merchant dashboard</td>
            <td>
              Email + password, JWT access and refresh tokens, scoped to a merchant. One user per merchant today,
              there&apos;s no additional role tier yet.
            </td>
          </tr>
          <tr>
            <td>Customer portal</td>
            <td>
              No password. A subscriber requests a login link by email, scoped to a merchant, and gets a 24-hour
              session token in return, sent to that address, not returned directly to whoever asked for it.
            </td>
          </tr>
          <tr>
            <td>API</td>
            <td>
              Bearer key, scoped to a merchant. See <a href="/developer/authentication">Authentication</a>.
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="h-ops">Inside the dashboard: two operational surfaces worth knowing about</h2>
      <p>
        Beyond the day-to-day merchant pages, the dashboard also carries two engineering-facing views: a live
        event feed (<a href="/architecture/mission-control">Mission Control</a>) and an inbound-webhook debug
        console (<a href="/developer/service-info">Service info</a>). Neither is a separate application, both live
        behind the same dashboard login.
      </p>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={3}>
        <CardLink
          href="/merchants/overview"
          icon={Store}
          title="For merchants"
          description="What the dashboard actually does."
        />
        <CardLink
          href="/merchants/customer-portal/overview"
          icon={DoorOpen}
          title="Customer portal"
          description="What a subscriber can actually do, and one real bug worth knowing about."
        />
        <CardLink
          href="/architecture/mission-control"
          icon={Activity}
          title="Mission control"
          description="The live event feed underneath the dashboard's observability view."
        />
      </CardGrid>
    </>
  );
}
