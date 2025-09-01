"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useLocale, useTranslations } from "next-intl";

import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import { APIResponse, Flower } from "@/app/types/productsTypes";
import AreYouCustomer from "@/app/components/cartPage/AreYouCustomer";
import DisplayProducts from "@/app/components/cartPage/DisplayProducts";
import DisplayDiscountCode from "@/app/components/cartPage/DisplayDiscountCode";
import Fidelity from "@/app/components/cartPage/Fidelity";
import CartSummary from "@/app/components/cartPage/CartSummary";
import ProductCard from "@/app/components/products/ClientProductCard";
import Title from "@/app/components/Title";
import { buttonClassname } from "@/app/staticData/cartPageClasses";

export default function DisplayComponents() {
  const { cart } = useProductsAndCart();
  const [products, setProducts] = useState<null | Flower[]>(null);
  const t = useTranslations("");
  const locale = useLocale();

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
        const productsArray: Flower[] = Object.values(data.products).filter((product) => !!parseInt(product.stock));
        setProducts(productsArray);
      } catch (error) {
        console.error("Error fetching flowers:", error);
      }
    };
    fetchFlowers();
  }, [cart.products.length]);

  return (
    <div className={twMerge("container mx-auto px-4 sm:px-6 lg:px-8")}>
      <Title
        title="Panier"
        type="h1"
        classname={clsx("relative mt-6 mb-8 uppercase text-xl text-green text-center font-bold tracking-widest", "sm:mt-10", "2xl:pl-2")}
        firstLetterClassname="text-4xl"
      />

      <div className="mb-6">
        <Link
          href={`/${locale}`}
          className={twMerge(clsx(buttonClassname, "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50", "px-3 py-1.5 text-sm"))}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1.5" aria-hidden="true" />
          {t("cartPage.backToHomeButton")}
        </Link>
      </div>

      {cart.products.length > 0 ? (
        <div className="flex flex-col lg:flex-row lg:gap-x-6 2xl:w-2/3 2xl:m-auto">
          <section aria-labelledby="cart-heading" className="lg:w-1/2">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>
            <AreYouCustomer redirect="panier" classname="lg:mt-0" />
            <DisplayProducts />
          </section>

          <section aria-labelledby="summary-heading" className={twMerge("mb-1 lg:mt-0", "md:mt-6 md:mb-8", "lg:m-0 lg:w-1/2")}>
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
                  <div key={p.id} className="flex gap-x-1">
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
