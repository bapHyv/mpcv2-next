"use client";

import { ThemeProvider } from "next-themes";
import { ProductsProvider } from "@/app/productsContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ProductsProvider>{children}</ProductsProvider>
    </ThemeProvider>
  );
}
