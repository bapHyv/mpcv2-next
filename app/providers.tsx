"use client";

import { ThemeProvider } from "next-themes";
import { AlertsProvider } from "@/app/context/alertsContext";
import { AuthProvider } from "@/app/context/authContext";
import { SseProvider } from "@/app/context/sseContext";
import { ProductsAndCartProvider } from "@/app/context/productsAndCartContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AlertsProvider>
        <SseProvider>
          <AuthProvider>
            <ProductsAndCartProvider>{children}</ProductsAndCartProvider>
          </AuthProvider>
        </SseProvider>
      </AlertsProvider>
    </ThemeProvider>
  );
}
