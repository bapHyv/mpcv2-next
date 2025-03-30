"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";

import Form from "@/app/components/shippingPage/Form";
import Total from "@/app/components/shippingPage/Total";
import OrderSummary from "@/app/components/shippingPage/OrderSummary";
import Shipping from "@/app/components/shippingPage/Shipping";
import AreYouCustomer from "@/app/components/cartPage/AreYouCustomer";

import { data, statusCode, register } from "@/app/actions";
import { useOrder } from "@/app/context/orderContext";
import { useEffect, useRef, useState, FormEvent } from "react";
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
  const form = useRef<HTMLFormElement>(null);

  const { order } = useOrder();
  const router = useRouter();
  const { addAlert } = useAlerts();
  const { userData, setUserData } = useAuth();

  const handleAction = async (e: FormEvent<HTMLFormElement>) => {
    if (form.current) {
      e.preventDefault();
      try {
        if (!userData) {
          setIsPending(true);
          const formData = new FormData(form.current);
          formData.append("shipping-address", JSON.stringify(order.shippingAddress));
          formData.append("billing-address", JSON.stringify(order.billingAddress));
          const response = await register(null, formData);
          setIsPending(false);
          setActionResponse(response);
        } else {
          router.push("/paiement");
        }
      } catch (error) {
        console.error(error);
        throw new Error("Something went wrong");
      }
    }
  };

  useEffect(() => {
    if (actionResponse && actionResponse.isSuccess && actionResponse.data && actionResponse.statusCode === 200) {
      if (isUserDataAPIResponse(actionResponse.data)) {
        setUserData(actionResponse.data);
        addAlert(uuid(), "An account has been created for you and you have been logged in successfully", "Login successful", "emerald");
        router.push("/paiement");
      }
    } else if (actionResponse && !actionResponse.isSuccess && !actionResponse.data) {
      switch (actionResponse.statusCode) {
        case 409:
          addAlert(uuid(), "User already exists, you'll get redirected", "User already exists", "blue");
          router.push("/connexion?redirect=paiement");
          break;
        case 500:
          addAlert(uuid(), "Something went wrong on the server side", "Server Error", "red");
          break;
        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionResponse]);

  return (
    <>
      <Link href={"/panier"} className="text-white px-3 py-2 rounded-md shadow-md cursor-pointer bg-green">
        ← Back to cart page
      </Link>
      <AreYouCustomer redirect="expedition" />
      <form
        ref={form}
        onSubmit={handleAction} // Use onSubmit instead of action
        className="flex flex-col md:flex-row gap-x-5 p-2"
      >
        <div>
          <Form />
        </div>
        <div>
          <OrderSummary />
          <Shipping />
          <Total isPending={isPending} />
        </div>
      </form>
    </>
  );
}
