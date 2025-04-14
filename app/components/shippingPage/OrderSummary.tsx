"use client";

import { twMerge } from "tailwind-merge";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { v4 as uuid } from "uuid";
import { useTranslations } from "next-intl";

import Title from "@/app/components/Title";
import { useAlerts } from "@/app/context/alertsContext";
import { useOrder } from "@/app/context/orderContext";
import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import { sectionWrapperClassname, titleClassname } from "@/app/staticData/cartPageClasses";
import { displayDiscountValue } from "@/app/utils/orderFunctions";

const Separator = () => <div className="h-[1px] bg-gray-200 my-3"></div>;

export default function OrderSummary() {
  const t = useTranslations("");
  const { order, setOrder } = useOrder();
  const { addAlert } = useAlerts();
  const { cart } = useProductsAndCart(); // Keep if needed by displayDiscountValue

  // --- Handlers ---
  const handleRemoveDiscount = (name: string) => {
    setOrder((prevState) => ({
      ...prevState,
      discounts: prevState.discounts.filter((e) => e.name !== name),
    }));
    // Use translated alert
    addAlert(uuid(), t("alerts.cart.discountRemoved.text", { name }), t("alerts.cart.discountRemoved.title"), "yellow");
  };

  const handleRemoveFidelity = () => {
    setOrder((prevState) => ({ ...prevState, fidelity: 0 }));
    // Use translated alert
    addAlert(uuid(), t("alerts.cart.pointsRemoved.text"), t("alerts.cart.pointsRemoved.title"), "yellow");
  };

  // --- Render ---
  return (
    <section aria-labelledby="order-summary-heading" className={twMerge(sectionWrapperClassname)}>
      <Title
        title={t("shippingPage.orderSummary.title")}
        type="h3"
        classname={twMerge(titleClassname, "mb-4 text-base")}
        firstLetterClassname="text-xl"
        id="order-summary-heading"
      />

      {/* Definition List for Summary Items */}
      <dl className="space-y-3 text-sm">
        {/* Product Header */}
        <div className="flex justify-between font-medium text-gray-500 border-b border-gray-200 pb-2">
          <dt>{t("shippingPage.orderSummary.productsHeader")}</dt> {/* Translated */}
          <dd>{t("shippingPage.orderSummary.productSubtotalHeader")}</dd> {/* Translated */}
        </div>

        {/* Product List */}
        <div className="space-y-1.5">
          {Object.values(order.products).flatMap(
            (
              orderPArray // Keep flatMap logic
            ) =>
              orderPArray.map((p) => (
                <div key={`${p.label}-${p.option}-${p.quantity}`} className="flex items-start justify-between gap-2 text-gray-700">
                  <span className="flex-grow pr-1">
                    {p.label}{" "}
                    <span className="text-gray-500">
                      ({p.option}
                      {p.per === "g" ? "g" : "u"})
                    </span>
                    <span className="text-gray-500 block text-xs"> x {p.quantity}</span>
                  </span>
                  <span className="font-medium text-gray-900 whitespace-nowrap">{p.totalPrice.toFixed(2)}€</span>
                </div>
              ))
          )}
        </div>

        {/* Separator before discounts/points */}
        {(order.discounts.length > 0 || order.fidelity > 0) && <Separator />}

        {/* Discounts Section */}
        {order.discounts.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {" "}
            {/* Added padding top */}
            <dt className="font-medium text-gray-500">{t("shippingPage.orderSummary.discountsHeader")}</dt> {/* Translated */}
            {order.discounts.map((d) => (
              <dd key={d.name} className="flex justify-between items-center text-green">
                {/* Name and Remove Button */}
                <span className="flex items-center text-gray-600 gap-1">
                  <span>{d.name}</span>
                  <button
                    onClick={() => handleRemoveDiscount(d.name)}
                    aria-label={t("shippingPage.orderSummary.removeDiscountAriaLabel", { name: d.name })}
                  >
                    {" "}
                    {/* Translated */}
                    <XMarkIcon className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer" />
                  </button>
                </span>
                {/* Discount Value */}
                <span className="font-medium">{displayDiscountValue(d, cart.products)}</span>
              </dd>
            ))}
          </div>
        )}

        {/* Fidelity Points Section */}
        {order.fidelity > 0 && (
          <div className="space-y-1.5 pt-1">
            {" "}
            {/* Added padding top */}
            {/* Add separator only if discounts were also present */}
            {order.discounts.length > 0 && <Separator />}
            <dt className="font-medium text-gray-500">{t("shippingPage.orderSummary.loyaltyHeader")}</dt> {/* Translated */}
            <dd className="flex justify-between items-center text-green">
              {/* Points and Remove Button */}
              <span className="flex items-center text-gray-600 gap-1">
                <span>{t("shippingPage.orderSummary.loyaltyPointsText", { count: order.fidelity })}</span> {/* Translated */}
                <button onClick={handleRemoveFidelity} aria-label={t("shippingPage.orderSummary.removePointsAriaLabel")}>
                  {" "}
                  {/* Translated */}
                  <XMarkIcon className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer" />
                </button>
              </span>
              {/* Points Value */}
              <span className="font-medium">- {(order.fidelity / 10).toFixed(2)}€</span>
            </dd>
          </div>
        )}

        {/* Separator before Final Subtotal */}
        <Separator />

        {/* Final Subtotal */}
        <div className="flex justify-between pt-1 text-sm">
          {" "}
          {/* Adjusted padding */}
          <dt className="font-medium text-gray-900">{t("shippingPage.orderSummary.finalSubtotalLabel")}</dt> {/* Translated */}
          <dd className="font-semibold text-gray-900">{order["sub-total"].toFixed(2)}€</dd>
        </div>
      </dl>
    </section>
  );
}
