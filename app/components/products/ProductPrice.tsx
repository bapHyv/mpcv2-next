"use client";

import { useProducts } from "@/app/context/productsContext";

export default function ProductPrice({ id }: { id: string }) {
  const { products } = useProducts();

  return (
    <>
      {!!products[id]?.price ? (
        <div className="mt-3">
          <h2 className="sr-only">product information</h2>
          <p className="text-3xl tracking-tight text-neutral-900 dark:text-neutral-100">
            {products[id].price.toFixed(2)} €
          </p>
        </div>
      ) : (
        <div className="h-[36px] mt-3"></div>
      )}
    </>
  );
}
