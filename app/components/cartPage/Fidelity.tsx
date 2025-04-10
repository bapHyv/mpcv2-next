"use client";
import { ChangeEvent } from "react";
import { twMerge } from "tailwind-merge";

import { inputClassname, sectionClassname, titleClassname } from "@/app/staticData/cartPageClasses";
import Title from "@/app/components/Title";
import { useAuth } from "@/app/context/authContext";
import { useOrder } from "@/app/context/orderContext";

export default function Fidelity() {
  const { userData } = useAuth();
  const { order, setOrder } = useOrder();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value;

    if (e.target.value === "") {
      return;
    }

    e.target.value = parseInt(e.target.value, 10).toString();

    if (isNaN(parseInt(e.target.value))) {
      e.target.value = "0";
    }

    if (userData && parseInt(e.target.value) > userData.loyaltyPoints) {
      e.target.value = userData.loyaltyPoints.toString();
    }

    if (order.fidelity === 0 && e.target.value !== "0") {
      e.target.value = e.target.value.toString().replace(/^0+/, "");
    }

    setOrder((prevState) => {
      return {
        ...prevState,
        fidelity: parseInt(e.target.value),
      };
    });
  };

  return userData ? (
    <section aria-labelledby="fidelity-points" className={twMerge(sectionClassname)}>
      <Title title="Vos points de fidelite" type="h2" classname={twMerge(titleClassname)} firstLetterClassname="text-2xl" id="fidelity-points" />
      <div>
        <div className="flex items-center justify-between">
          <span>Nombres de points:</span>
          <span>{userData.loyaltyPoints}</span>
        </div>
        <div className="flex items-center justify-between">
          <input
            id="fidelity-points"
            name="fidelity-points"
            type="number"
            value={order.fidelity}
            min={0}
            max={userData.loyaltyPoints}
            className={twMerge(inputClassname)}
            onChange={handleChange}
          />
        </div>
      </div>
      <p className="uppercase text-neutral-600 text-xs">1 point = 0,10 euro de reduction</p>
    </section>
  ) : null;
}
