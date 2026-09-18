"use client";

import Link from "next/link";
import Container from "../Container";
import { Button } from "../ui/button";
import { ModeToggle } from "../mode-toggle";
import { Show, SignInButton, useAuth, UserButton } from "@clerk/nextjs";
import { ChevronRight } from "lucide-react";

export default function HeaderLanding() {
  const { userId } = useAuth();

  return (
    <header>
      <Container className="h-20 flex items-center justify-between">
        <Link href="/" className="uppercase tracking-[4px] text-xs md:text-sm">
          OS PROJECTS
        </Link>
        <div className="flex gap-3 md:gap-4">
          {userId && (
            <Button asChild variant={"link"}>
              <Link className="flex items-center md:gap-2 group/link" href="/main">
                Dashboard
                <ChevronRight className="transition-all duration-300 group-hover/link:translate-x-1" width={16} />
              </Link>
            </Button>
          )}
          <Show when="signed-out">
            <Button asChild>
              <SignInButton>Iniciar Sesión</SignInButton>
            </Button>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>

          <ModeToggle />
        </div>
      </Container>
    </header>
  );
}
