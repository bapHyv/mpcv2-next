"use client";

import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import clsx from "clsx";

export default function ProductPrice({ id }: { id: number }) {
  const { products } = useProductsAndCart();
  const price = !!products[id] ? parseFloat(products[id].price) : 0;

  return (
    <>
      {!!products[id] ? (
        <div className="mt-3 text-center md:text-left">
          <h2 className="sr-only">product information</h2>
          <p
            className={clsx("text-2xl tracking-tight text-neutral-900", {
              "line-through": products[id].stock === "0",
            })}
          >
            {price.toFixed(2)} €
          </p>
        </div>
      ) : (
        <div className="sm:mt-3">
          <h2 className="sr-only">product information</h2>
          <p className="text-xl sm:text-3xl tracking-tight text-neutral-100">0.00 €</p>
        </div>
      )}
    </>
  );
}
