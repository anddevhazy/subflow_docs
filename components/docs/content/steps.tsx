import type { ReactNode } from "react";

export function Steps({ children }: { children: ReactNode }) {
  return <div className="relative mb-6">{children}</div>;
}

export function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="relative flex gap-3.5 pb-[22px] last:pb-0 [&:last-child_.step-line]:hidden">
      <span className="step-line absolute top-7 bottom-0 left-[13px] w-px bg-border" />
      <div className="z-10 flex size-[26px] shrink-0 items-center justify-center rounded-full border border-border bg-muted text-[13px] font-semibold text-foreground">
        {number}
      </div>
      <div className="pt-0.5">
        <div className="mb-1 text-[15px] font-semibold">{title}</div>
        <div className="[&>p]:mb-0 [&>p]:text-[14.5px] [&>p]:text-text-secondary">
          {children}
        </div>
      </div>
    </div>
  );
}
