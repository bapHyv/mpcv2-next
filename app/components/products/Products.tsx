"use client";

import { CurrentCategory, Products as IProducts } from "@/app/types/productsTypes";
import ProductFilter from "./ProductFilter";
import ProductCard from "./ProductCard";
import { useState } from "react";

interface Params {
  products: IProducts;
  currentCategory: CurrentCategory;
  locale: string;
}

export default function Products({ currentCategory, locale, products }: Params) {
  const [currentProducts, setCurrentProducts] = useState(products[currentCategory]);

  return (
    <div className="grid grid-cols-12 gap-4 px-2">
      {/* PRODUCT FILTERS */}
      {/* <ProductFilter
        currentCategory={currentCategory}
        locale={locale}
        products={products}
        currentProduct={currentProducts}
        setCurrentProducts={setCurrentProducts}
      /> */}

      {/* PRODUCT CARDS */}
      {currentProducts.map((prod) => (
        // @ts-ignore
        <ProductCard key={prod.name} {...prod} />
      ))}
    </div>
  );
}
