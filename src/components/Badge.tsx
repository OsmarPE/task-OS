import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Badge as BadgeUI } from "./ui/badge";

interface Props {
  className?: string;
  children: ReactNode;
  type?: "default" | "completed" | "incompleted";
}

export default function Badge({ className, children, type = "default" }: Props) {
  if (type === "default")
    return (
      <div
        className={cn(
          "relative inline-flex text-sm h-8 overflow-hidden rounded-full p-[1.5px] focus:outline-none select-none",
          className,
        )}
      >
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a9a9a9_0%,#0c0c0c_50%,#a9a9a9_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#171717_0%,#737373_50%,#171717_100%)]"></span>
        <span className="inline-flex gap-2 h-full w-full cursor-pointer items-center justify-center rounded-full bg-card text-card-foreground px-4 py-1 font-medium backdrop-blur-3xl">
          {children}
        </span>
      </div>
    );
  if (type === "completed")
    return (
      <BadgeUI variant="outline" className="bg-green-100 text-green-500 border-0 rounded-3xl py-1.5">
        Completado
      </BadgeUI>
    );
  if (type === "incompleted")
    return (
      <BadgeUI variant="outline" className="bg-red-100 text-red-500 border-0 rounded-3xl py-1.5">
        Incompletado
      </BadgeUI>
    );
}
