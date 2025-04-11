// Fidelity.tsx
"use client";
import { ChangeEvent } from "react";
import { twMerge } from "tailwind-merge";

// Import section wrapper, refined input, base title class
import { inputClassname, sectionWrapperClassname, titleClassname } from "@/app/staticData/cartPageClasses";
import Title from "@/app/components/Title";
import { useAuth } from "@/app/context/authContext";
import { useOrder } from "@/app/context/orderContext";

export default function Fidelity() {
  const { userData } = useAuth();
  const { order, setOrder } = useOrder();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (value === "") {
      setOrder((prev) => ({ ...prev, fidelity: 0 }));
      return;
    }

    let numericValue = parseInt(value, 10);

    if (isNaN(numericValue) || numericValue < 0) {
      numericValue = 0;
    }

    if (userData && numericValue > userData.loyaltyPoints) {
      numericValue = userData.loyaltyPoints;
    }

    e.target.value = numericValue.toString();
    setOrder((prevState) => ({
      ...prevState,
      fidelity: numericValue,
    }));
  };

  if (!userData) return null;

  return (
    <section aria-labelledby="fidelity-points-heading" className={twMerge(sectionWrapperClassname)}>
      <Title
        title="Vos points de fidélité"
        type="h3"
        classname={twMerge(titleClassname, "mb-4 text-base")}
        firstLetterClassname="text-xl"
        id="fidelity-points-heading"
      />
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Points disponibles:</span>
          <span className="font-medium text-gray-900">{userData.loyaltyPoints}</span>
        </div>

        <div>
          <label htmlFor="fidelity-points-input" className="block text-sm font-medium text-gray-700 mb-1">
            Points à utiliser :
          </label>
          <div className="flex items-center gap-x-2">
            <input
              id="fidelity-points-input"
              name="fidelity-points"
              type="number"
              value={order.fidelity}
              min={0}
              max={userData.loyaltyPoints}
              className={twMerge(inputClassname, "w-24 text-center")}
              onChange={handleChange}
              placeholder="0"
            />
            {order.fidelity > 0 && <span className="text-sm text-green font-medium">= -{(order.fidelity / 10).toFixed(2)}€</span>}
          </div>
        </div>

        <p className="text-xs text-gray-500 pt-1">1 POINT = 0,10 EURO DE REDUCTION</p>
      </div>
    </section>
  );
}
