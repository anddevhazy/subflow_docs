import { Card, CardGrid, CardLink } from "@/components/docs/content/card-grid";
import type { PageMeta } from "@/lib/content/types";
import { Lock, NotebookText, Radio, RefreshCw } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Architecture",
  title: "Mission control",
  lede: "A live, per-merchant WebSocket feed of the same events that drive webhooks and analytics. Real, scoped, and running today.",
};

export default function MissionControl() {
  return (
    <>
      <p>
        Every domain event written to the <a href="/concepts/event-store">event store</a> is also broadcast in
        real time over a Socket.IO gateway, one more consumer alongside webhooks, dunning, and analytics, just
        watching instead of acting. It surfaces inside the merchant dashboard as a live timeline, useful for
        watching a subscription move through its lifecycle as it happens, rather than refreshing a list view.
      </p>

      <h2 id="h-connect">Connecting</h2>
      <p>
        The gateway runs on the <code className="inline">/mission-control</code> namespace. A client authenticates
        by passing a JWT access token, either in the Socket.IO handshake&apos;s <code className="inline">auth</code>{" "}
        payload or as a bearer <code className="inline">Authorization</code> header, the same access token issued
        by dashboard login, see <a href="/developer/authentication">Authentication</a>. A missing or invalid token,
        or a token with no <code className="inline">merchantId</code> claim, disconnects the socket immediately.
      </p>

      <h2 id="h-scoped">Scoped per merchant, not global</h2>
      <Card icon={Lock} title="One room per merchant">
        On a successful connection, a client joins a room keyed to its own <code className="inline">merchantId</code>.
        Events are broadcast to that room only, there&apos;s no cross-merchant visibility, and no way to subscribe
        to another merchant&apos;s stream even by guessing an id.
      </Card>

      <h2 id="h-event">What&apos;s actually broadcast</h2>
      <p>
        A single socket event, named <code className="inline">event</code>, carries the same timeline-event shape
        the REST history endpoint returns, event type, payload, and timestamp. There&apos;s no separate schema to
        learn beyond what already flows through <a href="/developer/webhooks">Webhooks</a>, this is the same
        stream, just pushed instead of polled.
      </p>

      <h2 id="h-not">What this isn&apos;t</h2>
      <p>
        Mission Control is an observability surface, not a control plane, watching this feed doesn&apos;t let you
        act on an event, and it isn&apos;t a substitute for subscribing to webhooks in your own backend. In the
        dashboard, it sits alongside a chaos-testing panel used for staging and QA, fault injection isn&apos;t
        available in production and isn&apos;t part of the public API this documentation covers.
      </p>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={3}>
        <CardLink
          href="/concepts/event-store"
          icon={NotebookText}
          title="The event store"
          description="The source this feed is broadcasting from."
        />
        <CardLink
          href="/developer/webhooks"
          icon={RefreshCw}
          title="Webhooks"
          description="The same events, delivered to your own backend instead."
        />
        <CardLink
          href="/developer/service-info"
          icon={Radio}
          title="Service info"
          description="A different kind of live debugging: the inbound Monnify leg."
        />
      </CardGrid>
    </>
  );
}
