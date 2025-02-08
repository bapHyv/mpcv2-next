"use client";
import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import CartProductCard from "./CartProductCard";

// This component exists to use the useProductsAndCart hook. It has to be a client component
// It prevents to turn the whole cart page into a client component
export default function DisplayProductsCartPage() {
  const { cart } = useProductsAndCart();
  return cart.products.map((product) => (
    <CartProductCard key={`${product.id}-${product.option}-${product.name}-${product.cartItemId}`} {...product} isInModale={false} />
  ));
}
