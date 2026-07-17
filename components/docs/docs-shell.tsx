import type { ReactNode } from "react";
import { DocsHeader } from "@/components/docs/docs-header";
import { DocsSidebar } from "@/components/docs/docs-sidebar";

export function DocsShell({ children }: { children: ReactNode }) {
  return (
    <>
      <DocsHeader />
      <div className="mx-auto flex max-w-[1440px] pt-[106px]">
        <div className="sticky top-[106px] hidden h-[calc(100vh-106px)] w-[272px] shrink-0 border-r border-border bg-background min-[821px]:block">
          <DocsSidebar className="h-full" />
        </div>
        {children}
      </div>
    </>
  );
}
