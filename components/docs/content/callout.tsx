import type { ReactNode } from "react";
import { Info, Lightbulb, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutProps = {
  variant: "note" | "tip";
  icon?: LucideIcon;
  children: ReactNode;
};

const defaultIcon: Record<CalloutProps["variant"], LucideIcon> = {
  note: Info,
  tip: Lightbulb,
};

const variantClasses: Record<CalloutProps["variant"], string> = {
  note: "border-blue/25 bg-blue-light text-blue-dark",
  tip: "border-green/25 bg-green-light text-green-dark",
};

export function Callout({ variant, icon, children }: CalloutProps) {
  const Icon = icon ?? defaultIcon[variant];
  return (
    <div
      className={cn(
        "mb-5 flex gap-2.5 rounded-[10px] border p-[14px_16px] text-[14.5px]",
        "[&>p]:m-0 [&>p+p]:mt-2 [&_strong]:text-inherit",
        variantClasses[variant],
      )}
    >
      <div className="shrink-0">
        <Icon className="size-[18px]" strokeWidth={2} />
      </div>
      {children}
    </div>
  );
}
