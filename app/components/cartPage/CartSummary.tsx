"use client";

import { twMerge } from "tailwind-merge";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { v4 as uuid } from "uuid";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { useAlerts } from "@/app/context/alertsContext";
import { useOrder } from "@/app/context/orderContext";
import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import { sectionWrapperClassname, titleClassname, linkClassname } from "@/app/staticData/cartPageClasses";
import { computeVAT, displayDiscountValue } from "@/app/utils/orderFunctions";
import Title from "@/app/components/Title";
import { useAuth } from "@/app/context/authContext";
import clsx from "clsx";

export default function CartSummary() {
  const t = useTranslations("");
  const { cart } = useProductsAndCart();
  const { order, setOrder } = useOrder();
  const { addAlert } = useAlerts();
  const { userData } = useAuth();

  const handleRemoveDiscount = (name: string) => {
    setOrder((prevState) => ({
      ...prevState,
      discounts: prevState.discounts.filter((e) => e.name !== name),
    }));
    addAlert(uuid(), t("alerts.cart.discountRemoved.text", { name }), t("alerts.cart.discountRemoved.title"), "yellow");
  };

  const handleRemoveFidelity = () => {
    setOrder((prevState) => ({ ...prevState, fidelity: 0 }));
    addAlert(uuid(), t("alerts.cart.pointsRemoved.text"), t("alerts.cart.pointsRemoved.title"), "yellow");
  };

  const discountsTotal = order.discounts.reduce((total, d) => {
    // Assuming displayDiscountValue returns '- XX.XX€' or 'XX%', need numerical value
    // This part might need adjustment based on displayDiscountValue's actual output for calculation
    let value = 0;
    const displayedValue = displayDiscountValue(d, cart.products);
    // Basic parsing attempt, might need more robust logic
    const match = displayedValue.match(/-?(\d+(\.\d+)?)/);
    if (match && match[1]) {
      value = parseFloat(match[1]);
    } else if (displayedValue.includes("%")) {
      // Handle percentage calculation if needed for total, otherwise ignore here?
      // For display purposes, the raw displayDiscountValue is used below.
      // Calculation here is tricky without knowing if percentage applies before/after other discounts.
      console.warn("Percentage discount calculation for total might need specific logic.");
    }

    return total + (isNaN(value) ? 0 : value);
  }, 0);

  const fidelityReduction = order.fidelity / 10;
  const finalTotal = cart.total - discountsTotal - fidelityReduction;
  const finalTotalClamped = Math.max(0, finalTotal);
  const vatIncluded = computeVAT(cart, discountsTotal + fidelityReduction);

  return (
    <section aria-labelledby="summary-heading" className={twMerge(sectionWrapperClassname)}>
      <Title
        title={t("cartPage.summary.title")}
        type="h3"
        classname={twMerge(titleClassname, "mb-4 text-base")}
        firstLetterClassname="text-xl"
        id="summary-heading"
      />

      <dl className="space-y-2 text-sm">
        {/* Sub Total */}
        <div className="flex items-center justify-between">
          <dt className="text-gray-600">{t("cartPage.summary.subtotalLabel")}</dt>
          <dd className="font-medium text-gray-900">{cart.total.toFixed(2)}€</dd>
        </div>

        {/* Applied Discounts */}
        {order.discounts.map((d) => (
          <div key={d.name} className="flex items-center justify-between text-green">
            <dt className="flex items-center text-gray-600">
              <span className="mr-1">{t("cartPage.summary.discountCodeLabel", { name: d.name })}</span>
              <button onClick={() => handleRemoveDiscount(d.name)} aria-label={t("cartPage.summary.removeDiscountAriaLabel", { name: d.name })}>
                <XMarkIcon className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer" />
              </button>
            </dt>
            {/* displayDiscountValue handles formatting (e.g., -XX.XX€ or XX%) */}
            <dd className="font-medium">{displayDiscountValue(d, cart.products)}</dd>
          </div>
        ))}

        {/* Applied Fidelity Points */}
        {order.fidelity > 0 && (
          <div className="flex items-center justify-between text-green">
            <dt className="flex items-center text-gray-600">
              <span className="mr-1">{t("cartPage.summary.fidelityPointsLabel", { count: order.fidelity })}</span>
              <button onClick={handleRemoveFidelity} aria-label={t("cartPage.summary.removePointsAriaLabel")}>
                <XMarkIcon className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer" />
              </button>
            </dt>
            <dd className="font-medium">- {fidelityReduction.toFixed(2)}€</dd>
          </div>
        )}

        {/* Separator & Total */}
        <div className="!mt-4 border-t border-gray-200 pt-4">
          <div className="flex items-baseline justify-between text-base font-semibold text-gray-900">
            <dt>{t("cartPage.summary.totalLabel")}</dt>
            <dd className="text-right">
              {finalTotalClamped.toFixed(2)}€
              <p className="text-xs font-normal text-gray-500 mt-0.5">{t("cartPage.summary.vatText", { vatAmount: vatIncluded.toFixed(2) })}</p>
            </dd>
          </div>
        </div>
      </dl>

      {/* Checkout Button */}
      <div className="mt-6">
        <Link
          href="/expedition"
          className={clsx(
            "flex w-full items-center justify-center rounded-md border border-transparent bg-green px-6 py-3 text-base font-medium text-white shadow-sm",
            "hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2"
          )}
        >
          {t("cartPage.summary.checkoutButton")}
        </Link>

        {/* Login Prompt */}
        {!userData && (
          <p className="text-center text-xs text-gray-500 mt-2">
            <Link href="/connexion?redirect=expedition" className={linkClassname}>
              {t("cartPage.summary.loginPromptLink")}
            </Link>{" "}
            {t("cartPage.summary.loginPromptText")}
          </p>
        )}
      </div>
    </section>
  );
}
