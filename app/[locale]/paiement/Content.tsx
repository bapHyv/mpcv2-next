"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, FormEvent, useMemo } from "react";
import clsx from "clsx";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";

import PaymentMethods from "@/app/components/paymentPage/PaymentMethods";
import OrderSummary from "@/app/components/shippingPage/OrderSummary";
import Total from "@/app/components/paymentPage/Total";
import Title from "@/app/components/Title";

import { bankTransfer, payment } from "@/app/actions";
import { useOrder } from "@/app/context/orderContext";
import { paymentRouteGuard } from "@/app/utils/paymentRouteGuard";
import { Order, SipsFailResponse, SipsSuccessResponse } from "@/app/types/orderTypes";
import { isSuccessResponse } from "@/app/utils/typeGuardsFunctions";
import { buttonClassname } from "@/app/staticData/cartPageClasses";
import { twMerge } from "tailwind-merge";
import { IActionResponse } from "@/app/types/apiTypes";
import { ProductCart, useProductsAndCart } from "@/app/context/productsAndCartContext";

interface OrderId {
  orderId: number;
}

export default function Page() {
  const [isPending, setIsPending] = useState(false);
  const [actionResponse, setActionResponse] = useState<null | IActionResponse>(null);
  const [initPaymentResponse, setInitPaymentResponse] = useState<
    null | (OrderId & SipsSuccessResponse) | (OrderId & SipsFailResponse) | { error: true }
  >(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { order } = useOrder();
  const { cart } = useProductsAndCart();
  const router = useRouter();

  const shouldReturn = useMemo(() => {
    return paymentRouteGuard(order);
  }, [order]);

  const handleAction = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (initPaymentResponse) {
      if (
        order["payment-method"] === "secure-3d-card" &&
        !("error" in initPaymentResponse) &&
        initPaymentResponse.redirectionStatusCode === "00" &&
        isSuccessResponse(initPaymentResponse)
      ) {
        setIsPending(true);
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
      } else if (order["payment-method"] === "bank-transfer") {
        const bankTransferPayment = async () => {
          setIsPending(true);
          try {
            const response = await bankTransfer(JSON.stringify(order), (initPaymentResponse as OrderId & SipsSuccessResponse)?.orderId);
            setActionResponse(response);
          } catch (error) {
            console.error("Bank transfer action failed:", error);
          } finally {
            setIsPending(false);
          }
        };
        bankTransferPayment();
      } else {
        console.warn("Unhandled payment method or response state:", order["payment-method"], initPaymentResponse);
      }
    } else {
      console.error("Cannot proceed with payment, initial payment setup failed.");
    }
  };

  const initPayment = async () => {
    console.log("Initiating payment...");
    setIsPending(true);
    try {
      const response = await payment(JSON.stringify({ order, cart }));
      if (response?.data) {
        setInitPaymentResponse(response.data as (OrderId & SipsSuccessResponse) | (OrderId & SipsFailResponse));
      } else {
        console.error("Failed to initialize payment", response?.message);
        setInitPaymentResponse({ error: true });
      }
    } catch (error) {
      console.error("Error calling initPayment action:", error);
    } finally {
      setIsPending(false);
    }
  };

  /**
   * TODO: Fetch toutes les une seconde pendant 3 secondes
   *
   * essayer de fetch si:
   *  -initPaymentResponse est null ou qu'il y a une erreur
   *
   * Ne pas réessayer de fetch si il y a une response correcte
   */

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
      {/* Center Title */}
      <Title
        title="Paiement"
        type="h1"
        classname={`relative mb-6 text-center uppercase text-xl text-green font-bold tracking-widest`}
        firstLetterClassname="text-4xl"
      />

      <div className="mb-6">
        <Link
          href={"/expedition"}
          className={twMerge(clsx(buttonClassname, "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50", "px-3 py-1.5 text-sm"))}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1.5" aria-hidden="true" />
          Retour à l&apos;expédition
        </Link>
      </div>

      <form ref={formRef} onSubmit={handleAction} className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-8 xl:gap-x-12 mt-6">
        {/* Left Column: Payment Methods & Total */}
        <div className="lg:col-span-7 space-y-6">
          <PaymentMethods />
          <Total
            isPending={isPending}
            isError={(() => (initPaymentResponse && "error" in initPaymentResponse ? true : false))()}
            retryInitPayment={initPayment}
          />
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 mt-8 lg:mt-0">
          <OrderSummary />
        </div>
      </form>
    </div>
  );
}
