"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useAuth } from "@/app/context/authContext";
import React from "react";
import Link from "next/link";

const Commandes = () => {
  const t = useTranslations("orders");

  const { userData } = useAuth();
  return (
    <section className="mb-4">
      <h2 className="text-green text-center font-medium text-2xl my-4">{t("title")}</h2>
      <div className="flex flex-col items-center justify-center md:flex-row md:flex-wrap gap-3 px-3 pb-3">
        {!userData?.orders.length && (
          <Link href="/fleurs-cbd" className="p-4 border border-neutral-300 rounded-md text-neutral-500 italic text-center cursor-pointer">
            Vous n&apos;avez aucune commandes passées. Cliquez ici pour consulter notre catalogue de produits!
          </Link>
        )}
        {userData?.orders ? (
          userData.orders.map((order) => (
            <div key={order.id} className="space-y-5 md:space-y-3 w-[360px] 2xl:w-[720px] border border-neutral-500 rounded-lg p-3 shadow-md">
              <p className="text-lg text-center font-semibold text-green">
                {t("order.orderNumber")}: {order.id}
              </p>

              <div className="w-full space-y-1">
                <div className="flex justify-between text-left text-sm lg:text-base font-bold text-black">
                  <div className="w-3/4">{t("order.product")}</div>
                  <div className="w-1/4">{t("order.price")}</div>
                </div>
                <div>
                  {order.products.map((product: any) => (
                    <React.Fragment key={product.name}>
                      <div className="flex justify-between text-xs lg:text-sm">
                        <div className="text-teal-900 pr-2 font-medium w-3/4 text-ellipsis overflow-hidden text-nowrap">{product.name}</div>
                        <div className="w-1/4">
                          {parseFloat(product.price).toFixed(2)} {order.currency}
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                <div>
                  <div className="flex justify-between text-sm lg:text-base font-bold text-black">
                    <div className="w-3/4">Total</div>
                    <div className="w-1/4 text-xs lg:text-sm">
                      {order.total.toFixed(2)} {order.currency}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm lg:text-base">
                <p className="text-black">
                  <span className="font-bold">Date:</span> {new Date(order.date).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-bold">Status: </span>
                  <span
                    className={`font-medium ${
                      order.status === "wc-completed" ? "text-emerald-500" : order.status === "wc-on-hold" ? "text-yellow-600" : "text-red-600"
                    }`}
                  >
                    {order.status === "wc-on-hold"
                      ? t("order.status.onHold")
                      : order.status === "wc-failed"
                      ? t("order.status.failed")
                      : t("order.status.delivered")}
                  </span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center">
            <LoadingSpinner size="lg" color="black" className="mt-20" />
          </div>
        )}
      </div>
    </section>
  );
};

export default Commandes;
