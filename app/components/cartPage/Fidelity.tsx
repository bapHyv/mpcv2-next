"use client";

import { ChangeEvent } from "react";
import { twMerge } from "tailwind-merge";
import { useTranslations } from "next-intl";

import { inputClassname, sectionWrapperClassname, titleClassname, labelClassname } from "@/app/staticData/cartPageClasses";
import Title from "@/app/components/Title";
import { useAuth } from "@/app/context/authContext";
import { useOrder } from "@/app/context/orderContext";

export default function Fidelity() {
  const t = useTranslations("cartPage.loyalty");
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
    setOrder((prevState) => ({ ...prevState, fidelity: numericValue }));
  };

  if (!userData) return null;

  return (
    <section aria-labelledby="fidelity-points-heading" className={twMerge(sectionWrapperClassname)}>
      <Title
        title={t("title")}
        type="h3"
        classname={twMerge(titleClassname, "mb-4 text-base")}
        firstLetterClassname="text-xl"
        id="fidelity-points-heading"
      />
      <div className="space-y-3">
        {/* Available Points */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{t("availableLabel")}</span>
          {/* Format points number */}
          <span className="font-medium text-gray-900">{new Intl.NumberFormat().format(userData.loyaltyPoints)}</span>
        </div>

        {/* Points Input */}
        <div>
          <label htmlFor="fidelity-points-input" className={twMerge(labelClassname, "mb-1")}>
            {t("useInputLabel")}
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
              aria-describedby="fidelity-conversion-rate"
            />
            {/* Display calculated reduction */}
            {order.fidelity > 0 && <span className="text-sm text-green font-medium">= -{(order.fidelity / 10).toFixed(2)}€</span>}
          </div>
        </div>

        {/* Conversion Rate Info */}
        <p id="fidelity-conversion-rate" className="text-xs text-gray-500 pt-1 uppercase">
          {t("conversionRate")}
        </p>
      </div>
    </section>
  );
}
