"use client";

import Script from "next/script";
import { useFormState } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { v4 as uuid } from "uuid";

import { data, payment as paymentAction, statusCode } from "@/app/actions";
import Form from "@/app/components/orderPage/Form";
import Order from "@/app/components/orderPage/Order";
import OrderSummary from "@/app/components/orderPage/OrderSummary";
import PaymentMethods from "@/app/components/orderPage/PaymentMethods";
import Shipping from "@/app/components/orderPage/Shipping";
import AreYouCustomer from "@/app/components/cartPage/AreYouCustomer";
import { useOrder } from "@/app/context/orderContext";
import { useEffect, useState } from "react";
import { useAlerts } from "@/app/context/alertsContext";
import { isUserDataAPIResponse } from "@/app/utils/typeGuardsFunctions";
import { useAuth } from "@/app/context/authContext";

interface IActionResponse {
  message: string;
  data: data;
  isSuccess: boolean;
  statusCode: statusCode;
}

export default function DisplayComponents() {
  const [isPending, setIsPending] = useState(false);
  const [actionResponse, setActionResponse] = useState<null | IActionResponse>(null);

  const { order } = useOrder();
  const router = useRouter();
  const { addAlert } = useAlerts();
  const { setUserData } = useAuth();

  const handleAction = async (e: FormData) => {
    e.append("order", JSON.stringify(order));
    setIsPending(true);
    const response = await paymentAction(null, e);
    setActionResponse(response);
    setIsPending(false);
  };

  useEffect(() => {
    if (actionResponse && actionResponse.isSuccess && actionResponse.data && actionResponse.statusCode === 200) {
      if (isUserDataAPIResponse(actionResponse.data)) {
        setUserData(actionResponse.data);
        addAlert(uuid(), "An account has been created for you and you have been logged in successfully", "Login successful", "emerald");
      }
      addAlert(uuid(), "Pour le moment tout ce passe bien", "Titre", "emerald");
    } else if (actionResponse && !actionResponse.isSuccess && !actionResponse.data) {
      switch (actionResponse.statusCode) {
        case 409:
          addAlert(uuid(), "User already exists, you'll get redirected", "User already exists", "blue");
          router.push("/connexion?redirect=commander");
          break;

        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionResponse]);

  return (
    <>
      <form action={handleAction} className="flex flex-col md:flex-row gap-x-5 p-2">
        <div>
          <AreYouCustomer redirect="commander" />
          <Form />
        </div>
        <div>
          <OrderSummary />
          <Shipping />
          <PaymentMethods />
          <Order isPending={isPending} />
        </div>
      </form>
    </>
  );
}
