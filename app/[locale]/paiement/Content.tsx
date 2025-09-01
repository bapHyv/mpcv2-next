"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, FormEvent, useMemo } from "react";
import clsx from "clsx";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { v4 as uuid } from "uuid";

import PaymentMethods from "@/app/components/paymentPage/PaymentMethods";
import OrderSummary from "@/app/components/shippingPage/OrderSummary";
import Total from "@/app/components/paymentPage/Total";
import Title from "@/app/components/Title";

import { useFetchWrapper } from "@/app/hooks/useFetchWrapper";
import { useOrder } from "@/app/context/orderContext";
import { paymentRouteGuard } from "@/app/utils/paymentRouteGuard";
import { SipsFailResponse, SipsSuccessResponse } from "@/app/types/orderTypes";
import { isSuccessResponse } from "@/app/utils/typeGuardsFunctions";
import { buttonClassname } from "@/app/staticData/cartPageClasses";
import { twMerge } from "tailwind-merge";
import { IActionResponse } from "@/app/types/apiTypes";
import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import useCleanUpAfterPayment from "@/app/hooks/useCleanUpAfterPayment";
import { setItemWithExpiry } from "@/app/utils/temporaryStorage";
import { useAlerts } from "@/app/context/alertsContext";
import { useLocale, useTranslations } from "next-intl";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function Page() {
  const [isPending, setIsPending] = useState(false);
  const [actionResponse, setActionResponse] = useState<null | IActionResponse>(null);
  const [initPaymentResponse, setInitPaymentResponse] = useState<
    null | ({ orderId: number } & (SipsSuccessResponse | SipsFailResponse)) | { error: true }
  >(null);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [isRedirecting, setIsRedirecting] = useState(false);

  const t = useTranslations();
  const { addAlert } = useAlerts();
  const { fetchWrapper } = useFetchWrapper();
  const { order } = useOrder();
  const { cart } = useProductsAndCart();
  const { handleCleanUpAfterPayment } = useCleanUpAfterPayment();
  const router = useRouter();
  const locale = useLocale();

  const shouldReturn = useMemo(() => {
    return paymentRouteGuard(order);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!initPaymentResponse || "error" in initPaymentResponse) {
      console.error("Cannot proceed, payment initialization failed.");
      return;
    }

    setIsPending(true);
    const JWT_EXPIRY_SECONDS = 900;

    try {
      setItemWithExpiry("tempOrder", order, JWT_EXPIRY_SECONDS);
      setItemWithExpiry("tempCart", cart, JWT_EXPIRY_SECONDS);
      console.log("Order and Cart state saved to temporary storage.");
    } catch (error) {
      console.error("Critical Error: Failed to save state to localStorage. Aborting payment.", error);
      addAlert(uuid(), t("alerts.payment.prepareError.text"), t("alerts.payment.prepareError.title"), "red");
      setIsPending(false);
      return; // Stop the process
    }

    setIsFinalizing(true);
    // Short delay to allow the overlay to render before heavy work
    await new Promise((resolve) => setTimeout(resolve, 50));

    if (order["payment-method"] === "bank-transfer") {
      try {
        const bankResponse = await fetchWrapper(`/api/payment/bank-transfer/${initPaymentResponse.orderId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        });

        if (!bankResponse.ok) throw new Error("Bank transfer setup failed");

        const { token } = await bankResponse.json();

        handleCleanUpAfterPayment();
        router.push(`/commande-recue?token=${token}`);
      } catch (error) {
        console.error("Bank transfer flow failed:", error);
        setIsFinalizing(false);
        setIsPending(false);
        // Show error alert
      }
      return;
    }

    // --- Secure 3D Card Flow ---
    if (isSuccessResponse(initPaymentResponse)) {
      handleCleanUpAfterPayment();
      setIsRedirecting(true);
    } else {
      // Handle cases where Sips returns a failure code during init
      console.error("SIPS initialization failed:", initPaymentResponse);
      // Show an error alert to the user.
      setIsFinalizing(false);
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (isRedirecting && initPaymentResponse && !("error" in initPaymentResponse) && isSuccessResponse(initPaymentResponse)) {
      console.log("Cleanup complete, now submitting form to payment gateway...");

      const form = document.createElement("form");
      form.method = "POST";
      form.action = initPaymentResponse.redirectionUrl;

      const versionInput = document.createElement("input");
      versionInput.type = "hidden";
      versionInput.name = "redirectionVersion";
      versionInput.value = initPaymentResponse.redirectionVersion;

      const dataInput = document.createElement("input");
      dataInput.type = "hidden";
      dataInput.name = "redirectionData";
      dataInput.value = initPaymentResponse.redirectionData;

      form.appendChild(versionInput);
      form.appendChild(dataInput);

      document.body.appendChild(form);
      form.submit();
    }
  }, [isRedirecting, initPaymentResponse]);

  const initPayment = async () => {
    setIsPending(true);
    setInitPaymentResponse(null);
    try {
      const response = await fetchWrapper("/api/payment/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order, cart }),
      });

      if (!response.ok) {
        setInitPaymentResponse({ error: true });
        return;
      }

      const responseData = await response.json();
      setInitPaymentResponse(responseData);
    } catch (error) {
      console.error("Error calling initPayment API:", error);
      setInitPaymentResponse({ error: true });
    } finally {
      setIsPending(false);
    }
  };

  // Trigger init-payment on mounted
  useEffect(() => {
    if (!shouldReturn && order && !initPaymentResponse && !isPending) {
      initPayment();
      console.log("Payment Page Mounted, Ready for initPayment");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldReturn, order, initPaymentResponse]);

  useEffect(() => {
    if (
      initPaymentResponse &&
      actionResponse &&
      actionResponse.isSuccess &&
      actionResponse.statusCode === 204 &&
      order["payment-method"] === "bank-transfer"
    ) {
      router.push(`/commande-recue?token=${actionResponse.data}`);
    }
    if (actionResponse) setActionResponse(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionResponse, initPaymentResponse, router, order]);

  if (shouldReturn) {
    if (typeof window !== "undefined") {
      router.back();
    }
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {isFinalizing && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-[10000]">
          <LoadingSpinner size="lg" color="green" />
          <p className="mt-4 text-lg font-semibold text-gray-700">{t("paymentPage.finalizing")}</p>
        </div>
      )}
      {/* Center Title */}
      <Title
        title="Paiement"
        type="h1"
        classname={`relative mb-6 text-center uppercase text-xl text-green font-bold tracking-widest`}
        firstLetterClassname="text-4xl"
      />

      <div className="mb-6">
        <Link
          href={`/${locale}/expedition`}
          className={twMerge(clsx(buttonClassname, "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50", "px-3 py-1.5 text-sm"))}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1.5" aria-hidden="true" />
          Retour à l&apos;expédition
        </Link>
      </div>

      <form ref={formRef} onSubmit={handleAction} className={twMerge("flex flex-col mt-6", "lg:flex-row lg:gap-x-6", "2xl:w-2/3 2xl:m-auto")}>
        {/* Left Column: Payment Methods & Total */}
        <div className="lg:w-1/2 space-y-6">
          <PaymentMethods />
          <Total
            isPending={isPending}
            isError={(() => (initPaymentResponse && "error" in initPaymentResponse ? true : false))()}
            retryInitPayment={initPayment}
          />
        </div>

        {/* Right Column: Order Summary */}
        <div className="mt-8 lg:mt-0 lg:w-1/2">
          <OrderSummary />
        </div>
      </form>
    </div>
  );
}
