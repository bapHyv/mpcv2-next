"use client";
import { useCart } from "@/app/cartContext";
import CartProductCard from "./CartProductCard";

export default function DisplayProductsCartPage() {
  const { cart } = useCart();
  return cart.map((product) => (
    <CartProductCard
      key={`${product.id}-${product.option}-${product.name}-${product.cartItemId}`}
      {...product}
    />
  ));
}
