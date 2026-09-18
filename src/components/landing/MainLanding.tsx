"use client";

import { MoveRightIcon } from "lucide-react";
import Badge from "../Badge";
import Container from "../Container";
import { Button } from "../ui/button";
import HeaderLanding from "./HeaderLanding";
import Link from "next/link";
import { Show, SignInButton, useAuth } from "@clerk/nextjs";
import { useTheme } from "next-themes";

export default function MainLanding() {
  const { isSignedIn } = useAuth();
  const { resolvedTheme } = useTheme();

  const hero = resolvedTheme === "light" ? "/front-task.png" : "/front-task-dark.png";

  return (
    <div>
      <HeaderLanding />
      <main>
        <Container className="py-20 text-center">
          <Badge>
            Creado por Osmar Balam <MoveRightIcon width={16} height={16} />
          </Badge>
          <h1 className="mt-4 text-3xl sm:text-5xl xl:text-6xl font-bold text-balance">
            Gestiona y Organiza tus Proyectos y <span className="text-primary">Tareas facilmente!</span>
          </h1>
          <p className="mt-4 mb-6 max-w-3xl mx-auto text-gray-500 text-base md:text-lg leading-snug">
            Tome el control total de sus proyectos hoy mismo: comience a agregar tareas, ordenar sus prioridades y
            realizar un seguimiento del progreso con facilidad. Manténgase organizado y aumente su productividad sin
            esfuerzo
          </p>

          {isSignedIn ? (
            <Button asChild size={"lg"}>
              <Link href="/main">Ia al Dashboard</Link>
            </Button>
          ) : (
            <Show when="signed-out">
              <Button asChild size={"lg"}>
                <SignInButton>Unirse a nosotros</SignInButton>
              </Button>
            </Show>
          )}

          <figure className="max-w-4xl p-1 border border-primary/20 rounded-lg mx-auto mt-10 relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero} className="w-full object-cover" alt="" />
          </figure>
        </Container>
      </main>
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)]"></div>
    </div>
  );
}
