"use client";
import { useCart } from "@/app/context/cartContext";
import CartProductCard from "./CartProductCard";

// This component exists to use the useCart hook. It has to be a client component
// It prevents to turn the whole cart page into a client component
export default function DisplayProductsCartPage() {
  const { cart } = useCart();
  return cart.products.map((product) => (
    <CartProductCard
      key={`${product.id}-${product.option}-${product.name}-${product.cartItemId}`}
      {...product}
    />
  ));
}
