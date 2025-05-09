"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { v4 as uuid } from "uuid";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

import { useAlerts } from "@/app/context/alertsContext";
import useCleanUpAfterPayment from "@/app/hooks/useCleanUpAfterPayment";

import Title from "@/app/components/Title";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { sectionWrapperClassname, titleClassname as baseTitleClassname, subtleSectionWrapperClassname } from "@/app/staticData/cartPageClasses";
import { computeVAT } from "@/app/utils/orderFunctions";

import { Order, OrderProduct } from "@/app/types/orderTypes";
import { ProductCart } from "@/app/context/productsAndCartContext";

type TempStatus =
  | "processing"
  | "success"
  | "failed"
  | "fraud_refusal"
  | "fraud_warning"
  | "auth_failed"
  | "bank_refusal"
  | "max_attempts"
  | "technical_error"
  | "abandoned"
  | "unknown_failure"
  | "error";

interface CommandeRecueSearchParams {
  orderId?: string;
  payment?: "secure3dcard" | "bankTransfer";
  temp_status?: TempStatus;
  failure_reason?: string;
  error_message?: string;
}

interface ContentProps {
  searchParams: CommandeRecueSearchParams;
  locale: string;
}

function formatDate(locale: string): string {
  return new Date().toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// 1500ms => get localStorage
// 2000ms => setLoading to false
// 2500ms => clear state (will clear localStorage)

export default function Content({ searchParams, locale }: ContentProps) {
  const { orderId, payment } = searchParams;
  const t = useTranslations("orderReceived");
  const { addAlert } = useAlerts();
  const { handleCleanUpAfterPayment } = useCleanUpAfterPayment();

  const [order, setOrder] = useState<Order | null>(null);
  const [cart, setCart] = useState<{ total: number; products: ProductCart[] } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutLocalStorageId = setTimeout(() => {
      const storedOrder = localStorage.getItem("order");
      const storedCart = localStorage.getItem("cart");

      if (storedOrder) {
        setOrder(JSON.parse(localStorage.getItem("order") || "null"));
      }
      if (storedCart) {
        setCart(JSON.parse(localStorage.getItem("cart") || "null"));
      }
    }, 1500);
    return () => clearTimeout(timeoutLocalStorageId);
  }, []);

  useEffect(() => {
    const timeoutIsLoadingId = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timeoutIsLoadingId);
  }, []);

  // --- Cleanup Effect ---
  useEffect(() => {
    if (order && cart) {
      const cleanupTimeout = setTimeout(() => {
        const { payment, temp_status, failure_reason, error_message } = searchParams;
        if (payment === "bankTransfer") {
          addAlert(uuid(), t("alerts.bankTransfer.text"), t("alerts.bankTransfer.title"), "emerald");
        } else if (payment === "secure3dcard") {
          if (temp_status === "success") {
            addAlert(uuid(), t("alerts.cardSuccess.text"), t("alerts.cardSuccess.title"), "emerald");
          } else if (temp_status === "fraud_warning") {
            addAlert(
              uuid(),
              t("alerts.cardWarning.text", { reason: failure_reason || t("status.unknownReason") }),
              t("alerts.cardWarning.title"),
              "yellow"
            );
          } else {
            // Handle various failures
            addAlert(
              uuid(),
              t("alerts.cardFailed.text", { reason: failure_reason || error_message || t("status.unknownReason") }),
              t("alerts.cardFailed.title"),
              "red"
            );
          }
        }
        handleCleanUpAfterPayment();
      }, 2500);

      return () => clearTimeout(cleanupTimeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, cart]);

  if (isLoading || !order || !cart) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <LoadingSpinner size="lg" color="green" />
      </div>
    );
  }

  const discountsTotal = order.discounts.reduce((total, d) => {
    const value = parseFloat(d.discountValue);
    return total + (isNaN(value) ? 0 : value);
  }, 0);

  const fidelityReduction = (order.fidelity || 0) / 10;
  const vatAmount = computeVAT(cart, discountsTotal + fidelityReduction);

  return (
    <div className="container m-auto space-y-8 mt-6">
      {/* 1. Status Message (for Card Payments) */}
      {payment === "secure3dcard" && (
        <div
          className={clsx(
            "p-4 rounded-md text-sm",
            searchParams.temp_status === "success" && "bg-emerald-50 text-emerald-800 border border-emerald-200",
            searchParams.temp_status === "fraud_warning" && "bg-yellow-50 text-yellow-800 border border-yellow-200",
            (searchParams.temp_status === "failed" ||
              searchParams.temp_status === "error" ||
              searchParams.temp_status === "bank_refusal" ||
              searchParams.temp_status === "auth_failed") &&
              "bg-red-50 text-red-800 border border-red-200",
            (searchParams.temp_status === "processing" ||
              searchParams.temp_status === "abandoned" ||
              searchParams.temp_status === "max_attempts" ||
              searchParams.temp_status === "technical_error") &&
              "bg-blue-50 text-blue-800 border border-blue-200"
          )}
        >
          <p className="font-medium">{t(`status.${searchParams.temp_status || "unknown"}`)}</p>
          {(searchParams.failure_reason || searchParams.error_message) && (
            <p className="mt-1 text-xs">{searchParams.failure_reason || searchParams.error_message}</p>
          )}
          {searchParams.temp_status === "fraud_warning" && <p className="mt-1 text-xs">{t("statusMessages.fraudWarningNote")}</p>}
          {searchParams.temp_status !== "success" && searchParams.temp_status !== "fraud_warning" && (
            <p className="mt-1 text-xs">{t("statusMessages.contactSupport")}</p>
          )}
        </div>
      )}

      {/* 2. Order Summary Table */}
      <section aria-labelledby="order-summary-heading" className={sectionWrapperClassname}>
        <Title type="h2" title={t("summary.title")} classname={baseTitleClassname} />
        <table className="w-full text-sm mt-4">
          <tbody>
            <tr className="border-b">
              <th className="text-left font-medium text-gray-600 py-2 pr-2">{t("summary.orderNumber")}</th>
              <td className="text-right py-2">{orderId || t("summary.notAvailable")}</td>
            </tr>
            <tr className="border-b">
              <th className="text-left font-medium text-gray-600 py-2 pr-2">{t("summary.date")}</th>
              <td className="text-right py-2">{formatDate(locale)}</td>
            </tr>
            <tr className="border-b">
              <th className="text-left font-medium text-gray-600 py-2 pr-2">{t("summary.email")}</th>
              <td className="text-right py-2 truncate">{order.shippingAddress?.email || t("summary.notAvailable")}</td>
            </tr>
            <tr className="border-b">
              <th className="text-left font-medium text-gray-600 py-2 pr-2">{t("summary.total")}</th>
              <td className="text-right font-semibold py-2">{order.total?.toFixed(2) || "0.00"}€</td>
            </tr>
            <tr>
              <th className="text-left font-medium text-gray-600 py-2 pr-2">{t("summary.paymentMethod")}</th>
              <td className="text-right py-2">
                {payment === "bankTransfer"
                  ? t("paymentMethods.bankTransfer")
                  : payment === "secure3dcard"
                  ? t("paymentMethods.card")
                  : t("summary.notAvailable")}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 3. Bank Transfer Information (Conditional) */}
      {payment === "bankTransfer" && (
        <section aria-labelledby="bank-details-heading" className={sectionWrapperClassname}>
          <Title type="h2" title={t("bankDetails.title")} classname={baseTitleClassname} />
          <p className="text-sm text-gray-600 text-center mb-4">{t("bankDetails.instruction")}</p>
          <table className="w-full text-sm mt-4">
            <tbody>
              <tr className="border-b">
                <th className="text-left font-medium text-gray-600 py-2 pr-2">{t("bankDetails.bankNameLabel")}</th>
                <td className="text-right py-2">{t("bankDetails.bankNameValue")}</td>
              </tr>
              <tr className="border-b">
                <th className="text-left font-medium text-gray-600 py-2 pr-2">{t("bankDetails.accountNumberLabel")}</th>
                <td className="text-right py-2">{t("bankDetails.accountNumberValue")}</td>
              </tr>
              <tr className="border-b">
                <th className="text-left font-medium text-gray-600 py-2 pr-2">{t("bankDetails.branchCodeLabel")}</th>
                <td className="text-right py-2">{t("bankDetails.branchCodeValue")}</td>
              </tr>
              <tr className="border-b">
                <th className="text-left font-medium text-gray-600 py-2 pr-2">{t("bankDetails.ibanLabel")}</th>
                <td className="text-right py-2">{t("bankDetails.ibanValue")}</td>
              </tr>
              <tr>
                <th className="text-left font-medium text-gray-600 py-2 pr-2">{t("bankDetails.bicLabel")}</th>
                <td className="text-right py-2">{t("bankDetails.bicValue")}</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-red-600 mt-4 italic">{t("bankDetails.reminder", { orderId: orderId || t("summary.notAvailable") })}</p>
        </section>
      )}

      {/* 4. Order Details (Products, Totals) */}
      <section aria-labelledby="order-details-heading" className={sectionWrapperClassname}>
        <Title type="h2" title={t("orderDetails.title")} classname={baseTitleClassname} />
        {/* Product List Header */}
        <div className="flex justify-between text-sm font-medium text-gray-500 border-b pb-2 mt-4">
          <span>{t("orderDetails.productHeader")}</span>
          <span>{t("orderDetails.totalHeader")}</span>
        </div>
        {/* Product List */}
        <ul className="divide-y divide-gray-200 text-sm">
          {Object.values(order.products).flatMap((orderPArray: OrderProduct[]) =>
            orderPArray.map((p: OrderProduct) => (
              <li key={`${p.label}-${p.option}`} className="flex justify-between py-2">
                <span className="pr-2">
                  {p.label} <span className="text-gray-500">x {p.quantity}</span>
                </span>
                <span className="font-medium">{p.totalPrice.toFixed(2)}€</span>
              </li>
            ))
          )}
        </ul>
        {/* Totals */}
        <dl className="space-y-1 border-t pt-3 mt-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-600">{t("orderDetails.subtotalLabel")}</dt>
            <dd className="text-gray-800">{order["sub-total"]?.toFixed(2) || "0.00"}€</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">{t("orderDetails.shippingLabel")}</dt>
            <dd className="text-gray-800">{order.shippingCost?.toFixed(2) || "0.00"}€</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">{t("orderDetails.paymentMethodLabel")}</dt>
            <dd className="text-gray-800">
              {payment === "bankTransfer"
                ? t("paymentMethods.bankTransfer")
                : payment === "secure3dcard"
                ? t("paymentMethods.card")
                : t("summary.notAvailable")}
            </dd>
          </div>
          <div className="flex justify-between text-base font-semibold pt-2 border-t mt-2">
            <dt>{t("orderDetails.grandTotalLabel")}</dt>
            <dd>{order.total?.toFixed(2) || "0.00"}€</dd>
          </div>
          {vatAmount > 0 && (
            <div className="flex justify-end text-xs text-gray-500">
              <span>{t("orderDetails.vatIncludedText", { vatAmount: vatAmount.toFixed(2) })}</span>
            </div>
          )}
        </dl>
      </section>

      {/* 5. Addresses */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Shipping Address */}
        <section aria-labelledby="shipping-address-heading" className={subtleSectionWrapperClassname}>
          <Title type="h2" title={t("shippingAddress.title")} classname={twMerge(baseTitleClassname, "text-left")} />
          <address className="mt-4 text-sm not-italic text-gray-700 space-y-0.5">
            <p className="font-medium text-gray-900">
              {order.shippingAddress.firstname} {order.shippingAddress.lastname}
            </p>
            {order.shippingAddress.company && <p>{order.shippingAddress.company}</p>}
            <p>{order.shippingAddress.address1}</p>
            {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
            <p>
              {order.shippingAddress.postalCode} {order.shippingAddress.city}
            </p>
            {order.shippingAddress.province && <p>{order.shippingAddress.province}</p>}
            <p>{order.shippingAddress.country}</p>
            <p className="pt-2">{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.email}</p>
          </address>
        </section>

        {/* Billing Address */}
        <section aria-labelledby="billing-address-heading" className={subtleSectionWrapperClassname}>
          <Title type="h2" title={t("billingAddress.title")} classname={twMerge(baseTitleClassname, "text-left")} />
          <address className="mt-4 text-sm not-italic text-gray-700 space-y-0.5">
            <p className="font-medium text-gray-900">
              {order["different-billing"] ? order.billingAddress.firstname : order.shippingAddress.firstname}{" "}
              {order["different-billing"] ? order.billingAddress.lastname : order.shippingAddress.lastname}
            </p>
            {(order["different-billing"] ? order.billingAddress.company : order.shippingAddress.company) && (
              <p>{order["different-billing"] ? order.billingAddress.company : order.shippingAddress.company}</p>
            )}
            <p>{order["different-billing"] ? order.billingAddress.address1 : order.shippingAddress.address1}</p>
            {(order["different-billing"] ? order.billingAddress.address2 : order.shippingAddress.address2) && (
              <p>{order["different-billing"] ? order.billingAddress.address2 : order.shippingAddress.address2}</p>
            )}
            <p>
              {order["different-billing"] ? order.billingAddress.postalCode : order.shippingAddress.postalCode}{" "}
              {order["different-billing"] ? order.billingAddress.city : order.shippingAddress.city}
            </p>
            {(order["different-billing"] ? order.billingAddress.province : order.shippingAddress.province) && (
              <p>{order["different-billing"] ? order.billingAddress.province : order.shippingAddress.province}</p>
            )}
            <p>{order["different-billing"] ? order.billingAddress.country : order.shippingAddress.country}</p>
            <p className="pt-2">{order["different-billing"] ? order.billingAddress.phone : order.shippingAddress.phone}</p>
            <p>{order["different-billing"] ? order.billingAddress.email : order.shippingAddress.email}</p>
          </address>
        </section>
      </div>
    </div>
  );
}
