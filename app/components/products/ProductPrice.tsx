"use client";

import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import clsx from "clsx";

export default function ProductPrice({ id }: { id: number }) {
  const { products } = useProductsAndCart();

  return (
    <>
      {!!products[id] ? (
        <div className="sm:mt-3">
          <h2 className="sr-only">product information</h2>
          <p
            className={clsx("text-xl sm:text-3xl tracking-tight text-neutral-900 dark:text-neutral-100", {
              "line-through": products[id].stock === "0",
            })}
          >
            {parseFloat(products[id].price).toFixed(2)} €
          </p>
        </div>
      ) : (
        <div className="sm:mt-3">
          <h2 className="sr-only">product information</h2>
          <p className="text-xl sm:text-3xl tracking-tight text-neutral-100 dark:text-light-black">0.00 €</p>
        </div>
      )}
    </>
  );
}
