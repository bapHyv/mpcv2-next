"use client";

import { twMerge } from "tailwind-merge";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { v4 as uuid } from "uuid";
import Link from "next/link";

import { useAlerts } from "@/app/context/alertsContext";
import { useOrder } from "@/app/context/orderContext";
import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import { sectionWrapperClassname, titleClassname } from "@/app/staticData/cartPageClasses";
import { computeVAT, displayDiscountValue } from "@/app/utils/orderFunctions";
import Title from "@/app/components/Title";
import { useAuth } from "@/app/context/authContext";

export default function CartSummary() {
  const { cart } = useProductsAndCart();
  const { order, setOrder } = useOrder();
  const { addAlert } = useAlerts();
  const { userData } = useAuth();

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

  // Calculate total discount from codes
  const discountsTotal = order.discounts.reduce((total, d) => {
    const value = parseFloat(displayDiscountValue(d, cart.products)); // Get numeric value
    return total + (isNaN(value) ? 0 : value);
  }, 0);

  // Calculate fidelity reduction
  const fidelityReduction = order.fidelity / 10;

  // Calculate final total
  const finalTotal = cart.total - discountsTotal - fidelityReduction;
  const finalTotalClamped = Math.max(0, finalTotal);

  const vatIncluded = computeVAT(cart, finalTotalClamped);

  return (
    <section aria-labelledby="summary-heading" className={twMerge(sectionWrapperClassname)}>
      <Title
        title="Total du panier"
        type="h3"
        classname={twMerge(titleClassname, "mb-4 text-base")}
        firstLetterClassname="text-xl"
        id="summary-heading"
      />

      <dl className="space-y-2 text-sm">
        {/* Sub Total */}
        <div className="flex items-center justify-between">
          <dt className="text-gray-600">Sous-total</dt>
          <dd className="font-medium text-gray-900">{cart.total.toFixed(2)}€</dd>
        </div>

        {/* Applied Discounts */}
        {order.discounts.map((d) => (
          <div key={d.name} className="flex items-center justify-between text-green">
            <dt className="flex items-center text-gray-600">
              <span className="mr-1">Code: {d.name}</span>
              {/* Remove button for discount */}
              <button onClick={() => handleRemoveDiscount(d.name)} aria-label={`Retirer le code ${d.name}`}>
                <XMarkIcon className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer" />
              </button>
            </dt>
            <dd className="font-medium">{displayDiscountValue(d, cart.products)}</dd>
          </div>
        ))}

        {/* Applied Fidelity Points */}
        {order.fidelity > 0 && (
          <div className="flex items-center justify-between text-green">
            <dt className="flex items-center text-gray-600">
              <span className="mr-1">Points fidélité ({order.fidelity})</span>
              {/* Remove button for points */}
              <button onClick={handleRemoveFidelity} aria-label="Retirer les points de fidélité">
                <XMarkIcon className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer" />
              </button>
            </dt>
            <dd className="font-medium">- {fidelityReduction.toFixed(2)}€</dd>
          </div>
        )}

        {/* Separator */}
        <div className="!mt-4 border-t border-gray-200 pt-4">
          {" "}
          {/* TOTAL */}
          <div className="flex items-baseline justify-between text-base font-semibold text-gray-900">
            <dt>Total Panier</dt>
            <dd className="text-right">
              {finalTotalClamped.toFixed(2)}€{/* VAT Info */}
              <p className="text-xs font-normal text-gray-500 mt-0.5">(dont {vatIncluded.toFixed(2)}€ TVA)</p>
            </dd>
          </div>
        </div>
      </dl>

      {/* Checkout Button */}
      <div className="mt-6">
        {/* Check if user is logged in before allowing checkout? */}
        {/* Or handle this on the /expedition page */}
        <Link
          href="/expedition"
          // Make button full width, larger text, more padding
          className={`flex w-full items-center justify-center rounded-md border border-transparent bg-green px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2`}
        >
          Choisir la méthode d&apos;expedition
        </Link>

        {/* Optional: Add login prompt if not logged in and trying to check out */}
        {!userData && (
          <p className="text-center text-xs text-gray-500 mt-2">
            <Link href="/connexion?redirect=expedition" className="underline hover:text-green">
              Connectez-vous
            </Link>{" "}
            pour continuer.
          </p>
        )}
      </div>
    </section>
  );
}
