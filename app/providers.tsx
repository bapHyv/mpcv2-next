"use client";

import { ThemeProvider } from "next-themes";
import { ProductsProvider } from "@/app/productsContext";
import { CartProvider } from "@/app/cartContext";
import { AlertsProvider } from "@/app/alertsContext";
import { SseProvider } from "@/app/sseContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AlertsProvider>
        <SseProvider>
          <CartProvider>
            <ProductsProvider>{children}</ProductsProvider>
          </CartProvider>
        </SseProvider>
      </AlertsProvider>
    </ThemeProvider>
  );
}
