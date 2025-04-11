/* eslint-disable react-hooks/exhaustive-deps */
// Shipping.tsx - Corrected and Styled
"use client";

import React, { useMemo } from "react"; // Added React import
import { twMerge } from "tailwind-merge";

import Star from "@/app/components/Star";
import Title from "@/app/components/Title";
import ParcelPointMapComponent from "@/app/components/shippingPage/ParcelPointMapComponent";
import { useSse } from "@/app/context/sseContext";
import { useOrder } from "@/app/context/orderContext";
import { useProductsAndCart } from "@/app/context/productsAndCartContext";
// Import refined classes from cartPageClasses
import { sectionWrapperClassname, titleClassname, checkRadioClassname } from "@/app/staticData/cartPageClasses";
// Keep type guards and helpers
import { isBoxtalConnectMethod, isFlatRateMethod, isFreeShippingMethod, isLocalPickupMethod } from "@/app/utils/typeGuardsFunctions";
import { ShippingMethod } from "@/app/types/sseTypes";
import { findLowestVATRate } from "@/app/utils/orderFunctions";
// Removed inputCN import as it's not used

export default function Shipping() {
  // Keep hooks
  const { sseData } = useSse();
  const { order, handleChange } = useOrder(); // Keep handleChange
  const { cart } = useProductsAndCart();

  // --- Reinstated Original Logic ---
  const hasFreeShipping = useMemo(() => {
    // Original logic
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
        // Skip methods that are not explicitly enabled in backend data if 'enabled' property exists
        if ("enabled" in m && !m.enabled) {
          return false;
        }

        if (isBoxtalConnectMethod(m) || isLocalPickupMethod(m)) {
          return true; // Always show these if enabled
        } else if (isFreeShippingMethod(m)) {
          // Handle min_amount safely
          const minAmount = m.min_amount ? parseInt(m.min_amount, 10) : 0;
          if (isNaN(minAmount)) {
            // If minAmount is invalid, show only if a free shipping coupon is active
            return hasFreeShipping;
          }
          const amountToCheck = m.ignore_discounts === "yes" ? cart.total : order["sub-total"];
          return amountToCheck >= minAmount || hasFreeShipping; // Show if threshold met OR coupon active
        } else if (isFlatRateMethod(m)) {
          const zoneData = sseData.shippingMethods.byShippingZones[order.shippingAddress.country];
          const priceThreshold = zoneData?.priceThreshold;
          // If no threshold defined for the zone, always show flat rate
          if (!priceThreshold) return true;

          // If user has free shipping coupon, we need to check the threshold
          if (hasFreeShipping) {
            const lowestVATRate = findLowestVATRate(cart.products);
            // Calculate threshold including VAT
            const thresholdWithVAT = priceThreshold * (1 + lowestVATRate / 100);
            // Hide flat rate ONLY if the cart total meets or exceeds the threshold
            return cart.total < thresholdWithVAT;
          }
          // If no free shipping coupon, always show flat rate
          return true;
        } else {
          // Default case for unknown method types (shouldn't happen with guards)
          return false; // Or true depending on desired behavior
        }
      });
    } else {
      return []; // Return empty array if data is missing
    }
    // Original dependencies are correct here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.products, cart.total, hasFreeShipping, order.shippingAddress.country, order["sub-total"], sseData]);

  const methods: JSX.Element[] = useMemo(() => {
    // Check required data early
    if (!cart.products || cart.products.length === 0 || !sseData) return [];

    const VATRate = 1 + findLowestVATRate(cart.products) / 100;

    return filteredMethods.map((m) => {
      let cost = 0;
      let isFree = false;
      let computedThreshold = 0;
      let costText = "";
      const currentShippingMethodType = order["shipping-method"]; // Get the type stored in the order

      // --- Reinstated Original Cost/Free Calculation Logic ---
      if (isLocalPickupMethod(m)) {
        cost = 0;
        isFree = true;
        costText = "Gratuit";
      } else if (isBoxtalConnectMethod(m)) {
        computedThreshold = Math.round(m.priceThreshold * VATRate);
        // Check if free based on threshold OR if a free shipping coupon is active
        isFree = cart.total >= computedThreshold || hasFreeShipping;
        cost = isFree ? 0 : Math.ceil(m.cost); // Ensure cost is number
        costText = isFree ? "Gratuit" : `${cost.toFixed(2)}€`;
      } else if (isFreeShippingMethod(m)) {
        cost = 0;
        isFree = true;
        costText = "Gratuit";
      } else if (isFlatRateMethod(m)) {
        const zoneData = sseData.shippingMethods.byShippingZones[order.shippingAddress.country];
        const priceThreshold = zoneData?.priceThreshold;
        computedThreshold = priceThreshold ? Math.round(priceThreshold * VATRate) : 0;
        // Determine if free: Needs free shipping coupon AND threshold met (if threshold exists)
        isFree = hasFreeShipping && (computedThreshold === 0 || cart.total >= computedThreshold);
        // Ensure m.cost is treated as string then parsed, default to 0 if invalid
        const parsedCost = parseFloat(m.cost || "0");
        cost = isFree ? 0 : Math.ceil(isNaN(parsedCost) ? 0 : parsedCost);
        costText = isFree ? "Gratuit" : `${cost.toFixed(2)}€`;
      }

      const value = m.instanceId.toString(); // Ensure value is string for comparison/input value
      const id = `shipping-method-${m.instanceId}`;

      return (
        // --- Applying new styling structure ---
        <div
          key={value}
          className="relative flex items-start border border-gray-200 rounded-md p-3 has-[:checked]:border-green has-[:checked]:ring-1 has-[:checked]:ring-green" // Container styling
        >
          <div className="flex h-6 items-center">
            <input
              id={id}
              name="shipping-method"
              type="radio"
              value={value} // Input value is the instanceId
              checked={order.shippingMethodId === m.instanceId} // Check against instanceId
              required
              // Pass calculated cost and method type to handleChange
              onChange={(e) => handleChange(e, { shippingCost: cost, shippingMethod: m.type })}
              className={checkRadioClassname} // Apply consistent radio style
            />
          </div>
          <div className="ml-3 text-sm leading-6 flex-grow">
            {" "}
            {/* Use flex-grow */}
            <label htmlFor={id} className="font-medium text-gray-900 cursor-pointer flex justify-between w-full">
              {" "}
              {/* Label fills width */}
              <span>{m.title}</span>
              <span className="font-semibold">{costText}</span> {/* Show cost on the right */}
            </label>
            {/* Optional Threshold info */}
            {computedThreshold > 0 && !isFree && (
              <p id={`${id}-description`} className="text-gray-500 text-xs mt-1">
                (Gratuit dès {computedThreshold.toFixed(2)}€ d&apos;achat)
              </p>
            )}
          </div>
        </div>
      );
    });
    // --- Original dependencies seem correct ---
  }, [
    cart.products,
    cart.total,
    filteredMethods,
    handleChange,
    hasFreeShipping,
    order.shippingAddress.country,
    order.shippingMethodId,
    order["sub-total"],
    sseData,
  ]);

  return (
    // Use standard section wrapper
    <section aria-labelledby="shipping-heading" className={twMerge(sectionWrapperClassname)}>
      <Title
        title="Expedition"
        type="h3" // h3 for hierarchy
        classname={twMerge(titleClassname, "mb-4 text-base")}
        firstLetterClassname="text-xl"
        id="shipping-heading"
      />

      {/* Conditional Map Component */}
      {/* Check order['shipping-method'] for the *type* */}
      {order.shippingAddress.country === "France (hors Corse)" && order["shipping-method"] === "boxtal_connect" && (
        <div className="mb-4 border rounded-md overflow-hidden shadow-sm">
          {" "}
          {/* Added shadow */}
          <ParcelPointMapComponent />
        </div>
      )}

      {/* Radio button group */}
      <fieldset>
        {/* Added Star to legend */}
        <legend className="sr-only">Méthodes d&apos;expédition {<Star />}</legend>
        {/* Add spacing between radio options */}
        <div className="space-y-4">
          {methods.length > 0 ? (
            methods
          ) : (
            <p className="text-sm text-gray-500 p-3 border border-dashed rounded-md">
              {order.shippingAddress.country
                ? "Aucune méthode d'expédition disponible pour l'adresse sélectionnée."
                : "Veuillez sélectionner un pays de livraison dans l'adresse ci-dessus pour voir les options."}
            </p>
          )}
        </div>
      </fieldset>
    </section>
  );
}
