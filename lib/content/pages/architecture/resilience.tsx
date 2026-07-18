import { Card, CardGrid, CardLink } from "@/components/docs/content/card-grid";
import type { PageMeta } from "@/lib/content/types";
import { FolderOpen, KeySquare, Mailbox, NotebookText, Repeat, Shield } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Architecture",
  title: "Resilience & scale",
  lede: "Async by default, retried with backoff, degraded gracefully when WhatsApp, SMS, or email goes down for an hour.",
};

export default function Resilience() {
  return (
    <>
      <p>
        A billing platform earns trust on the day a third-party provider has a bad hour. This page is what happens
        on that day.
      </p>

      <h2 id="h-principle">The operating principle</h2>
      <p>
        Nothing in the recovery or notification path fails silently. If WhatsApp, SMS, or the email provider is
        unreachable, the affected jobs are queued and retried, not dropped, not swallowed into a log line nobody
        reads. A merchant should never lose a recovery attempt because a provider had an outage; the job comes back
        and tries again once the provider does.
      </p>

      <h2 id="h-layers">Where resilience lives</h2>
      <CardGrid cols={2}>
        <Card icon={Repeat} title="Retry with backoff">
          Every async job, webhook delivery, notification send, retries on failure rather than failing once and
          giving up.
        </Card>
        <Card icon={Mailbox} title="Dead-letter handling">
          A webhook delivery that exhausts its retry window moves to a dead-letter state, visible to the merchant
          and replayable once their endpoint is fixed.
        </Card>
        <Card icon={KeySquare} title="Idempotency, partial">
          Replayed webhooks carry the original event&apos;s id, so a receiver deduping on it is safe by
          construction. There&apos;s no <code className="inline">Idempotency-Key</code> support on write endpoints
          yet, see <a href="/developer/rate-limits">Rate limits</a>.
        </Card>
        <Card icon={NotebookText} title="The event store as ground truth">
          Even if a queue drains unexpectedly, the underlying facts are durable in the event store and can be
          re-dispatched.
        </Card>
      </CardGrid>

      <h2 id="h-degrade">Graceful degradation, concretely</h2>
      <table>
        <tbody>
          <tr>
            <th>Failure</th>
            <th>What happens</th>
          </tr>
          <tr>
            <td>WhatsApp or SMS provider (Twilio) unreachable, or not configured</td>
            <td>
              The send is simulated rather than failing the job outright, see{" "}
              <a href="/concepts/recovery-orchestration">Recovery orchestration</a>. Email has already reached the
              subscriber regardless, since it doesn&apos;t depend on Twilio at all.
            </td>
          </tr>
          <tr>
            <td>Email provider outage</td>
            <td>Notification jobs retry up to 3 times with backoff at the queue level, same as any other job.</td>
          </tr>
          <tr>
            <td>A merchant&apos;s webhook endpoint is down</td>
            <td>
              Deliveries retry on the schedule in <a href="/developer/webhooks">Webhooks</a>, five attempts over
              roughly four hours, then move to dead-letter, replayable, not lost.
            </td>
          </tr>
          <tr>
            <td>Monnify&apos;s API is briefly unreachable</td>
            <td>Charge attempts retry rather than being marked failed on a single transient error.</td>
          </tr>
        </tbody>
      </table>

      <h2 id="h-async-default">Why async-by-default is itself a resilience choice</h2>
      <p>
        Because nothing in the notification or webhook path runs inline on a request (see{" "}
        <a href="/architecture/queues-and-async">Queues & async processing</a>), a slow or failing third party
        degrades the async pipeline, not the API&apos;s response times for merchants and subscribers doing
        unrelated things at the same moment.
      </p>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={2}>
        <CardLink
          href="/architecture/queues-and-async"
          icon={FolderOpen}
          title="Queues & async processing"
          description="The mechanism underneath this page."
        />
        <CardLink
          href="/security/overview"
          icon={Shield}
          title="Security overview"
          description="The defence-in-depth posture alongside resilience."
        />
      </CardGrid>
    </>
  );
}
