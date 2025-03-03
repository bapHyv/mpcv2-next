"use client";

import { twMerge } from "tailwind-merge";
import Title from "../Title";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useMemo } from "react";
import { v4 as uuid } from "uuid";

import { useAlerts } from "@/app/context/alertsContext";
import { useOrder } from "@/app/context/orderContext";
import { ProductCart, useProductsAndCart } from "@/app/context/productsAndCartContext";
import { sectionClassname, titleClassname } from "@/app/staticData/cartPageClasses";
import { DiscountApplied } from "@/app/types/orderTypes";
import { computeFixedProductDiscount, computePercentDiscount, computeVAT } from "@/app/utils/orderFunctions";

// TTC / (1 + (VATRate/100)) = HT
// ttc - ht = tva
// lorsque plusieurs taux tva, appliquer la plus basse

export default function CartSummary() {
  const { cart } = useProductsAndCart();
  const { order, fidelityPointsUsed, setFidelityPointsUsed, discountApplied, setDiscountApplied } = useOrder();
  const { addAlert } = useAlerts();

  const subtotal = useMemo(() => {
    return cart.products.reduce((acc, val) => {
      return val.totalPrice / (1 + val.VATRate / 100);
    }, 0);
  }, [cart]);

  const handleRemoveDiscount = (name: string) => {
    setDiscountApplied((prevState) => prevState.filter((e) => e.name !== name));
    addAlert(uuid(), `Discount code ${name} has been removed`, "Discount code removed", "yellow");
  };

  const displayDiscountValue = (d: DiscountApplied, products: ProductCart[]) => {
    switch (d.discountType) {
      case "fixed_cart":
        return `-${d.discountValue}€`;
      case "percent":
        return `-${computePercentDiscount(d, products).toFixed(2)}€`;
      case "fixed_product":
        return `-${computeFixedProductDiscount(d, products).toFixed(2)}€`;
      default:
        return "";
    }
  };

  return (
    <section aria-labelledby="summary-heading" className={twMerge(sectionClassname)}>
      <Title title="Total du panier" type="h2" classname={twMerge(titleClassname)} firstLetterClassname="text-2xl" id="summary-heading" />

      {/* SUB TOTAL */}
      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">Sous-total</dt>
          <dd className="text-sm font-medium text-gray-900">{cart.total.toFixed(2)}€</dd>
        </div>
        {discountApplied.map((d) => (
          <div key={d.name} className="flex items-center justify-between">
            <dt className="text-sm text-gray-600">{d.name}</dt>
            <div className="flex gap-x-2 justify-center">
              <div>
                <span className="text-sm font-medium text-gray-900">{displayDiscountValue(d, cart.products)}</span>
              </div>
              <XMarkIcon onClick={() => handleRemoveDiscount(d.name)} type="button" className="w-5 h-5 text-red-600 cursor-pointer" />
            </div>
          </div>
        ))}

        {fidelityPointsUsed ? (
          <div className="flex items-center justify-between">
            <dt className="text-sm text-gray-600">Points de fidélité</dt>
            <div className="flex gap-x-2 justify-center">
              <div>
                <span className="text-sm font-medium text-gray-900">{(fidelityPointsUsed / 10).toFixed(2)}€</span>
              </div>
              <XMarkIcon onClick={() => setFidelityPointsUsed(0)} type="button" className="w-5 h-5 text-red-600 cursor-pointer" />
            </div>
          </div>
        ) : null}

        {/* TOTAL */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="text-base font-medium text-gray-900">Total panier</dt>
          <dd className="text-base font-medium text-gray-900">
            {order.total.toFixed(2)}€{/* VAT */}
            <span className="text-neutral-500 text-xs italic">(dont {computeVAT(cart, cart.total - order.total).toFixed(2)}€ TVA)</span>
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <button
          type="submit"
          className={`w-full rounded-md border border-transparent bg-green px-4 py-3 text-base font-medium text-white shadow-sm 
                  hover:bg-dark-green focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-50`}
        >
          Commander
        </button>
      </div>
    </section>
  );
}
