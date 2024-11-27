"use client";

import { ThemeProvider } from "next-themes";
import { ProductsProvider } from "@/app/context/productsContext";
import { CartProvider } from "@/app/context/cartContext";
import { AlertsProvider } from "@/app/context/alertsContext";
import { AuthProvider } from "@/app/context/authContext";


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
