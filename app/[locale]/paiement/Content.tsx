"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, FormEvent } from "react";
import clsx from "clsx";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";

import PaymentMethods from "@/app/components/paymentPage/PaymentMethods";
import OrderSummary from "@/app/components/shippingPage/OrderSummary";
import Total from "@/app/components/paymentPage/Total";
import Title from "@/app/components/Title";

import { data, statusCode, bankTransfer, payment } from "@/app/actions";
import { useOrder } from "@/app/context/orderContext";
import { paymentRouteGuard } from "@/app/utils/paymentRouteGuard";
import { Order, SipsFailResponse, SipsSuccessResponse } from "@/app/types/orderTypes";
import { isSuccessResponse } from "@/app/utils/typeGuardsFunctions";
import useCleanUpAfterPayment from "@/app/hooks/useCleanUpAfterPayment";
import { buttonClassname } from "@/app/staticData/cartPageClasses";
import { twMerge } from "tailwind-merge";

interface IActionResponse {
  message: string;
  data: data;
  isSuccess: boolean;
  statusCode: statusCode;
}

interface OrderId {
  orderId: number;
}

export default function Page() {
  const [isPending, setIsPending] = useState(false);
  const [actionResponse, setActionResponse] = useState<null | IActionResponse>(null);
  const [initPaymentResponse, setInitPaymentResponse] = useState<null | (OrderId & SipsSuccessResponse) | (OrderId & SipsFailResponse)>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { order } = useOrder();
  const { handleCleanUpAfterPayment } = useCleanUpAfterPayment();
  const router = useRouter();

  const shouldReturn = paymentRouteGuard(order);

  const handleAction = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (initPaymentResponse) {
      if (
        order["payment-method"] === "secure-3d-card" &&
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
        handleCleanUpAfterPayment();
      } else if (order["payment-method"] === "bank-transfer") {
        // Check if bank transfer selected
        const bankTransferPayment = async () => {
          setIsPending(true);
          try {
            // Pass orderId from initPaymentResponse if it exists
            const response = await bankTransfer(JSON.stringify(order), initPaymentResponse?.orderId);
            setActionResponse(response);
          } catch (error) {
            console.error("Bank transfer action failed:", error);
            // Handle error state appropriately, maybe show an alert
          } finally {
            setIsPending(false);
          }
        };
        bankTransferPayment();
      } else {
        // Handle other payment methods or errors if necessary
        console.warn("Unhandled payment method or response state:", order["payment-method"], initPaymentResponse);
      }
    } else {
      // Handle case where initPaymentResponse is null (e.g., API call failed)
      console.error("Cannot proceed with payment, initial payment setup failed.");
      // Show an error message to the user?
    }
  };

  useEffect(() => {
    // Keep initial payment setup logic (commented out as per your code)
    if (!shouldReturn && order && !initPaymentResponse && !isPending) {
      // Avoid re-fetching if pending
      const initPayment = async (orderData: Order) => {
        console.log("Initiating payment...");
        setIsPending(true);
        try {
          const response = await payment(JSON.stringify(orderData));
          if (response?.data) {
            setInitPaymentResponse(response.data as (OrderId & SipsSuccessResponse) | (OrderId & SipsFailResponse));
          } else {
            console.error("Failed to initialize payment", response?.message);
            // Handle error - maybe show an alert
          }
        } catch (error) {
          console.error("Error calling initPayment action:", error);
          // Handle error
        } finally {
          setIsPending(false);
        }
      };
      initPayment(order);
      console.log("Payment Page Mounted, Ready for initPayment (currently commented out)");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldReturn, order, initPaymentResponse, isPending]); // Add isPending dependency

  useEffect(() => {
    if (
      initPaymentResponse &&
      actionResponse &&
      actionResponse.isSuccess &&
      actionResponse.statusCode === 204 &&
      order["payment-method"] === "bank-transfer"
    ) {
      handleCleanUpAfterPayment(); // Clean up before navigating
      router.push(`/paiement-virement-bancaire?orderId=${initPaymentResponse.orderId}`);
    }
    // Reset actionResponse after handling
    if (actionResponse) setActionResponse(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionResponse, initPaymentResponse, router, handleCleanUpAfterPayment, order]);

  // Keep route guard logic
  if (shouldReturn) {
    // console.log("Payment route guard triggered, redirecting back.");
    // Check if window is defined (client-side) before using router
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
          <Total isPending={isPending} />
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 mt-8 lg:mt-0">
          <OrderSummary />
        </div>
      </form>
    </div>
  );
}
