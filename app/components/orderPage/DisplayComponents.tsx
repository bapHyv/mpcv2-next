"use client";

import { useEffect, useState } from "react";

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
  const [payment, setPayment] = useState<null | "secure-3d-card" | "bank-transfer">(null);
  const { order } = useOrder();
  const [formData, setFormData] = useState<{ [x: string]: string }>({});

  // @ts-ignore
  const [state, formAction] = useFormState(paymentAction, formData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, id, checked } = e.target as HTMLInputElement;
    if (type === "checkbox" && id.startsWith("different-")) {
      setFormData((prevState) => ({
        ...prevState,
        [id]: `${checked}`,
      }));
    } else if (type === "radio" && id.startsWith("payment-")) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else if (type === "radio" && id.startsWith("shipping-")) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: FormData) => {
    // e.append("products", JSON.stringify(order.products));
    // e.append("discounts", JSON.stringify(order.discounts));
    // e.append("total", order.totalOrder.toFixed(2));
    // e.append("customerIp", order.customerIp);
    // e.append("customerUserAgent", order.customerUserAgent);
    // e.append("deviceType", JSON.stringify(order.deviceType));
    e.append("order-complete", JSON.stringify(order));

    // @ts-ignore
    formAction(e);
  };

  return (
    <>
      <form action={(e) => handleSubmit(e)} className="flex flex-col md:flex-row gap-x-5 p-2">
        <div>
          <AreYouCustomer redirect="commander" />
          <Form handleChange={handleChange} formData={formData} setFormData={setFormData} />
        </div>
        <div>
          <OrderSummary />
          <Shipping handleChange={handleChange} formData={formData} />
          <PaymentMethods payment={payment} setPayment={setPayment} handleChange={handleChange} formData={formData} />
          <Order payment={payment} formData={formData} setFormData={setFormData} />
        </div>
      </form>
    </>
  );
}
