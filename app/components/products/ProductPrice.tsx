"use client";

import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import { twMerge } from "tailwind-merge";
import { useTranslations, useLocale } from "next-intl";

export default function ProductPrice({ id }: { id: number }) {
  const t = useTranslations("productPage");
  const locale = useLocale();
  const { products } = useProductsAndCart();

  const productData = products ? products[id] : null;
  const price = productData ? parseFloat(productData.price) : null;
  const stockStatus = productData?.stock;
  const isOutOfStock = stockStatus === "0" || stockStatus === "outofstock";

  const currencyFormatOptions: Intl.NumberFormatOptions = {
    style: "currency",
    currency: "EUR",
  };

  return (
    <div className="mt-3 text-center lg:text-left">
      <h2 className="sr-only">{t("priceInfoSR")}</h2>
      {price !== null ? (
        <p
          className={twMerge("text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl", isOutOfStock && "text-gray-400 line-through")}
          aria-label={isOutOfStock ? `${t("outOfStock")}: ${new Intl.NumberFormat(locale, currencyFormatOptions).format(price)}` : undefined}
        >
          {new Intl.NumberFormat(locale, currencyFormatOptions).format(price)}
        </p>
      ) : (
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse mx-auto lg:mx-0"></div>
      )}
      {isOutOfStock && price !== null && <p className="mt-1 text-sm font-medium text-red-600">{t("outOfStock")}</p>}
    </div>
  );
}
