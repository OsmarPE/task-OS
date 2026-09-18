import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function Container({ children, className = "" }: Props) {
  return <div className={cn("max-w-[1200px] mx-auto w-[90%]", className)}>{children}</div>;
}
