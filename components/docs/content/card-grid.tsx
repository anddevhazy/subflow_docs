import type { ReactNode } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function CardGrid({
  cols,
  children,
}: {
  cols: 1 | 2 | 3;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mb-[22px] grid grid-cols-1 gap-3.5",
        cols === 2 && "sm:grid-cols-2",
        cols === 3 && "sm:grid-cols-3",
      )}
    >
      {children}
    </div>
  );
}

const cardBase =
  "rounded-xl border border-border bg-card px-5 py-[18px] text-[13.5px] leading-[1.55] text-text-secondary";
const cardIconBase = "mb-3 flex size-7 items-center justify-center text-gold-dark";
const cardTitleBase = "mb-1.5 text-[15.5px] font-semibold text-foreground";

export function CardLink({
  href,
  icon: Icon,
  title,
  description,
  external = false,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  external?: boolean;
}) {
  const className = cn(cardBase, "card", "hover:border-gold hover:shadow-[0_2px_12px_rgba(201,151,31,0.1)]");
  const content = (
    <>
      <div className={cardIconBase}>
        <Icon className="size-[18px]" strokeWidth={1.75} />
      </div>
      <div className={cardTitleBase}>{title}</div>
      <div>{description}</div>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

export function Card({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className={cardBase}>
      <div className={cardIconBase}>
        <Icon className="size-[18px]" strokeWidth={1.75} />
      </div>
      <div className={cardTitleBase}>{title}</div>
      <div className="[&>p]:mb-3 [&>p:last-child]:mb-0">{children}</div>
    </div>
  );
}
