import { twMerge } from "tailwind-merge";
import { useEffect, useMemo, useState } from "react";

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
          const cond2 = m.ignore_discounts === "no" && order.total >= parseInt(m.min_amount);
          if (cond1 || cond2 || hasFreeShipping) {
            return true;
          } else {
            return false;
          }
        } else if (isFlatRateMethod(m)) {
          if (hasFreeShipping) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      });
    } else {
      return [];
    }
  }, [cart.total, hasFreeShipping, order.shippingAddress.country, order.total, sseData]);

  const methods: JSX.Element[] = useMemo(() => {
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
              onChange={(e) => handleChange(e, 0)}
              className={inputCN}
            />
            <label className="cursor-pointer" htmlFor={`shipping-method-${m.type}`}>
              {m.title}
            </label>
          </div>
        );
      } else if (isBoxtalConnectMethod(m)) {
        const lowestVATRate = findLowestVATRate(cart.products);
        const isFree = cart.total > Math.round(m.priceThreshold * (1 + lowestVATRate / 100)) || hasFreeShipping;
        return (
          <div key={m.type + m.instanceId} className="flex gap-x-2 items-center">
            <input
              type="radio"
              id={`shipping-method-${m.type}`}
              name="shipping-method"
              value={m.instanceId}
              checked={order.shippingMethodId === m.instanceId}
              required
              onChange={(e) => handleChange(e, isFree ? 0 : Math.ceil(m.cost))}
              className={inputCN}
            />
            <label className="cursor-pointer" htmlFor={`shipping-method-${m.type}`}>
              {m.title}
              {isFree ? "" : `: ${Math.ceil(m.cost).toFixed(2)}€`}
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
              onChange={(e) => handleChange(e, 0)}
              className={inputCN}
            />
            <label className="cursor-pointer" htmlFor={`shipping-method-${m.type}`}>
              {m.title}
            </label>
          </div>
        );
      } else if (isFlatRateMethod(m)) {
        return (
          <div key={m.type + m.instanceId} className="flex gap-x-2 items-center">
            <input
              type="radio"
              id={`shipping-method-${m.type}`}
              name="shipping-method"
              value={m.instanceId}
              checked={order.shippingMethodId === m.instanceId}
              required
              onChange={(e) => handleChange(e, Math.ceil(parseFloat(m.cost)))}
              className={inputCN}
            />
            <label className="cursor-pointer" htmlFor={`shipping-method-${m.type}`}>
              {m.title}: {Math.ceil(parseFloat(m.cost)).toFixed(2)}€
            </label>
          </div>
        );
      } else {
        return <></>;
      }
    });
  }, [cart.products, cart.total, filteredMethods, handleChange, hasFreeShipping, order.shippingMethodId]);

  return (
    <div aria-labelledby="expedition" className={twMerge(sectionClassname)}>
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
