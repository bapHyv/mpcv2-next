"use client";
import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import CartProductCard from "../cart/CartProductCard";
import Title from "@/app/components/Title";
import { sectionClassname, titleClassname } from "@/app/staticData/cartPageClasses";
import { twMerge } from "tailwind-merge";

// This component exists to use the useProductsAndCart hook. It has to be a client component
// It prevents to turn the whole cart page into a client component
export default function DisplayProductsCartPage() {
  const { cart } = useProductsAndCart();
  return (
    <section aria-labelledby="products" className={twMerge(sectionClassname)}>
      <Title title="Products" type="h2" classname={twMerge(titleClassname)} firstLetterClassname="text-2xl" id="products" />

      {cart.products.map((product) => (
        <CartProductCard key={`${product.id}-${product.option}-${product.name}-${product.cartItemId}`} {...product} isInModale={false} />
      ))}
    </section>
  );
}
