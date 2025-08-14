"use client";

import React, { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { useTranslations } from "next-intl";

import Star from "@/app/components/Star";
import Title from "@/app/components/Title";
import { useSse } from "@/app/context/sseContext";
import { useOrder } from "@/app/context/orderContext";
import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import { sectionWrapperClassname, titleClassname, checkRadioClassname } from "@/app/staticData/cartPageClasses";
import { isBoxtalConnectMethod, isFlatRateMethod, isFreeShippingMethod, isLocalPickupMethod } from "@/app/utils/typeGuardsFunctions";
import { ShippingMethod } from "@/app/types/sseTypes";
import { findLowestVATRate } from "@/app/utils/orderFunctions";

export default function Shipping() {
  const t = useTranslations("shippingPage.shippingMethods");
  const { sseData } = useSse();
  const { order, handleChange } = useOrder();
  const { cart } = useProductsAndCart();

  const hasFreeShipping = useMemo(() => {
    return order.discounts.some((d) => ("freeShipping" in d ? d.freeShipping : false));
  }, [order.discounts]);

  const filteredMethods: ShippingMethod[] = useMemo(() => {
    // Original logic with added null checks and enabled check
    if (
      sseData?.shippingMethods?.byShippingZones &&
      order.shippingAddress.country &&
      sseData.shippingMethods.byShippingZones[order.shippingAddress.country]
    ) {
      return sseData.shippingMethods.byShippingZones[order.shippingAddress.country].methods.filter((m) => {
        if (isBoxtalConnectMethod(m)) {
          return false;
        } else if (isLocalPickupMethod(m)) {
          return true;
        } else if (isFreeShippingMethod(m)) {
          if (hasFreeShipping) return true;
          // Handle min_amount safely
          const minAmount = m.min_amount ? parseInt(m.min_amount, 10) : 0;
          const amountToCheck = m.ignore_discounts === "yes" ? cart.total : order["sub-total"];
          return amountToCheck >= minAmount;
        } else if (isFlatRateMethod(m)) {
          const zoneData = sseData.shippingMethods.byShippingZones[order.shippingAddress.country];
          const priceThreshold = zoneData?.priceThreshold;

          if (hasFreeShipping) return false;
          if (!priceThreshold) return true;
          if (priceThreshold * 1.055 < cart.total) return false;
          return true;
        } else {
          // Default case for unknown method types (shouldn't happen with guards)
          return false; // Or true depending on desired behavior
        }
      });
    } else {
      return []; // Return empty array if data is missing
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.products, cart.total, hasFreeShipping, order.shippingAddress.country, order["sub-total"], sseData]);

  const methods: JSX.Element[] = useMemo(() => {
    if (!cart.products || cart.products.length === 0 || !sseData) return [];
    const VATRate = 1 + findLowestVATRate(cart.products) / 100;

    return filteredMethods.map((m) => {
      let cost = 0;
      let isFree = false;
      let computedThreshold = 0;
      let costText = "";

      if (isLocalPickupMethod(m)) {
        cost = 0;
        isFree = true;
        costText = t("costFree");
      } else if (isBoxtalConnectMethod(m)) {
        computedThreshold = Math.round(m.priceThreshold * VATRate);
        isFree = cart.total >= computedThreshold || hasFreeShipping;
        cost = isFree ? 0 : Math.ceil(m.cost);
        costText = isFree ? t("costFree") : `${cost.toFixed(2)}€`;
      } else if (isFreeShippingMethod(m)) {
        cost = 0;
        isFree = true;
        costText = t("costFree");
      } else if (isFlatRateMethod(m)) {
        const zoneData = sseData.shippingMethods.byShippingZones[order.shippingAddress.country];
        const priceThreshold = zoneData?.priceThreshold;
        computedThreshold = priceThreshold ? Math.round(priceThreshold * VATRate) : 0;
        isFree = hasFreeShipping && (computedThreshold === 0 || cart.total >= computedThreshold);
        const parsedCost = parseFloat(m.cost || "0");
        cost = isFree ? 0 : Math.ceil(isNaN(parsedCost) ? 0 : parsedCost);
        costText = isFree ? t("costFree") : `${cost.toFixed(2)}€`;
      }

      const value = m.instanceId.toString();
      const id = `shipping-method-${m.instanceId}`;

      return (
        <div
          key={value}
          className="relative flex items-start border border-gray-200 rounded-md p-3 has-[:checked]:border-green has-[:checked]:ring-1 has-[:checked]:ring-green"
        >
          <div className="flex h-6 items-center">
            <input
              id={id}
              name="shipping-method"
              type="radio"
              value={value}
              checked={order.shippingMethodId === m.instanceId}
              required
              onChange={(e) => handleChange(e, { shippingCost: cost, shippingMethod: m.type })}
              className={checkRadioClassname}
            />
          </div>
          <div className="ml-3 text-sm leading-6 flex-grow">
            <label htmlFor={id} className="font-medium text-gray-900 cursor-pointer flex justify-between w-full">
              <span>{m.title}</span>
              <span className="font-semibold">{costText}</span>
            </label>
            {computedThreshold > 0 && !isFree && (
              <p id={`${id}-description`} className="text-gray-500 text-xs mt-1">
                {t("thresholdText", { amount: computedThreshold.toFixed(2) })}
              </p>
            )}
          </div>
        </div>
      );
    });
  }, [cart.products, cart.total, filteredMethods, handleChange, hasFreeShipping, order.shippingAddress.country, order.shippingMethodId, sseData, t]);

  return (
    <section aria-labelledby="shipping-heading" className={twMerge(sectionWrapperClassname)}>
      <Title
        title={t("title")}
        type="h3"
        classname={twMerge(titleClassname, "mb-4 text-base")}
        firstLetterClassname="text-xl"
        id="shipping-heading"
      />

      <fieldset>
        <legend className="sr-only">
          {t("legendSR")} {<Star />}
        </legend>
        <div className="space-y-4">
          {methods.length > 0 ? (
            methods
          ) : (
            <p className="text-sm text-gray-500 p-3 border border-dashed rounded-md">
              {order.shippingAddress.country ? t("noMethodsAvailableText") : t("selectCountryText")}
            </p>
          )}
        </div>
      </fieldset>
    </section>
  );
}
