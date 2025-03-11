"use client";

import { useState } from "react";

import Form from "@/app/components/orderPage/Form";
import Order from "@/app/components/orderPage/Order";
import OrderSummary from "@/app/components/orderPage/OrderSummary";
import PaymentMethods from "@/app/components/orderPage/PaymentMethods";
import Shipping from "@/app/components/orderPage/Shipping";
import AreYouCustomer from "@/app/components/cartPage/AreYouCustomer";

export default function DisplayComponents() {
  const [payment, setPayment] = useState<null | "secure-3d-card" | "bank-transfer">(null);
  const [formData, setFormData] = useState<{ [x: string]: string }>({
    "shipping-firstname": "",
    "shipping-lastname": "",
    "shipping-company": "",
    "shipping-country": "",
    "shipping-address1": "",
    "shipping-address2": "",
    "shipping-postalCode": "",
    "shipping-city": "",
    "shipping-province": "",
    "shipping-phone": "",
    "shipping-email": "",
    "shipping-password": "",
    "different-billing": "false",
    "billing-firstname": "",
    "billing-lastname": "",
    "billing-company": "",
    "billing-country": "",
    "billing-address1": "",
    "billing-address2": "",
    "billing-postalCode": "",
    "billing-city": "",
    "billing-province": "",
    "billing-phone": "",
    "billing-email": "",
    paymentMethod: "",
    shippingMethod: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, id, checked } = e.target as HTMLInputElement;
    if (type === "checkbox" && id.startsWith("different-")) {
      setFormData((prevState) => ({
        ...prevState,
        [id]: `${checked}`,
      }));
    } else if (type === "radio" && id.startsWith("payment-")) {
      setFormData((prevState) => ({
        ...prevState,
        paymentMethod: value,
      }));
    } else if (type === "radio" && id.startsWith("shipping-")) {
      setFormData((prevState) => ({
        ...prevState,
        shippingMethodId: value,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <>
      <form className="flex flex-col md:flex-row gap-x-5 p-2">
        <div>
          <AreYouCustomer redirect="commander" />
          <Form handleChange={handleChange} formData={formData} setFormData={setFormData} />
        </div>
        <div>
          <OrderSummary />
          <Shipping handleChange={handleChange} formData={formData} />
          <PaymentMethods payment={payment} setPayment={setPayment} handleChange={handleChange} formData={formData} />
          <Order payment={payment} formData={formData} />
        </div>
      </form>
    </>
  );
}
