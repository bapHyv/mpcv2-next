"use client";

import { twMerge } from "tailwind-merge";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { v4 as uuid } from "uuid";
import Link from "next/link";

import { useAlerts } from "@/app/context/alertsContext";
import { useOrder } from "@/app/context/orderContext";
import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import { sectionClassname, titleClassname } from "@/app/staticData/cartPageClasses";
import { computeVAT, displayDiscountValue } from "@/app/utils/orderFunctions";
import Title from "@/app/components/Title";

export default function CartSummary() {
  const { cart } = useProductsAndCart();
  const { order, setOrder } = useOrder();
  const { addAlert } = useAlerts();

  const handleRemoveDiscount = (name: string) => {
    setOrder((prevState) => {
      return {
        ...prevState,
        discounts: prevState.discounts.filter((e) => e.name !== name),
      };
    });
    addAlert(uuid(), `Discount code ${name} has been removed`, "Discount code removed", "yellow");
  };

  return (
    <section aria-labelledby="summary-heading" className={twMerge(sectionClassname, "pb-6")}>
      <Title title="Total du panier" type="h2" classname={twMerge(titleClassname)} firstLetterClassname="text-2xl" id="summary-heading" />

      {/* SUB TOTAL */}
      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">Sous-total</dt>
          <dd className="text-sm font-medium text-gray-900">{cart.total.toFixed(2)}€</dd>
        </div>
        {order.discounts.map((d) => (
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

        {order.fidelity ? (
          <div className="flex items-center justify-between">
            <dt className="text-sm text-gray-600">Points de fidélité</dt>
            <div className="flex gap-x-2 justify-center">
              <div>
                <span className="text-sm font-medium text-gray-900">{(order.fidelity / 10).toFixed(2)}€</span>
              </div>
              <XMarkIcon
                onClick={() => setOrder((prevState) => ({ ...prevState, fidelity: 0 }))}
                type="button"
                className="w-5 h-5 text-red-600 cursor-pointer"
              />
            </div>
          </div>
        ) : null}

        {/* TOTAL */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="text-base font-medium text-gray-900">Total panier</dt>
          <dd className="text-base font-medium text-gray-900">
            {order["sub-total"].toFixed(2)}€
            <span className="text-neutral-500 text-xs italic">(dont {computeVAT(cart, cart.total - order["sub-total"]).toFixed(2)}€ TVA)</span>
          </dd>
        </div>
      </dl>

      <div className="mt-6 w-full flex justify-end">
        <Link
          href="/expedition"
          className={`w-full mt-6 rounded-md border border-transparent bg-green text-center px-4 py-3 text-base font-medium text-white shadow-sm 
          hover:bg-dark-green focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-50`}
        >
          Choisir la méthode d&apos;expedition
        </Link>
      </div>
    </section>
  );
}
