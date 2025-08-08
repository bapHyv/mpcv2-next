"use client";

import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { useMemo } from "react";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { useLocale, useTranslations } from "next-intl";

import Title from "@/app/components/Title";
import { useOrder } from "@/app/context/orderContext";
import { sectionWrapperClassname, titleClassname, buttonClassname, linkClassname } from "@/app/staticData/cartPageClasses";

interface Props {
  isPending: boolean;
  isError: boolean;
  retryInitPayment: () => Promise<void>;
}

export default function Total({ isPending, isError, retryInitPayment }: Props) {
  const t = useTranslations("");
  const locale = useLocale();
  const { order } = useOrder();

  const isDisabled = useMemo(
    () => isError || isPending || !order["payment-method"],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isPending, order["payment-method"]]
  );

  const finalTotalWithShipping = order.total;

  const getButtonText = () => {
    if (isPending) return null;
    if (isError) return "Something went wrong, please press the button below to retry";
    if (!order["payment-method"]) return t("paymentPage.totalSummary.noMethodButtonText");
    if (order["payment-method"] === "bank-transfer") return t("paymentPage.totalSummary.bankTransferButtonText");
    return t("paymentPage.totalSummary.cardPaymentButtonText");
  };

  return (
    <section aria-labelledby="payment-total-heading" className={twMerge(sectionWrapperClassname)}>
      <Title
        title={t("paymentPage.totalSummary.title")}
        type="h3"
        classname={twMerge(titleClassname, "mb-4 text-base")}
        firstLetterClassname="text-xl"
        id="payment-total-heading"
      />

      {/* Display Final Total */}
      <div className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-3">
        <span className="text-base font-medium text-gray-600 block mb-1">{t("paymentPage.totalSummary.totalAmountLabel")}</span>
        <span className="text-2xl">{finalTotalWithShipping.toFixed(2)}€</span>
        {!!order.shippingCost && order.shippingCost > 0 && (
          <span className="block text-xs font-normal text-gray-500 mt-0.5">
            {t("paymentPage.totalSummary.shippingCostText", { cost: order.shippingCost.toFixed(2) })}
          </span>
        )}
      </div>

      {/* Privacy Policy Text */}
      <p className="text-xs text-gray-600 my-4">
        {t("paymentPage.totalSummary.privacyPolicyText")}{" "}
        <Link href={`/${locale}/politiques-de-confidentialites`} target="_blank" className={linkClassname}>
          {t("paymentPage.totalSummary.privacyPolicyLinkText")}
        </Link>
      </p>

      {/* Submit Button */}
      <div className="mt-6">
        <button type="submit" disabled={isDisabled} className={twMerge(buttonClassname, "w-full py-3 text-base flex items-center justify-center")}>
          {isPending ? (
            <>
              <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" aria-hidden="true" />
              {t("forms.pendingText")}
            </>
          ) : (
            getButtonText()
          )}
        </button>
        {isError ? (
          <button
            type="button"
            className={twMerge(buttonClassname, "w-full py-3 text-base flex items-center justify-center mt-5")}
            onClick={() => retryInitPayment()}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" aria-hidden="true" />
                {t("forms.pendingText")}
              </>
            ) : (
              "Retry"
            )}
          </button>
        ) : null}
      </div>
    </section>
  );
}
