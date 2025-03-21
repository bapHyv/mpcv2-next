"use client";

import { twMerge } from "tailwind-merge";
import { useEffect, useMemo } from "react";

import Star from "@/app/components/Star";
import Title from "@/app/components/Title";

import { useSse } from "@/app/context/sseContext";
import { useOrder } from "@/app/context/orderContext";
import { useProductsAndCart } from "@/app/context/productsAndCartContext";

import { sectionClassname, titleClassname } from "@/app/staticData/cartPageClasses";
import { inputCN } from "@/app/staticData/orderPageClasses";
import { isBoxtalConnectMethod, isFlatRateMethod, isFreeShippingMethod, isLocalPickupMethod } from "@/app/utils/typeGuardsFunctions";
import { ShippingMethod } from "@/app/types/sseTypes";
import { findLowestVATRate } from "@/app/utils/orderFunctions";
import ParcelPointMapComponent from "@/app/components/orderPage/ParcelPointMapComponent";

export default function Shipping() {
  const { sseData } = useSse();
  const { order, handleChange } = useOrder();
  const { cart } = useProductsAndCart();

  const hasFreeShipping = useMemo(() => {
    return order.discounts.some((d) => ("freeShipping" in d ? d.freeShipping : false));
  }, [order.discounts]);

  const filteredMethods: ShippingMethod[] = useMemo(() => {
    if (sseData && order.shippingAddress.country) {
      return sseData.shippingMethods.byShippingZones[order.shippingAddress.country].methods.filter((m) => {
        if (isBoxtalConnectMethod(m) || isLocalPickupMethod(m)) {
          return true;
        } else if (isFreeShippingMethod(m)) {
          const cond1 = m.ignore_discounts === "yes" && cart.total >= parseInt(m.min_amount);
          const cond2 = m.ignore_discounts === "no" && order["sub-total"] >= parseInt(m.min_amount);
          if (cond1 || cond2 || hasFreeShipping) {
            return true;
          } else {
            return false;
          }
        } else if (isFlatRateMethod(m)) {
          const priceThreshold = sseData.shippingMethods.byShippingZones[order.shippingAddress.country].priceThreshold;
          if (!priceThreshold) return true;
          const lowestVATRate = findLowestVATRate(cart.products);
          const isCartTotalBelowPriceThreshold = cart.total < priceThreshold * (1 + lowestVATRate / 100);
          if (!hasFreeShipping || isCartTotalBelowPriceThreshold) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      });
    } else {
      return [];
    }
  }, [cart.products, cart.total, hasFreeShipping, order.shippingAddress.country, order["sub-total"], sseData]);

  const methods: JSX.Element[] = useMemo(() => {
    const VATRate = 1 + findLowestVATRate(cart.products) / 100;

    return filteredMethods.map((m) => {
      if (isLocalPickupMethod(m)) {
        return (
          <div key={m.type + m.instanceId} className="flex gap-x-2 items-center">
            <input
              type="radio"
              id={`shipping-method-${m.type}`}
              name="shipping-method"
              value={m.instanceId}
              checked={order.shippingMethodId === m.instanceId}
              required
              onChange={(e) => handleChange(e, { shippingCost: 0, shippingMethod: m.type })}
              className={inputCN}
            />
            <label className="cursor-pointer" htmlFor={`shipping-method-${m.type}`}>
              {m.title}
            </label>
          </div>
        );
      } else if (isBoxtalConnectMethod(m)) {
        const computedThreshold = Math.round(m.priceThreshold * VATRate);
        const isFree = cart.total > computedThreshold || hasFreeShipping;
        return (
          <div key={m.type + m.instanceId} className="flex gap-x-2 items-center">
            <input
              type="radio"
              id={`shipping-method-${m.type}`}
              name="shipping-method"
              value={m.instanceId}
              checked={order.shippingMethodId === m.instanceId}
              required
              onChange={(e) => handleChange(e, { shippingCost: isFree ? 0 : Math.ceil(m.cost), shippingMethod: m.type })}
              className={inputCN}
            />
            <label className="cursor-pointer" htmlFor={`shipping-method-${m.type}`}>
              {m.title}
              {isFree ? "" : `: ${Math.ceil(m.cost).toFixed(2)}€`}{" "}
              {!isFree && <span className="text-neutral-500 italic text-sm">(Livraison gratuite à partir de {computedThreshold.toFixed(2)}€)</span>}
            </label>
          </div>
        );
      } else if (isFreeShippingMethod(m)) {
        return (
          <div key={m.type + m.instanceId} className="flex gap-x-2 items-center">
            <input
              type="radio"
              id={`shipping-method-${m.type}`}
              name="shipping-method"
              value={m.instanceId}
              checked={order.shippingMethodId === m.instanceId}
              required
              onChange={(e) => handleChange(e, { shippingCost: 0, shippingMethod: m.type })}
              className={inputCN}
            />
            <label className="cursor-pointer" htmlFor={`shipping-method-${m.type}`}>
              {m.title}
            </label>
          </div>
        );
      } else if (isFlatRateMethod(m)) {
        const priceThreshold = sseData?.shippingMethods.byShippingZones[order.shippingAddress.country].priceThreshold;
        const computedThreshold = priceThreshold ? Math.round(priceThreshold * VATRate) : 0;

        return (
          <div key={m.type + m.instanceId} className="flex gap-x-2 items-center">
            <input
              type="radio"
              id={`shipping-method-${m.type}`}
              name="shipping-method"
              value={m.instanceId}
              checked={order.shippingMethodId === m.instanceId}
              required
              onChange={(e) => handleChange(e, { shippingCost: Math.ceil(parseFloat(m.cost)), shippingMethod: m.type })}
              className={inputCN}
            />
            <label className="cursor-pointer" htmlFor={`shipping-method-${m.type}`}>
              {m.title}: {Math.ceil(parseFloat(m.cost)).toFixed(2)}€{" "}
              {!!computedThreshold && (
                <span className="text-neutral-500 italic text-sm">(Livraison gratuite à partir de {computedThreshold.toFixed(2)}€)</span>
              )}
            </label>
          </div>
        );
      } else {
        return <></>;
      }
    });
  }, [
    cart.products,
    cart.total,
    filteredMethods,
    handleChange,
    hasFreeShipping,
    order.shippingAddress.country,
    order.shippingMethodId,
    sseData?.shippingMethods.byShippingZones,
  ]);

  return (
    <div aria-labelledby="expedition" className={twMerge(sectionClassname)}>
      {order.shippingAddress.country === "France (hors Corse)" && order["shipping-method"] === "boxtal_connect" && <ParcelPointMapComponent />}
      <fieldset>
        <legend className="flex gap-x-1">
          <Title title="Expedition" type="h2" classname={twMerge(titleClassname)} firstLetterClassname="text-2xl" id="linked-account-discount-code" />
          <Star />
        </legend>
        {methods}
      </fieldset>
    </div>
  );
}
