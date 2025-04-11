// OrderSummary.tsx
"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { twMerge } from "tailwind-merge";
import { v4 as uuid } from "uuid";

import Title from "@/app/components/Title";
import { useAlerts } from "@/app/context/alertsContext";
import { useOrder } from "@/app/context/orderContext";
import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import { sectionWrapperClassname, titleClassname } from "@/app/staticData/cartPageClasses";
import { displayDiscountValue } from "@/app/utils/orderFunctions";

export default function OrderSummary() {
  const { order, setOrder } = useOrder();
  const { addAlert } = useAlerts();
  const { cart } = useProductsAndCart();

  const handleRemoveDiscount = (name: string) => {
    setOrder((prevState) => ({
      ...prevState,
      discounts: prevState.discounts.filter((e) => e.name !== name),
    }));
    addAlert(uuid(), `Code promo ${name} retiré`, "Code promo retiré", "yellow");
  };

  const handleRemoveFidelity = () => {
    setOrder((prevState) => ({ ...prevState, fidelity: 0 }));
    addAlert(uuid(), "Points de fidélité retirés", "Points retirés", "yellow");
  };

  return (
    <section aria-labelledby="order-summary-heading" className={twMerge(sectionWrapperClassname)}>
      <Title
        title="Votre commande"
        type="h3"
        classname={twMerge(titleClassname, "mb-4 text-base")}
        firstLetterClassname="text-xl"
        id="order-summary-heading"
      />

      <dl className="space-y-3 text-sm">
        <div className="flex justify-between font-medium text-gray-900 border-b border-gray-200 pb-2">
          <dt>Produits</dt>
          <dd>Sous-total</dd>
        </div>
        <div className="space-y-1">
          {Object.values(order.products).flatMap((orderPArray) =>
            orderPArray.map((p) => (
              <div key={`${p.label}-${p.option}`} className="flex justify-between items-center text-gray-700">
                <span className="flex-1 mr-2">
                  {`${p.label} (${p.option}${p.per === "g" ? "g" : "u"})`}
                  <span className="text-gray-500 ml-1"> x {p.quantity}</span>
                </span>
                <span className="font-medium whitespace-nowrap">{p.totalPrice.toFixed(2)}€</span>
              </div>
            ))
          )}
        </div>
        {/* Separator */}
        <div className="border-t border-gray-200 !mt-3 pt-3"></div> {/* Separator */}
        {/* Discounts */}
        {order.discounts.length > 0 && (
          <div className="space-y-1">
            <dt className="font-medium text-gray-900">Réductions appliquées</dt>
            {order.discounts.map((d) => (
              <div key={d.name} className="flex justify-between items-center text-green">
                <span className="flex items-center text-gray-600">
                  <span className="mr-1">{d.name}</span>
                  <button onClick={() => handleRemoveDiscount(d.name)} aria-label={`Retirer ${d.name}`}>
                    <XMarkIcon className="w-4 h-4 text-red-500 hover:text-red-700" />
                  </button>
                </span>
                <span className="font-medium">{displayDiscountValue(d, cart.products)}</span>
              </div>
            ))}
          </div>
        )}
        {/* Fidelity Points */}
        {order.fidelity > 0 && (
          <div className="space-y-1">
            {order.discounts.length > 0 && <div className="border-t border-gray-200 !mt-3 pt-3"></div>}
            <dt className="font-medium text-gray-900">Points fidélité</dt>
            <div className="flex justify-between items-center text-green">
              <span className="flex items-center text-gray-600">
                <span className="mr-1">{order.fidelity} points</span>
                <button onClick={handleRemoveFidelity} aria-label="Retirer les points">
                  <XMarkIcon className="w-4 h-4 text-red-500 hover:text-red-700" />
                </button>
              </span>
              <span className="font-medium">{(order.fidelity / 10).toFixed(2)}€</span>
            </div>
          </div>
        )}
        {/* Separator */}
        <div className="border-t border-gray-200 !mt-3 pt-3"></div> {/* Separator */}
        {/* Subtotal */}
        <div className="flex justify-between font-medium text-gray-900">
          <dt>Sous-total produits</dt>
          <dd>{order["sub-total"].toFixed(2)}€</dd>
        </div>
      </dl>
    </section>
  );
}
