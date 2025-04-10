"use client";

import { AlertsProvider } from "@/app/context/alertsContext";
import { AuthProvider } from "@/app/context/authContext";
import { SseProvider } from "@/app/context/sseContext";
import { ProductsAndCartProvider } from "@/app/context/productsAndCartContext";
import { OrderProvider } from "@/app/context/orderContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AlertsProvider>
      <SseProvider>
        <AuthProvider>
          <ProductsAndCartProvider>
            <OrderProvider>{children}</OrderProvider>
          </ProductsAndCartProvider>
        </AuthProvider>
      </SseProvider>
    </AlertsProvider>
  );
}
