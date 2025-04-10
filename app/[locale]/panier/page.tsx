"use client";

import { useEffect, useState } from "react";

import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import { APIResponse, Flower } from "@/app/types/productsTypes";
import AreYouCustomer from "@/app/components/cartPage/AreYouCustomer";
import DisplayProducts from "@/app/components/cartPage/DisplayProducts";
import DisplayDiscountCode from "@/app/components/cartPage/DisplayDiscountCode";
import Fidelity from "@/app/components/cartPage/Fidelity";
import CartSummary from "@/app/components/cartPage/CartSummary";
import ProductCard from "@/app/components/products/ClientProductCard";
import Title from "@/app/components/Title";
import clsx from "clsx";

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

  return (
    <>
      <Title
        title="Panier"
        type="h1"
        classname={clsx("relative my-4 uppercase text-xl text-green text-center font-bold tracking-widest", "sm:mt-8", "2xl:pl-2")}
        firstLetterClassname="text-4xl"
      />
      {!!cart.products.length ? (
        <div className="flex flex-col md:flex-row gap-x-5 px-2">
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
      )}
    </>
  );
}
