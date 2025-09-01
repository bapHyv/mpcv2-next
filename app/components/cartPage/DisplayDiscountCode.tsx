"use client";

import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { v4 as uuid } from "uuid";
import { useTranslations } from "next-intl";

import DiscountCode from "@/app/components/cartPage/DiscountCode";
import Title from "@/app/components/Title";
import { useAuth } from "@/app/context/authContext";
import { useSse } from "@/app/context/sseContext";
import { useOrder } from "@/app/context/orderContext";
import { buttonClassname, inputClassname, sectionWrapperClassname, titleClassname } from "@/app/staticData/cartPageClasses";
import { useAlerts } from "@/app/context/alertsContext";

export default function DisplayDiscountCode() {
  const t = useTranslations("");
  const [publicDiscountCode, setPublicDiscountCode] = useState("");
  const [isPublicDiscountCodeValid, setIsPublicDiscountCodeValid] = useState(false);
  const { addAlert } = useAlerts();
  const { userData } = useAuth();
  const { sseData } = useSse();
  const { order, setOrder } = useOrder();

  const isPublicDiscountCodeUsable = () =>
    sseData?.coupons[publicDiscountCode.toLowerCase()]?.individualUse && order.discounts.length > 0 ? false : true;

  const handleUsePublicDiscountCode = () => {
    if (sseData?.coupons && publicDiscountCode && sseData.coupons[publicDiscountCode.toLowerCase()] && isPublicDiscountCodeValid) {
      if (order.discounts.some((d) => d.name === publicDiscountCode)) {
        addAlert(uuid(), t("alerts.cart.promoCodeAlreadyApplied.text"), t("alerts.cart.promoCodeAlreadyApplied.title"), "yellow");
        return;
      }
      setOrder((prevState) => ({
        ...prevState,
        discounts: [...prevState.discounts, { ...sseData.coupons[publicDiscountCode.toLowerCase()], name: publicDiscountCode }],
      }));
      setPublicDiscountCode("");
      addAlert(uuid(), t("alerts.cart.promoCodeApplied.text"), t("alerts.cart.promoCodeApplied.title"), "emerald");
    } else {
      setPublicDiscountCode("");
      addAlert(uuid(), t("alerts.cart.promoCodeInvalid.text"), t("alerts.cart.promoCodeInvalid.title"), "red");
    }
  };

  useEffect(() => {
    if (
      sseData?.coupons && // Check if coupons data exists
      publicDiscountCode && // Check if input has value
      sseData.coupons[publicDiscountCode.toLowerCase()] && // Check if code exists in data
      !sseData.coupons[publicDiscountCode.toLowerCase()].linkedToUser && // Check if it's a public code
      isPublicDiscountCodeUsable() && // Check individual use rules
      !order.discounts.some((d) => d.name.toLowerCase() === publicDiscountCode.toLowerCase()) // Check if not already applied
    ) {
      setIsPublicDiscountCodeValid(true);
    } else {
      setIsPublicDiscountCodeValid(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicDiscountCode, sseData, order.discounts]);

  return (
    <section aria-labelledby="discount-code-heading" className={twMerge(sectionWrapperClassname, "my-0 sm:my-0")}>
      <div className="space-y-6">
        {/* --- LINKED DISCOUNT CODE Section --- */}
        {userData && sseData?.coupons && userData.discounts.length > 0 && (
          <div>
            <Title
              title={t("cartPage.discounts.accountCodesTitle")}
              type="h3"
              classname={twMerge(titleClassname, "mb-3 text-base")}
              firstLetterClassname="text-xl"
              id="linked-account-discount-code"
            />
            {/* List of linked codes */}
            <div className="space-y-2 divide-y divide-gray-200">
              {userData.discounts
                .filter((name) => sseData.coupons[name])
                .map((name, i) => (
                  <DiscountCode key={`${name}-${i}`} name={name} d={sseData.coupons[name]} />
                ))}
            </div>
          </div>
        )}

        {/* --- PUBLIC DISCOUNT CODE Section --- */}
        <div>
          <Title
            title={t("cartPage.discounts.promoCodeTitle")}
            type="h3"
            classname={twMerge(titleClassname, "mb-3 text-base")}
            firstLetterClassname="text-xl"
            id="discount-code-heading"
          />
          {/* Integrated Input/Button */}
          <div className="flex">
            <label htmlFor="public-discount-code" className="sr-only">
              {t("cartPage.discounts.promoCodeTitle")}
            </label>
            <input
              id="public-discount-code"
              name="public-discount-code"
              type="text"
              value={publicDiscountCode}
              placeholder={t("cartPage.discounts.inputPlaceholder")}
              // Convert to uppercase for consistency? Optional: .toUpperCase()
              onChange={(e) => setPublicDiscountCode(e.target.value.trim())}
              className={twMerge(inputClassname, "flex-grow rounded-r-none")}
            />
            <button
              type="button"
              disabled={!isPublicDiscountCodeValid}
              className={twMerge(buttonClassname, "rounded-l-none")}
              onClick={handleUsePublicDiscountCode}
            >
              {t("cartPage.discounts.applyButton")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
