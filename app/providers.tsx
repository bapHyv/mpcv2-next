"use client";

import { ThemeProvider } from "next-themes";
import { ProductsProvider } from "@/app/productsContext";
import { CartProvider } from "@/app/cartContext";
import { AlertsProvider } from "@/app/alertsContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AlertsProvider>
        <ProductsProvider>
          <CartProvider>{children}</CartProvider>
        </ProductsProvider>
      </AlertsProvider>
    </ThemeProvider>
  );
}
