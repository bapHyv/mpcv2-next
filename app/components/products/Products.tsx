"use client";

import { CurrentCategory, Products as IProducts } from "@/app/types/productsTypes";
import ProductCard from "./ProductCard";
import { useState } from "react";

interface Params {
  products: IProducts;
  currentCategory: CurrentCategory;
  locale: string;
}

export default function Products({ currentCategory, locale, products }: Params) {
  const [currentProducts] = useState(products[currentCategory]);

  return (
    <div className="grid grid-cols-12 gap-4 px-2">
      {currentProducts.map((prod) => (
        // @ts-ignore
        <ProductCard key={prod.name} {...prod} />
      ))}
    </div>
  );
}
