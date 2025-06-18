"use client";

import { AlertsProvider } from "@/app/context/alertsContext";
import { AuthProvider } from "@/app/context/authContext";
import { SseProvider } from "@/app/context/sseContext";
import { ProductsAndCartProvider } from "@/app/context/productsAndCartContext";
import { OrderProvider } from "@/app/context/orderContext";
import { ConsentProvider } from "@/app/context/consentContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConsentProvider>
      <AlertsProvider>
        <SseProvider>
          <ProductsAndCartProvider>
            <AuthProvider>
              <OrderProvider>{children}</OrderProvider>
            </AuthProvider>
          </ProductsAndCartProvider>
        </SseProvider>
      </AlertsProvider>
    </ConsentProvider>
  );
}
