"use client";

import { useProducts } from "@/app/productsContext";

export default function ProductPrice({ name }: { name: string }) {
  const { products } = useProducts();

  return (
    <>
      {!!products[name]?.price ? (
        <div className="mt-3">
          <h2 className="sr-only">product information</h2>
          <p className="text-3xl tracking-tight text-neutral-900 dark:text-neutral-100">
            {products[name].price} €
          </p>
        </div>
      ) : (
        <div className="h-[36px] mt-3"></div>
      )}
    </>
  );
}
