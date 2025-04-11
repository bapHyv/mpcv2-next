// page.tsx
"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import { APIResponse, Flower } from "@/app/types/productsTypes";
import AreYouCustomer from "@/app/components/cartPage/AreYouCustomer";
import DisplayProducts from "@/app/components/cartPage/DisplayProducts";
import DisplayDiscountCode from "@/app/components/cartPage/DisplayDiscountCode";
import Fidelity from "@/app/components/cartPage/Fidelity";
import CartSummary from "@/app/components/cartPage/CartSummary";
import ProductCard from "@/app/components/products/ClientProductCard";
import Title from "@/app/components/Title";

export default function DisplayComponents() {
  const { cart } = useProductsAndCart();
  const [products, setProducts] = useState<null | Flower[]>(null);

  useEffect(() => {
    const fetchFlowers = async () => {
      if (cart.products.length > 0) return;
      try {
        const fetchOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        };
        const response = await fetch("https://api.monplancbd.fr/products/fleurs-cbd", fetchOptions);
        if (!response.ok) throw new Error("Failed to fetch");
        const data: APIResponse<Flower> = await response.json();
        const productsArray: Flower[] = Object.values(data.products);
        setProducts(productsArray);
      } catch (error) {
        console.error("Error fetching flowers:", error);
      }
    };
    fetchFlowers();
  }, [cart.products.length]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <Title
        title="Panier"
        type="h1"
        classname={clsx("relative mt-6 mb-8 uppercase text-xl text-green text-center font-bold tracking-widest", "sm:mt-10", "2xl:pl-2")}
        firstLetterClassname="text-4xl"
      />
      {cart.products.length > 0 ? (
        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-8 xl:gap-x-12">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>
            <AreYouCustomer redirect="panier" />
            <DisplayProducts />
          </section>

          <section aria-labelledby="summary-heading" className="lg:col-span-5 mt-8 lg:mt-0 space-y-6">
            <h2 id="summary-heading" className="sr-only">
              Order summary
            </h2>
            <DisplayDiscountCode />
            <Fidelity />
            <CartSummary />
          </section>
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Votre panier est vide</h2>
          <p className="text-gray-600 mb-8">Découvrez nos produits populaires ci-dessous.</p>
          <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            {products ? (
              products.length > 0 ? (
                products.map((p) => (
                  <div key={p.id} className="flex-shrink-0 w-64">
                    {" "}
                    <ProductCard {...p} />
                  </div>
                ))
              ) : (
                <p className="text-gray-500 w-full text-center">Aucun produit à afficher.</p>
              )
            ) : (
              <p className="text-gray-500 w-full text-center">Chargement des produits...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
