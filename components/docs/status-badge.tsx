import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { HttpMethod } from "@/lib/api-docs";

type StatusBadgeProps = {
  status: string;
  className?: string;
};

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  succeeded: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  delivered: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  trialing: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  past_due: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  grace_period: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  failed: "bg-red-500/10 text-red-600 dark:text-red-400",
  cancelled: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
  suspended: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
  expired: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
  dead_letter: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-mono text-[11px] uppercase tracking-wide",
        statusStyles[status] ?? "bg-muted text-muted-foreground",
        className,
      )}
    >
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

const methodStyles: Record<HttpMethod, string> = {
  GET: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  POST: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20",
  PATCH: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
  DELETE: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20",
};

type MethodBadgeProps = {
  method: HttpMethod;
  className?: string;
};

export function MethodBadge({ method, className }: MethodBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "min-w-[4.5rem] justify-center font-mono text-xs font-semibold",
        methodStyles[method],
        className,
      )}
    >
      {method}
    </Badge>
  );
}

type AuthBadgeProps = {
  auth: "public" | "jwt" | "hmac";
};

const authLabels = {
  public: { label: "Public", style: "bg-muted text-muted-foreground" },
  jwt: { label: "Bearer JWT", style: "bg-primary/10 text-primary-foreground dark:text-primary" },
  hmac: { label: "HMAC Signature", style: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
};

export function AuthBadge({ auth }: AuthBadgeProps) {
  const { label, style } = authLabels[auth];
  return (
    <Badge variant="outline" className={cn("text-xs", style)}>
      {label}
    </Badge>
  );
}