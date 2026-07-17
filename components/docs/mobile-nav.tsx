"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { Button } from "@/components/ui/button";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="hidden max-[820px]:flex"
            aria-label="Toggle navigation"
          />
        }
      >
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b border-border">
          <SheetTitle>Subflow</SheetTitle>
        </SheetHeader>
        <DocsSidebar className="flex-1" onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
