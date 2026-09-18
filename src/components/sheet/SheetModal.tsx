"use client";

import { ReactNode } from "react";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle, Sheet } from "../ui/sheet";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  open: boolean;
  title: string;
  description: string;
  children: ReactNode;
}

export default function SheetModal({ open, description, title, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sheet open={open} onOpenChange={() => router.push(pathname)}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div>{children}</div>
      </SheetContent>
    </Sheet>
  );
}
