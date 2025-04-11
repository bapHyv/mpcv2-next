// ProductPrice.tsx (Styled)
"use client";

import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import { twMerge } from "tailwind-merge";

export default function ProductPrice({ id }: { id: number }) {
  const { products } = useProductsAndCart();

  const productData = products ? products[id] : null;
  const price = productData ? parseFloat(productData.price) : null;
  const stockStatus = productData?.stock;

  const isOutOfStock = stockStatus === "0" || stockStatus === "outofstock";

  return (
    <div className="mt-3 text-center lg:text-left">
      <h2 className="sr-only">Product information</h2>
      {price !== null ? (
        <p className={twMerge("text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl", isOutOfStock && "text-gray-400 line-through")}>
          {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price)}
        </p>
      ) : (
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse mx-auto lg:mx-0"></div>
      )}
      {isOutOfStock && price !== null && <p className="mt-1 text-sm font-medium text-red-600">Épuisé</p>}
    </div>
  );
}
