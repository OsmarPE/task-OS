import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

interface Props {
  className?: string;
}

export default function Loading({ className = "" }: Props) {
  return (
    <div className={cn("text-sm flex items-center gap-2 text-gray-700", className)}>
      <Loader width={16} height={16} className="animate-spin" /> Cargando...
    </div>
  );
}
