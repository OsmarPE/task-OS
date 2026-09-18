"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
  open: boolean;
  pathname: string;
}

export default function Modal({ title, description, children, open, pathname }: Props) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={() => router.replace(pathname)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
