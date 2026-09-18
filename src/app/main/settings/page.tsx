"use client";

import { useUser } from "@clerk/nextjs";
import { CheckIcon, CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { primaryColorPresets } from "@/lib/theme-colors";
import { usePrimaryColor } from "@/components/providers/primary-color-provider";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { colorId, setColorId } = usePrimaryColor();
  const { user } = useUser();

  const copyClerkId = async () => {
    if (!user) return;

    await navigator.clipboard.writeText(user.id);
    toast.success("Clerk ID copiado al portapapeles");
  };

  return (
    <div className="max-w-screen-md grid gap-6">
      <div>
        <h2 className="font-bold text-2xl">Configuración</h2>
        <p className="text-gray-400">Personaliza la apariencia de la aplicación</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tu cuenta</CardTitle>
          <CardDescription>
            Comparte este ID con el dueño de un proyecto para que te agregue como miembro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input value={user?.id ?? ""} readOnly className="font-mono text-sm" />
            <Button type="button" variant="outline" size="icon" onClick={copyClerkId} disabled={!user}>
              <CopyIcon className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Color primario</CardTitle>
          <CardDescription>Se usa en botones, links y elementos destacados de toda la app</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {primaryColorPresets.map((preset) => {
              const isActive = preset.id === colorId;

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setColorId(preset.id)}
                  className="flex flex-col items-center gap-2"
                  aria-pressed={isActive}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full ring-offset-2 ring-offset-background transition-all",
                      isActive && "ring-2 ring-foreground",
                    )}
                    style={{ backgroundColor: `hsl(${preset.primary})` }}
                  >
                    {isActive && <CheckIcon className="size-4 text-white" />}
                  </span>
                  <span className="text-xs text-muted-foreground">{preset.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
