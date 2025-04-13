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
  const { cart } = useProductsAndCart();

  const handleRemoveDiscount = (name: string) => {
    setOrder((prevState) => ({
      ...prevState,
      discounts: prevState.discounts.filter((e) => e.name !== name),
    }));
    // Use translated alert (reusing from cart alerts)
    addAlert(uuid(), t("alerts.cart.discountRemoved.text", { name }), t("alerts.cart.discountRemoved.title"), "yellow");
  };

  return (
    <div className={twMerge(sectionWrapperClassname)}>
      <Title
        title={t("shippingPage.orderSummary.title")}
        type="h3"
        classname={twMerge(titleClassname, "!mb-4 text-base")}
        firstLetterClassname="text-xl"
        id="shipping-order-summary-heading"
      />

      {/* Product List Header */}
      <div className="flex items-center justify-between text-sm font-medium text-gray-500 border-b border-gray-200 pb-2 mb-3">
        <span>{t("shippingPage.orderSummary.productsHeader")}</span>
        <span>{t("shippingPage.orderSummary.productSubtotalHeader")}</span>
      </div>

      {/* Product List */}
      <div className="space-y-1.5 mb-3 text-sm">
        {" "}
        {/* Added spacing and margin */}
        {Object.entries(order.products).map(([pId, orderP]) =>
          orderP.map((p) => (
            <div key={`${p.label}-${p.option}-${p.quantity}`} className="flex items-start justify-between gap-2">
              {" "}
              {/* Added gap */}
              {/* Product Name and Details */}
              <span className="text-gray-800 flex-grow pr-1">
                {p.label}{" "}
                <span className="text-gray-500">
                  ({p.option}
                  {p.per === "g" ? "g" : "u"})
                </span>
                <span className="text-gray-500 block text-xs">
                  {p.quantity} x {p.unitPrice.toFixed(2)}€
                </span>
              </span>
              {/* Product Total Price */}
              <span className="text-gray-900 font-medium flex-shrink-0">{p.totalPrice.toFixed(2)}€</span>
            </div>
          ))
        )}
      </div>

      {/* Discounts Section */}
      {order.discounts.length > 0 && (
        <>
          <Separator /> {/* Use Separator or hr */}
          <div className="flex items-center justify-between text-sm font-medium text-gray-500 pt-2 mb-1.5">
            <span>{t("shippingPage.orderSummary.promoCodesHeader")}</span>
          </div>
          <div className="space-y-1.5 mb-3 text-sm">
            {" "}
            {/* Spacing for discounts */}
            {order.discounts.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                {/* Discount Name and Remove Button */}
                <dt className="flex items-center text-gray-600 gap-1">
                  <span>{d.name}</span>
                  <button onClick={() => handleRemoveDiscount(d.name)} aria-label={t("alerts.cart.discountRemoved.title") + " " + d.name}>
                    {" "}
                    {/* Improved Aria Label */}
                    <XMarkIcon className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer" />
                  </button>
                </dt>
                {/* Discount Value */}
                <dd className="font-medium text-green">{displayDiscountValue(d, cart.products)}</dd>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Fidelity Section */}
      {order.fidelity > 0 && (
        <>
          <Separator />
          <div className="flex items-center justify-between text-sm font-medium text-gray-500 pt-2 mb-1.5">
            <span>{t("shippingPage.orderSummary.loyaltyHeader")}</span>
          </div>
          <div className="flex items-center justify-between mb-3 text-sm">
            <dt className="flex items-center text-gray-600 gap-1">
              {/* TODO-TRANSLATION: Potentially needs {count} variable like cart summary */}
              <span>
                {t("shippingPage.orderSummary.loyaltyPointsLabel")} ({order.fidelity})
              </span>
              {/* TODO-TRANSLATION: Add aria-label for remove points button */}
              <button onClick={() => setOrder((prevState) => ({ ...prevState, fidelity: 0 }))} aria-label="Retirer les points">
                <XMarkIcon className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer" />
              </button>
            </dt>
            <dd className="font-medium text-green">- {(order.fidelity / 10).toFixed(2)}€</dd>
          </div>
        </>
      )}

      {/* Final Subtotal */}
      <Separator />
      <div className="flex items-center justify-between mt-3 text-sm">
        <span className="font-medium text-gray-900">{t("shippingPage.orderSummary.finalSubtotalLabel")}</span>
        <span className="font-semibold text-gray-900">{order["sub-total"].toFixed(2)}€</span>
      </div>
    </div>
  );
}
