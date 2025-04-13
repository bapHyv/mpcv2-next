// DisplayDiscountCode.tsx (Updated with i18n)
"use client";

import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { v4 as uuid } from "uuid";
import { useTranslations } from "next-intl"; // Import hook

import DiscountCode from "@/app/components/cartPage/DiscountCode";
import Title from "@/app/components/Title";
import { useAuth } from "@/app/context/authContext";
import { useSse } from "@/app/context/sseContext";
import { useOrder } from "@/app/context/orderContext";
// Import styling classes
import { buttonClassname, inputClassname, sectionWrapperClassname, titleClassname } from "@/app/staticData/cartPageClasses";
import { useAlerts } from "@/app/context/alertsContext";

export default function DisplayDiscountCode() {
  // --- Hooks ---
  const t = useTranslations(""); // Namespace for UI text
  const [publicDiscountCode, setPublicDiscountCode] = useState("");
  const [isPublicDiscountCodeValid, setIsPublicDiscountCodeValid] = useState(false);
  const { addAlert } = useAlerts();
  const { userData } = useAuth();
  const { sseData } = useSse();
  const { order, setOrder } = useOrder();

  // --- Helper Functions ---
  // Keep existing usability check logic
  const isPublicDiscountCodeUsable = () => (sseData?.coupons[publicDiscountCode]?.individualUse && order.discounts.length > 0 ? false : true);

  // --- Handlers ---
  const handleUsePublicDiscountCode = () => {
    if (sseData?.coupons && publicDiscountCode && sseData.coupons[publicDiscountCode] && isPublicDiscountCodeValid) {
      // Check if already applied
      if (order.discounts.some((d) => d.name === publicDiscountCode)) {
        // Use translated alert
        addAlert(uuid(), t("alerts.cart.promoCodeAlreadyApplied.text"), t("alerts.cart.promoCodeAlreadyApplied.title"), "yellow");
        return;
      }
      // Apply discount
      setOrder((prevState) => ({
        ...prevState,
        discounts: [...prevState.discounts, { ...sseData.coupons[publicDiscountCode], name: publicDiscountCode }],
      }));
      setPublicDiscountCode(""); // Clear input
      // Use translated success alert
      addAlert(uuid(), t("alerts.cart.promoCodeApplied.text"), t("alerts.cart.promoCodeApplied.title"), "emerald");
    } else {
      // Use translated invalid code alert
      addAlert(uuid(), t("alerts.cart.promoCodeInvalid.text"), t("alerts.cart.promoCodeInvalid.title"), "red");
    }
  };

  // --- Effects ---
  useEffect(() => {
    // Keep existing validation logic
    if (
      sseData?.coupons && // Check if coupons data exists
      publicDiscountCode && // Check if input has value
      sseData.coupons[publicDiscountCode] && // Check if code exists in data
      !sseData.coupons[publicDiscountCode].linkedToUser && // Check if it's a public code
      isPublicDiscountCodeUsable() && // Check individual use rules
      !order.discounts.some((d) => d.name === publicDiscountCode) // Check if not already applied
    ) {
      setIsPublicDiscountCodeValid(true);
    } else {
      setIsPublicDiscountCodeValid(false);
    }
    // Keep dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicDiscountCode, sseData, order.discounts]);

  // --- Render ---
  return (
    <section aria-labelledby="discount-code-heading" className={twMerge(sectionWrapperClassname)}>
      <div className="space-y-6">
        {/* --- LINKED DISCOUNT CODE Section --- */}
        {userData &&
          sseData?.coupons &&
          userData.discounts.length > 0 && ( // Added null check for coupons
            <div>
              <Title
                title={t("cartPage.discounts.accountCodesTitle")} // Translated title
                type="h3"
                classname={twMerge(titleClassname, "mb-3 text-base")}
                firstLetterClassname="text-xl"
                id="linked-account-discount-code" // Keep ID for semantics
              />
              {/* List of linked codes */}
              <div className="space-y-2 divide-y divide-gray-200">
                {userData.discounts
                  .filter((name) => sseData.coupons[name]) // Ensure coupon data exists before rendering
                  .map((name, i) => (
                    <DiscountCode key={`${name}-${i}`} name={name} d={sseData.coupons[name]} />
                  ))}
              </div>
            </div>
          )}

        {/* --- PUBLIC DISCOUNT CODE Section --- */}
        <div>
          <Title
            title={t("cartPage.discounts.promoCodeTitle")} // Translated title
            type="h3"
            classname={twMerge(titleClassname, "mb-3 text-base")}
            firstLetterClassname="text-xl"
            id="discount-code-heading" // Keep ID
          />
          {/* Integrated Input/Button */}
          <div className="flex">
            <label htmlFor="public-discount-code" className="sr-only">
              {t("cartPage.discounts.promoCodeTitle")} {/* Translated sr-only label */}
            </label>
            <input
              id="public-discount-code"
              name="public-discount-code"
              type="text"
              value={publicDiscountCode}
              placeholder={t("cartPage.discounts.inputPlaceholder")} // Translated placeholder
              // Convert to uppercase for consistency? Optional: .toUpperCase()
              onChange={(e) => setPublicDiscountCode(e.target.value.trim())}
              className={twMerge(inputClassname, "flex-grow rounded-r-none")} // Use input style
            />
            <button
              type="button" // Prevent form submission if nested
              disabled={!isPublicDiscountCodeValid}
              className={twMerge(buttonClassname, "rounded-l-none")} // Use button style
              onClick={handleUsePublicDiscountCode}
            >
              {t("cartPage.discounts.applyButton")} {/* Translated button text */}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
