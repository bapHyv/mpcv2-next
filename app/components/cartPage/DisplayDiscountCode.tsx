"use client";

import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { v4 as uuid } from "uuid";

import DiscountCode from "@/app/components/cartPage/DiscountCode";
import Title from "@/app/components/Title";
import { useAuth } from "@/app/context/authContext";
import { useSse } from "@/app/context/sseContext";
import { useOrder } from "@/app/context/orderContext";
import { buttonClassname, inputClassname, sectionWrapperClassname, titleClassname } from "@/app/staticData/cartPageClasses";
import { useAlerts } from "@/app/context/alertsContext";

export default function DisplayDiscountCode() {
  const [publicDiscountCode, setPublicDiscountCode] = useState("");
  const [isPublicDiscountCodeValid, setIsPublicDiscountCodeValid] = useState(false);
  const { addAlert } = useAlerts();
  const { userData } = useAuth();
  const { sseData } = useSse();
  const { order, setOrder } = useOrder();

  const isPublicDiscountCodeUsable = () => (sseData?.coupons[publicDiscountCode]?.individualUse && order.discounts.length > 0 ? false : true);

  const handleUsePublicDiscountCode = () => {
    if (sseData && publicDiscountCode && sseData.coupons[publicDiscountCode] && isPublicDiscountCodeValid) {
      if (order.discounts.some((d) => d.name === publicDiscountCode)) {
        addAlert(uuid(), "Ce code promo est déjà appliqué.", "Erreur", "yellow");
        return;
      }
      setOrder((prevState) => ({
        ...prevState,
        discounts: [...prevState.discounts, { ...sseData.coupons[publicDiscountCode], name: publicDiscountCode }],
      }));
      setPublicDiscountCode("");
      addAlert(uuid(), "Le code promo a été appliqué avec succès", "Application code promo", "emerald");
    } else {
      addAlert(uuid(), "Code promo invalide ou non applicable.", "Erreur", "red");
    }
  };

  useEffect(() => {
    if (
      sseData &&
      publicDiscountCode &&
      sseData.coupons[publicDiscountCode] &&
      !sseData.coupons[publicDiscountCode].linkedToUser &&
      isPublicDiscountCodeUsable() &&
      !order.discounts.some((d) => d.name === publicDiscountCode)
    ) {
      setIsPublicDiscountCodeValid(true);
    } else {
      setIsPublicDiscountCodeValid(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicDiscountCode, sseData, order.discounts]);

  return (
    <section aria-labelledby="discount-code-heading" className={twMerge(sectionWrapperClassname)}>
      <div className="space-y-6">
        {" "}
        {/* LINKED DISCOUNT CODE */}
        {userData && sseData && userData.discounts.length > 0 ? (
          <div>
            <Title
              title="Codes liés au compte"
              type="h3"
              classname={twMerge(titleClassname, "mb-3 text-base")}
              firstLetterClassname="text-xl"
              id="linked-account-discount-code"
            />
            <div className="space-y-2 divide-y divide-gray-200">
              {sseData &&
                userData &&
                userData.discounts
                  .filter((name) => sseData.coupons[name])
                  .map((name, i) => <DiscountCode key={`${name}-${i}`} name={name} d={sseData.coupons[name]} />)}
            </div>
          </div>
        ) : null}
        {/* PUBLIC DISCOUNT CODE */}
        <div>
          <Title
            title="Codes promo"
            type="h3"
            classname={twMerge(titleClassname, "mb-3 text-base")}
            firstLetterClassname="text-xl"
            id="discount-code-heading"
          />
          <div className="flex">
            <label htmlFor="public-discount-code" className="sr-only">
              Code Promo
            </label>
            <input
              id="public-discount-code"
              name="public-discount-code"
              type="text"
              value={publicDiscountCode}
              placeholder="Entrez votre code"
              onChange={(e) => setPublicDiscountCode(e.target.value.trim())}
              className={twMerge(inputClassname, "flex-grow rounded-r-none")}
            />
            <button
              disabled={!isPublicDiscountCodeValid}
              className={twMerge(buttonClassname, "rounded-l-none")}
              onClick={handleUsePublicDiscountCode}
            >
              Appliquer
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
