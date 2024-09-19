"use client";

import { useProducts } from "@/app/productsContext";

export default function ProductPrice({ id }: { id: string }) {
  const { products } = useProducts();

  return (
    <>
      {!!products[id]?.price && !!parseInt(products[id]?.stock) ? (
        <div className="sm:mt-3">
          <h2 className="sr-only">product information</h2>
          <p className="text-xl sm:text-3xl tracking-tight text-neutral-900 dark:text-neutral-100">
            {parseFloat(products[id].price).toFixed(2)} €
          </p>
        </div>
      ) : (
        <div className="h-[36px] mt-3"></div>
      )}
    </>
  );
}
