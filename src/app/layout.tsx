import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { PrimaryColorProvider } from "@/components/providers/primary-color-provider";
import { PRIMARY_COLOR_STORAGE_KEY, primaryColorPresets } from "@/lib/theme-colors";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Front Tasks",
  description: "Gestor de tareas y proyectos",
};

const applyStoredPrimaryColorScript = `
(function () {
  try {
    var presets = ${JSON.stringify(primaryColorPresets)};
    var storedId = window.localStorage.getItem(${JSON.stringify(PRIMARY_COLOR_STORAGE_KEY)});
    var preset = presets.find(function (p) { return p.id === storedId; });
    if (preset) {
      document.documentElement.style.setProperty('--primary', preset.primary);
      document.documentElement.style.setProperty('--ring', preset.primary);
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="es" className={outfit.variable} suppressHydrationWarning>
        <body>
          <Script
            id="apply-stored-primary-color"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: applyStoredPrimaryColorScript }}
          />
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            storageKey="vite-ui-theme"
          >
            <PrimaryColorProvider>
              <QueryProvider>{children}</QueryProvider>
            </PrimaryColorProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
