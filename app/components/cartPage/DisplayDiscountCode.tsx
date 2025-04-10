"use client";

import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { v4 as uuid } from "uuid";

import DiscountCode from "@/app/components/cartPage/DiscountCode";
import Title from "@/app/components/Title";
import { useAuth } from "@/app/context/authContext";
import { useSse } from "@/app/context/sseContext";
import { useOrder } from "@/app/context/orderContext";
import { buttonClassname, inputClassname, sectionClassname, titleClassname } from "@/app/staticData/cartPageClasses";
import { useAlerts } from "@/app/context/alertsContext";

export default function DisplayDiscountCode() {
  const [publicDiscountCode, setPublicDiscountCode] = useState("");
  const [isPublicDiscountCodeValid, setIsPublicDiscountCodeValid] = useState(false);

  const { addAlert } = useAlerts();
  const { userData } = useAuth();
  const { sseData } = useSse();
  const { order, setOrder } = useOrder();

  const isPublicDiscountCodeUsable = () => (sseData?.coupons[publicDiscountCode].individualUse && order.discounts.length ? false : true);

  const handleUsePublicDiscountCode = () => {
    if (sseData && !!publicDiscountCode && publicDiscountCode in sseData.coupons) {
      setOrder((prevState) => {
        return {
          ...prevState,
          discounts: [...prevState.discounts, { ...sseData.coupons[publicDiscountCode], name: publicDiscountCode }],
        };
      });
      setPublicDiscountCode("");
      addAlert(uuid(), "Le code promo a été appliqué avec succès", "Application code promo", "emerald");
    } else {
      addAlert(uuid(), "Erreur lors de l'application du code promotion", "Erreur", "red");
    }
  };

  useEffect(() => {
    if (
      sseData &&
      !!publicDiscountCode &&
      publicDiscountCode in sseData.coupons &&
      !sseData.coupons[publicDiscountCode].linkedToUser &&
      isPublicDiscountCodeUsable()
    ) {
      setIsPublicDiscountCodeValid(true);
    } else {
      setIsPublicDiscountCodeValid(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicDiscountCode, sseData, order.discounts]);

  return (
    <section aria-labelledby="discount-code" className={twMerge(sectionClassname, "flex flex-col gap-y-6")}>
      {/* LINKED DISCOUNT CODE */}
      {userData && sseData ? (
        <div>
          <Title
            title="Codes liés au compte"
            type="h2"
            classname={twMerge(titleClassname, "mb-1")}
            firstLetterClassname="text-2xl"
            id="linked-account-discount-code"
          />
          <label htmlFor="discount-code" className="sr-only">
            discount-code
          </label>
          <div className="flex flex-col gap-y-3">
            {sseData && userData && userData.discounts.map((name, i) => <DiscountCode key={`${name}-${i}`} name={name} d={sseData.coupons[name]} />)}
          </div>
        </div>
      ) : null}
      {/* PUBLIC DISCOUNT CODE */}
      <div>
        <Title title="Codes promo" type="h2" classname={twMerge(titleClassname, "mb-1")} firstLetterClassname="text-2xl" id="discount-code-title" />
        <div className="flex items-center justify-between gap-x-3">
          <input
            id="public-discount-code"
            name="public-discount-code"
            type="text"
            value={publicDiscountCode}
            placeholder="Type discount here"
            onChange={(e) => setPublicDiscountCode(e.target.value)}
            className={twMerge(inputClassname)}
          />
          <button disabled={!isPublicDiscountCodeValid} className={twMerge(buttonClassname)} onClick={handleUsePublicDiscountCode}>
            Appliquer
          </button>
        </div>
      </div>
    </section>
  );
}
