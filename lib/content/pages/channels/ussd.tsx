import { Callout } from "@/components/docs/content/callout";
import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import { Mermaid } from "@/components/docs/content/mermaid";
import type { PageMeta } from "@/lib/content/types";
import { Compass } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Channels",
  title: "USSD",
  lede: "A session endpoint shaped for a telco short code. There's no telco behind it yet, so it doesn't reach a real handset today.",
};

export default function ChannelsUssd() {
  return (
    <>
      <p>
        USSD is meant to be the channel for a subscriber with no data connection at all, no app, no WhatsApp,
        nothing that needs a smartphone. The backend already speaks the request/response shape a USSD aggregator
        session expects, check status, pause, or cancel, over a short menu.
      </p>

      <Callout variant="note">
        <p>
          What&apos;s missing is the actual telco side: no short code is provisioned, no aggregator (an Africa&apos;s
          Talking-style integration, for instance) sits in front of it. Dialling anything today reaches nothing. The
          session endpoint is real and correctly shaped; it&apos;s waiting on the part of this that&apos;s a
          business arrangement, not an engineering task.
        </p>
      </Callout>

      <h2 id="h-menu">The menu, as built</h2>
      <Mermaid
        chart={`flowchart TD
    A["USSD session request"]:::accent --> B["1. Check status"]
    A --> C["2. Pause subscription"]
    A --> D["3. Cancel subscription"]

    classDef accent fill:#c9971f,stroke:#8a6416,color:#ffffff,font-weight:600;
`}
      />

      <table>
        <tbody>
          <tr>
            <th>Option</th>
            <th>What it shows or does</th>
          </tr>
          <tr>
            <td>
              <strong>1. Check status</strong>
            </td>
            <td>Current plan, price, and next billing date.</td>
          </tr>
          <tr>
            <td>
              <strong>2. Pause subscription</strong>
            </td>
            <td>Stops billing, resumable later.</td>
          </tr>
          <tr>
            <td>
              <strong>3. Cancel subscription</strong>
            </td>
            <td>Ends the subscription.</td>
          </tr>
        </tbody>
      </table>

      <h2 id="h-status">Status: session logic done, channel not live</h2>
      <p>
        This is the clearest example on this platform of a channel that&apos;s code-complete but not wired to
        anything real. Treat it as a preview of the interaction, not a working support channel, until a telco
        arrangement is actually in place.
      </p>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={2}>
        <CardLink
          href="/concepts/recovery-orchestration"
          icon={Compass}
          title="Recovery orchestration"
          description="What's live, what's simulated, across every channel."
        />
        <CardLink
          href="/channels/sms"
          icon={Compass}
          title="SMS"
          description="The other channel still waiting on inbound wiring."
        />
      </CardGrid>
    </>
  );
}
