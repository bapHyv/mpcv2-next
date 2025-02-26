"use client";

import { twMerge } from "tailwind-merge";
import Title from "../Title";
import { sectionClassname, titleClassname } from "@/app/staticData/cartPageClasses";
import { QuestionMarkCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import { useMemo } from "react";
import { useOrder } from "@/app/context/orderContext";
import { computePercent } from "@/app/utils/orderFunctions";

// TTC / (1 + (VATRate/100)) = HT
// ttc - ht = tva
// lorsque plusieurs taux tva, appliquer la plus basse

export default function CartSummary() {
  const { cart } = useProductsAndCart();
  const { order, fidelityPointsUsed, setFidelityPointsUsed, discountApplied, setDiscountApplied } = useOrder();

  const subtotal = useMemo(() => {
    return cart.products.reduce((acc, val) => {
      return val.totalPrice / (1 + val.VATRate / 100);
    }, 0);
  }, [cart]);

  const vat = useMemo(() => {
    return cart.products.reduce((acc, val) => {
      return (val.VATRate / 100) * val.totalPrice;
    }, 0);
  }, [cart]);

  const handleRemoveDiscount = (name: string) => {
    setDiscountApplied((prevState) => prevState.filter((e) => e.name !== name));
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
                <span className="text-sm font-medium text-gray-900">
                  {d.type === "percent"
                    ? `-${computePercent(cart.total, parseInt(d.value)).toFixed(2)}€`
                    : d.type === "fixed_cart"
                    ? `-${d.value}€`
                    : ""}
                </span>
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
            <span className="text-neutral-500 text-xs italic">(dont {(cart.total - subtotal).toFixed(2)}€ TVA)</span>
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
