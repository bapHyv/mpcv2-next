"use client";

import Link from "next/link";
import Title from "@/app/components/Title";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, FormEvent } from "react";

import { data, statusCode, payment, bankTransfer } from "@/app/actions";
import PaymentMethods from "@/app/components/paymentPage/PaymentMethods";
import OrderSummary from "@/app/components/shippingPage/OrderSummary";
import Total from "@/app/components/paymentPage/Total";
import { useOrder } from "@/app/context/orderContext";
import { paymentRouteGuard } from "@/app/utils/paymentRouteGuard";
import { Order, SipsFailResponse, SipsSuccessResponse } from "@/app/types/orderTypes";
import { isSuccessResponse } from "@/app/utils/typeGuardsFunctions";
import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import useCleanUpAfterPayment from "@/app/hooks/useCleanUpAfterPayment";

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
  const formRef = useRef<HTMLFormElement>(null); // Properly typed useRef

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

        // Submit the form
        document.body.appendChild(form);
        setIsPending(false);
        form.submit();
        handleCleanUpAfterPayment();
      } else {
        const bankTransferPayment = async () => {
          setIsPending(true);
          const response = await bankTransfer(JSON.stringify(order), initPaymentResponse?.orderId);
          setActionResponse(response);
          setIsPending(false);
        };
        bankTransferPayment();
      }
    }
  };

  useEffect(() => {
    if (!shouldReturn && order && !initPaymentResponse) {
      const initPayment = async (order: Order) => {
        setIsPending(true);
        const response = await payment(JSON.stringify(order));
        setIsPending(false);
        setInitPaymentResponse(response.data as (OrderId & SipsSuccessResponse) | (OrderId & SipsFailResponse));
      };
      initPayment(order);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldReturn, order]);

  useEffect(() => {
    if (initPaymentResponse && actionResponse && actionResponse.isSuccess && actionResponse.statusCode === 204) {
      router.push(`/paiement-virement-bancaire?orderId=${initPaymentResponse.orderId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionResponse]);

  if (shouldReturn) {
    router.back();
    return null;
  }

  return (
    <>
      <Title
        title="Méthode de paiement"
        type="h1"
        classname={`relative mt-4 sm:mt-8 2xl:pl-2 uppercase text-xl text-green font-bold tracking-widest`}
        firstLetterClassname="text-4xl"
      />
      <Link href={"/expedition"} className="text-white px-3 py-2 rounded-md shadow-md cursor-pointer bg-green">
        ← Back to shipping method page
      </Link>
      <form ref={formRef} onSubmit={handleAction} className="flex flex-col md:flex-row gap-x-5 p-2">
        <div>
          <OrderSummary />
          <PaymentMethods />
          <Total isPending={isPending} />
        </div>
      </form>
    </>
  );
}
