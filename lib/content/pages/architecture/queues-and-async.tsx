import { CardGrid, CardLink } from "@/components/docs/content/card-grid";
import { Step, Steps } from "@/components/docs/content/steps";
import type { PageMeta } from "@/lib/content/types";
import { Blocks, Compass } from "lucide-react";

export const meta: PageMeta = {
  eyebrow: "Architecture",
  title: "Queues & async processing",
  lede: "Dunning retries, webhook delivery, invoice generation. Why none of them happen inline on the request that triggered them.",
};

export default function QueuesAndAsync() {
  return (
    <>
      <p>
        Anything that involves a third party, Monnify, WhatsApp, SMS, email, a merchant&apos;s own webhook endpoint,
        runs on a queue, not inline on the request that triggered it. BullMQ, backed by Redis, is the mechanism for
        all of it.
      </p>

      <h2 id="h-what">What runs async</h2>
      <table>
        <tbody>
          <tr>
            <th>Job</th>
            <th>Why it&apos;s queued, not inline</th>
          </tr>
          <tr>
            <td>Webhook delivery</td>
            <td>
              A merchant&apos;s endpoint might be slow, down, or misconfigured. That should never hold open the
              request that created the underlying event.
            </td>
          </tr>
          <tr>
            <td>Dunning retries and recovery messages</td>
            <td>Scheduled on a grace-period timer, not fired synchronously from the failed charge itself.</td>
          </tr>
          <tr>
            <td>Invoice generation on a billing cycle</td>
            <td>Runs on a schedule, independent of any specific request.</td>
          </tr>
          <tr>
            <td>Email / WhatsApp / SMS / USSD notification delivery</td>
            <td>
              Third-party providers with their own latency and occasional outages, see{" "}
              <a href="/architecture/resilience">Resilience & scale</a>.
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="h-shape">The shape of a queued job</h2>
      <Steps>
        <Step number={1} title="A domain action enqueues a job">
          <p>
            E.g. a <code className="inline">PaymentFailed</code> event enqueues a recovery-orchestration job.
          </p>
        </Step>
        <Step number={2} title="A worker picks it up">
          <p>Independently of the original HTTP request, which has already returned.</p>
        </Step>
        <Step number={3} title="On failure, it retries with backoff">
          <p>
            Rather than being dropped, see the retry table on <a href="/developer/webhooks">Webhooks</a> for the
            shape this takes on the delivery side specifically.
          </p>
        </Step>
      </Steps>

      <h2 id="h-why-redis">Why BullMQ on Redis, not a heavier message broker</h2>
      <p>
        The job shapes here, retry a delivery, send a notification, generate an invoice on schedule, don&apos;t
        need the durability or fan-out guarantees of a dedicated broker. BullMQ on Redis covers every queue use
        case at this platform&apos;s scale with far less operational surface to run.
      </p>

      <h2 id="h-next">Next</h2>
      <CardGrid cols={2}>
        <CardLink
          href="/architecture/resilience"
          icon={Blocks}
          title="Resilience & scale"
          description="What happens when a queued job's target is unreachable."
        />
        <CardLink
          href="/concepts/recovery-orchestration"
          icon={Compass}
          title="Recovery orchestration"
          description="The specific job type this infrastructure was built to run reliably."
        />
      </CardGrid>
    </>
  );
}
