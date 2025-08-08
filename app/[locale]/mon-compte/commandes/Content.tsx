"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

import LoadingSpinner from "@/app/components/LoadingSpinner";
import Title from "@/app/components/Title";
import { useAuth } from "@/app/context/authContext";
import {
  sectionWrapperClassname,
  subtleSectionWrapperClassname,
  statusBadgeCompleted,
  statusBadgeOnHold,
  statusBadgeFailed,
  statusBadgeProcessing,
  statusBadgeCancelled,
  statusBadgeBase,
  statusBadgePending,
  statusBadgeRefunded,
  titleClassname,
} from "@/app/staticData/cartPageClasses";
import { Order } from "@/app/types/profileTypes";

export default function Content() {
  const t = useTranslations("orders");
  const { userData } = useAuth();
  const locale = useLocale();

  const getStatusClass = (status: Order["status"]): string => {
    switch (status) {
      case "wc-pending":
        return statusBadgePending;
      case "wc-processing":
        return statusBadgeProcessing;
      case "wc-on-hold":
        return statusBadgeOnHold;
      case "wc-completed":
        return statusBadgeCompleted;
      case "wc-cancelled":
        return statusBadgeCancelled;
      case "wc-refunded":
        return statusBadgeRefunded;
      case "wc-failed":
        return statusBadgeFailed;
      default:
        return twMerge(statusBadgeBase, "bg-gray-100 text-gray-800");
    }
  };

  const getStatusText = (status: Order["status"]): string => {
    switch (status) {
      case "wc-pending":
        return t("order.status.pending");
      case "wc-processing":
        return t("order.status.processing");
      case "wc-on-hold":
        return t("order.status.onHold");
      case "wc-completed":
        return t("order.status.completed");
      case "wc-cancelled":
        return t("order.status.cancelled");
      case "wc-refunded":
        return t("order.status.refunded");
      case "wc-failed":
        return t("order.status.failed");
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Title title={t("title")} type="h1" classname={twMerge(titleClassname, "md:mt-14 text-green")} firstLetterClassname="text-xl" />

      {!userData ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <LoadingSpinner size="lg" color="green" />
        </div>
      ) : !userData.orders || userData.orders.length === 0 ? (
        <div className={twMerge(subtleSectionWrapperClassname, "text-center")}>
          <p className="text-gray-600 mb-4">{t("noOrder")}</p>
          <Link
            href={`/${locale}/fleurs-cbd`}
            className="inline-flex items-center rounded-md border border-transparent bg-green px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2"
          >
            {t("catalog")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {userData.orders.map((order) => (
            <div key={order.id} className={twMerge(sectionWrapperClassname, "!my-0")}>
              <div className="pb-3 mb-4 border-b border-gray-200">
                <p className="text-sm font-semibold text-green">
                  {t("order.orderNumber")}: #{order.id}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t("order.dateLabel")}: {new Date(order.date).toLocaleDateString()}
                </p>
              </div>
              {/* Product List */}
              <div className="mb-4">
                <h4 className="sr-only">{t("order.product")}</h4>
                <ul className="space-y-2 text-sm">
                  {order.products.map((product) => (
                    <li key={product.name} className="flex justify-between items-start gap-2">
                      <span className="flex-grow text-gray-800 truncate pr-2">{product.name}</span>
                      <span className="flex-shrink-0 font-medium text-gray-900 whitespace-nowrap">
                        {parseFloat(product.price).toFixed(2)} {order.currency}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Order Total */}
              <div className="pt-3 mt-4 border-t border-gray-200">
                <dl className="flex justify-between text-sm font-semibold text-gray-900">
                  <dt>{t("order.totalLabel")}</dt>
                  <dd>
                    {order.total.toFixed(2)} {order.currency}
                  </dd>
                </dl>
              </div>
              {/* Order Status */}
              <div className="mt-4 text-sm">
                <p className="flex items-center gap-x-2">
                  <span className="font-medium text-gray-700">{t("order.statusLabel")}:</span>
                  {/* Styled status badge */}
                  <span className={twMerge(getStatusClass(order.status))}>{getStatusText(order.status)}</span>
                </p>
              </div>
              {/* Optional: Add a link/button to view order details */}
              {/* <div className="mt-4 text-right">
                           <Link href={`/${locale}/mon-compte/commandes/${order.id}`} className="text-sm font-medium text-green hover:text-dark-green">
                               Voir détails →
                           </Link>
                       </div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
