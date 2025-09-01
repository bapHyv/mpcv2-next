"use client";

import { twMerge } from "tailwind-merge";
import { useTranslations } from "next-intl";

import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import Title from "@/app/components/Title";
import CartProductCard from "@/app/components/cart/CartProductCard";
import { titleClassname as baseTitleClassname, sectionWrapperClassname } from "@/app/staticData/cartPageClasses";

export default function DisplayProductsCartPage() {
  const t = useTranslations("cartPage");
  const { cart } = useProductsAndCart();

  return (
    <div className={twMerge(sectionWrapperClassname, "mt-6", "lg:w-full")}>
      <Title title={t("productsTitle")} type="h2" classname={twMerge(baseTitleClassname, "mb-4")} firstLetterClassname="text-2xl" id="products" />

      {/* Keep product mapping */}
      <div className="space-y-3">
        {cart.products.map((product) => (
          <CartProductCard key={`${product.id}-${product.option}-${product.name}-${product.cartItemId}`} {...product} isInModale={false} />
        ))}
      </div>
    </div>
  );
}
