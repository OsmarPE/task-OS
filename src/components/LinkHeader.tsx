"use client";

import { typeLink } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = typeLink;

export default function LinkHeader({ Icon, href, name }: Props) {
  const pathname = usePathname();
  const isActive = pathname === `/${href}`;

  return (
    <li>
      <Link
        className={cn(
          "flex gap-3 p-2 rounded-md hover:bg-primary/5 hover:text-primary/70 transition-all items-center duration-300 cursor-pointer",
          { "text-primary": isActive },
        )}
        href={`/${href}`}
      >
        <Icon width={22} height={22} />
        <span className="md:hidden">{name}</span>
      </Link>
    </li>
  );
}
