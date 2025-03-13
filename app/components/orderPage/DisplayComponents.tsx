"use client";

import Form from "@/app/components/orderPage/Form";
import Order from "@/app/components/orderPage/Order";
import OrderSummary from "@/app/components/orderPage/OrderSummary";
import PaymentMethods from "@/app/components/orderPage/PaymentMethods";
import Shipping from "@/app/components/orderPage/Shipping";
import AreYouCustomer from "@/app/components/cartPage/AreYouCustomer";
import { useFormState } from "react-dom";
import { payment as paymentAction } from "@/app/actions";
import { useOrder } from "@/app/context/orderContext";

export default function DisplayComponents() {
  const { order } = useOrder();

  // @ts-ignore
  const [state, formAction] = useFormState(paymentAction, order);

  const handleSubmit = (e: FormData) => {
    e.append("order-complete", JSON.stringify(order));

    // @ts-ignore
    formAction(e);
  };

  return (
    <>
      <form action={(e) => handleSubmit(e)} className="flex flex-col md:flex-row gap-x-5 p-2">
        <div>
          <AreYouCustomer redirect="commander" />
          <Form />
        </div>
        <div>
          <OrderSummary />
          <Shipping />
          <PaymentMethods />
          <Order />
        </div>
      </form>
    </>
  );
}
