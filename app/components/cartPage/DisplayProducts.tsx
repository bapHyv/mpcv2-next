"use client";
import { twMerge } from "tailwind-merge";

import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import Title from "@/app/components/Title";
import CartProductCard from "@/app/components/cart/CartProductCard";
import { titleClassname } from "@/app/staticData/cartPageClasses";

export default function DisplayProductsCartPage() {
  const { cart } = useProductsAndCart();

  return (
    <div className="mt-6">
      <Title title="Produits" type="h2" classname={twMerge(titleClassname, "mb-4")} firstLetterClassname="text-2xl" id="products" />

      <div className="space-y-4">
        {cart.products.map((product) => (
          <CartProductCard key={`${product.id}-${product.option}-${product.name}-${product.cartItemId}`} {...product} isInModale={false} />
        ))}
      </div>
    </div>
  );
}
