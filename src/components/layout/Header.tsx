"use client";

import { useShowMenu } from "@/hooks/useShowMenu";
import { cn } from "@/lib/utils";
import { typeLink } from "@/types";
import { DashboardIcon } from "@radix-ui/react-icons";
import { BoxIcon, SettingsIcon, Waypoints, X } from "lucide-react";
import { usePathname } from "next/navigation";
import LinkHeader from "../LinkHeader";
import ButtonLogOut from "../buttons/ButtonLogOut";
import { useEffect } from "react";

const links: typeLink[] = [
  {
    href: "main/projects",
    Icon: DashboardIcon,
    name: "Proyectos",
  },
  {
    href: "main/list",
    Icon: BoxIcon,
    name: "Lista de Tareas",
  },
  {
    href: "main/graph",
    Icon: Waypoints,
    name: "Grafo",
  },
  {
    href: "main/settings",
    Icon: SettingsIcon,
    name: "Configuración",
  },
  {
    href: "logout",
    Icon: BoxIcon,
    name: "Cerrar Sesión",
  },
];

export default function Header() {
  const pathname = usePathname();

  const { showMenu, toggleMenu } = useShowMenu();

  useEffect(() => {
    if (showMenu) {
      toggleMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <div
        onClick={toggleMenu}
        className={cn("fixed inset-0 md:hidden transition-all", {
          "bg-black/0 pointer-events-none backdrop-blur-0": !showMenu,
          "bg-black/10 pointer-events-auto backdrop-blur-sm z-0": showMenu,
        })}
      ></div>
      <aside
        role="menu"
        className={cn(
          "fixed md:static z-20 transition-all p-6 md:p-0 bottom-0 left-0 right-0 h-auto md:h-dvh bg-background md:flex md:items-center md:justify-center md:border-r md:border-secondary md:translate-y-0",
          { "translate-y-full": !showMenu, "translate-y-0": showMenu },
        )}
      >
        <button
          onClick={toggleMenu}
          className="mb-2 ml-auto block md:hidden p-2 text-gray-400 hover:text-black"
        >
          <X width={22} className="transition" />
        </button>
        <nav>
          <ul className="grid gap-2 text-gray-300">
            {links.map(({ Icon, href, name }, index) =>
              href !== "logout" ? (
                <LinkHeader key={index} Icon={Icon} href={href} name={name} />
              ) : (
                <li key={index}>
                  <ButtonLogOut />
                </li>
              ),
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
}
