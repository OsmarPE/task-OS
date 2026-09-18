import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Library } from "lucide-react";
import { Toaster } from "sonner";
import Header from "@/components/layout/Header";
import ButtonCloseMenu from "@/components/buttons/ButtonCloseMenu";
import { ModeToggle } from "@/components/mode-toggle";
import { ShowMenuProvider } from "@/context/ShowMenu";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="grid md:grid-cols-[5rem_1fr]">
      <ShowMenuProvider>
        <Header />
        <ButtonCloseMenu />
      </ShowMenuProvider>
      <div>
        <div className="h-16 py-4 px-6 border-b border-b-secondary">
          <div className="flex items-center justify-end md:justify-between">
            <div className="flex items-center gap-2">
              <div className="hidden md:flex uppercase text-sm tracking-[3px] text-primary items-center gap-1">
                <Library width={18} height={18} />
                TaskOs
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ModeToggle />
              <UserButton />
            </div>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
      <Toaster position="top-right" duration={3000} />
    </div>
  );
}
