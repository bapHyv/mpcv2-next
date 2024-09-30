"use client";

import { ThemeProvider } from "next-themes";
import { ProductsProvider } from "@/app/productsContext";
import { CartProvider } from "@/app/cartContext";
import { AlertsProvider } from "@/app/alertsContext";
import { AuthProvider } from "@/app/authContext";


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AlertsProvider>
        <AuthProvider>
          <ProductsProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </ProductsProvider>
        </AuthProvider>
      </AlertsProvider>
    </ThemeProvider>
  );
}
