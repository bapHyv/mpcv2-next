"use client";

import AreYouCustomer from "@/app/components/cartPage/AreYouCustomer";
import DisplayProducts from "@/app/components/cartPage/DisplayProducts";
import DisplayDiscountCode from "./DisplayDiscountCode";
import Fidelity from "@/app/components/cartPage/Fidelity";
import CartSummary from "@/app/components/cartPage/CartSummary";
import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import { useEffect, useState } from "react";
import { APIResponse, Flower } from "@/app/types/productsTypes";
import ProductCard from "../products/ClientProductCard";

export default function DisplayComponents() {
  const { cart } = useProductsAndCart();
  const [products, setProducts] = useState<null | Flower[]>(null);

  useEffect(() => {
    const fetchFlowers = async () => {
      const fetchOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("https://api.monplancbd.fr/products/fleurs-cbd", fetchOptions);
      const data: APIResponse<Flower> = await response.json();
      const products: Flower[] = Object.values(data.products);

      setProducts(products);
    };

    if (cart.products.length === 0) {
      fetchFlowers();
    }
  }, [cart.products.length]);

  return !!cart.products.length ? (
    <div className="flex flex-col md:flex-row gap-x-5 p-2">
      <div className="w-full md:w-1/2">
        <AreYouCustomer redirect="panier" />
        <DisplayProducts />
      </div>

      <div className="w-full md:w-1/2">
        <DisplayDiscountCode />
        <Fidelity />
        <CartSummary />
      </div>
    </div>
  ) : (
    <>
      <p>Votre panier est vide</p>
      <div className="flex overflow-x-scroll p-2 gap-x-2">
        {products?.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </>
  );
}
