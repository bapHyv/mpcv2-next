"use client";

import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { useMemo } from "react";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { useTranslations } from "next-intl";

import Star from "@/app/components/Star";
import Title from "@/app/components/Title";
import { useAuth } from "@/app/context/authContext";
import { useOrder } from "@/app/context/orderContext";
import { sectionWrapperClassname, titleClassname, buttonClassname, checkRadioClassname, linkClassname } from "@/app/staticData/cartPageClasses";
import { useProductsAndCart } from "@/app/context/productsAndCartContext";

export default function Total({ isPending }: { isPending: boolean }) {
  const t = useTranslations("");
  const { order, setOrder } = useOrder();
  const { userData } = useAuth();
  const { cart } = useProductsAndCart();

  const isDisabled = useMemo(() => isPending || (order["shipping-method"] === "boxtal_connect" && !order["parcel-point"]), [isPending, order]);

  const finalTotalWithShipping = order.total;

  const isTotalZero = order.total === 0 || order.total < 0;

  const getButtonText = () => {
    if (isPending) return null;
    if (isDisabled && order["shipping-method"] === "boxtal_connect") return t("shippingPage.totalSummary.relayButtonText");
    if (isTotalZero) return t("shippingPage.totalSummary.notAllowed");
    if (userData) return t("shippingPage.totalSummary.paymentButtonText");
    if (!cart.products.length) return t("shippingPage.totalSummary.noProduct");
    return t("shippingPage.totalSummary.createAccountButtonText");
  };

  return (
    <section aria-labelledby="total-heading" className={twMerge(sectionWrapperClassname)}>
      <Title
        title={t("shippingPage.totalSummary.title")}
        type="h3"
        classname={twMerge(titleClassname, "mb-4 text-base")}
        firstLetterClassname="text-xl"
        id="total-heading"
      />

      {/* Display Final Total */}
      <div className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-3">
        <span className="text-base font-medium text-gray-600 block mb-1">{t("shippingPage.totalSummary.finalTotalLabel")}</span>
        <span className="text-2xl">{finalTotalWithShipping.toFixed(2)}€</span>
        {!!order.shippingCost && order.shippingCost > 0 && (
          <span className="block text-sm font-normal text-gray-500 mt-0.5">
            {t("shippingPage.totalSummary.shippingCostText", { cost: order.shippingCost.toFixed(2) })}
          </span>
        )}
      </div>

      {/* Privacy Policy Text */}
      <p className="text-xs text-gray-600 mb-4">
        {t("shippingPage.totalSummary.privacyPolicyText")}{" "}
        <Link href="/politiques-de-confidentialites" target="_blank" className={linkClassname}>
          {t("shippingPage.totalSummary.privacyPolicyLinkText")}
        </Link>
      </p>

      {/* Conditional Checkboxes */}
      {!userData && (
        <fieldset className="mb-6 space-y-3">
          <legend className="sr-only">{t("shippingPage.totalSummary.termsLegendSR")}</legend>
          {/* Terms and Conditions Checkbox */}
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input id="condition-generales" name="condition-generales" type="checkbox" required className={checkRadioClassname} />
            </div>
            <div className="ml-3 text-sm leading-6">
              <label htmlFor="condition-generales" className="text-gray-700 cursor-pointer">
                {t("shippingPage.totalSummary.termsLabel")}
                <Link href="/conditions-generales-de-vente" target="_blank" className={linkClassname}>
                  {" "}
                  {t("shippingPage.totalSummary.termsLinkText")}
                </Link>{" "}
                <Star />
              </label>
            </div>
          </div>
          {/* Marketing Opt-in Checkbox */}
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input id="optInMarketing" name="optInMarketing" type="checkbox" className={checkRadioClassname} />
            </div>
            <div className="ml-3 text-sm leading-6">
              <label htmlFor="optInMarketing" className="text-gray-700 cursor-pointer">
                {t("shippingPage.totalSummary.marketingLabel")}
              </label>
            </div>
          </div>
        </fieldset>
      )}

      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          disabled={isDisabled || !cart.products.length || isTotalZero}
          className={twMerge(buttonClassname, "w-full py-3 text-base flex justify-center items-center")}
        >
          {isPending ? (
            <>
              <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" aria-hidden="true" />
              {t("forms.pendingText")}
            </>
          ) : (
            getButtonText()
          )}
        </button>
      </div>

      {/* Relay Selection Error Message */}
      {isDisabled && order["shipping-method"] === "boxtal_connect" && !isPending && (
        <p className="text-center text-xs text-red-600 mt-2">{t("shippingPage.totalSummary.relayErrorText")}</p>
      )}

      {!cart.products.length && (
        <Link href="/fleurs-cbd" className="block w-full mt-4 text-center text-green underline font-semibold text-sm">
          {t("shippingPage.totalSummary.noProductLink")}
        </Link>
      )}
    </section>
  );
}
