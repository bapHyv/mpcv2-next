"use client";

import { ProductCart, useCart } from "@/app/cartContext";
import Image from "next/image";
import Separator from "@/app/components/Separator";
import { useTranslations } from "next-intl";

export default function ProductCardCart({
  cartItemId,
  id,
  name,
  quantity,
  option,
  totalPrice,
  unitPrice,
  image,
  per,
}: ProductCart) {
  const { cart, setCart } = useCart();
  const t = useTranslations("productCardCart");

  const removeProduct = () => {
    const _cart = cart.filter((product) => product.cartItemId !== cartItemId);

    setCart(_cart);
  };

  return (
    <>
      <div className="relative flex flex-col border border-neutral-400 rounded-md shadow-xl dark:shadow-neutral-700 dark:shadow-lg bg-neutral-50 dark:bg-black">
        <button
          onClick={removeProduct}
          className="absolute h-6 w-6 bg-red-600 top-1 right-1 flex items-center justify-center text-white rounded-md shadow-sm shadow-black border border-black"
        >
          x
        </button>
        <Image
          src={image.IMAGE_URL}
          alt={image.IMAGE_ALT}
          width={1920}
          height={1080}
          className="rounded-t-md"
        />
        <div className="text-neutral-900 dark:text-neutral-50 p-3 border-t border-neutral-400 md:text-lg">
          <p className="text-lg md:text-xl text-dark-green dark:text-light-green">
            {name}
          </p>
          <Separator classname="bg-neutral-400 dark:bg-neutral-200 mt-0" />

          <p className="mt-4 capitalize">
            {t("nbItem")}
            {quantity > 1 ? "s" : ""}:{" "}
            <span className="text-neutral-600 dark:text-neutral-300">
              {quantity}
            </span>
          </p>

          {/* Will be displayed if the product is either flower, hash, moonrock or infusion */}
          {per === "g" && (
            <p>
              <span className="capitalize">{t("gPrice")}</span>:{" "}
              <span className="text-neutral-600 dark:text-neutral-300">
                {unitPrice} €/{per}
              </span>
            </p>
          )}

          {/* Will only be displayed when the product is oil */}
          {per === "unit" && (
            <p>
              <span className="capitalize">{t("unitPrice")}</span>:{" "}
              <span className="text-neutral-600 dark:text-neutral-300">
                {unitPrice} €/{per}
              </span>
            </p>
          )}

          {!!per && (
            <p>
              <span className="capitalize">{t("quantity")}</span>:{" "}
              <span className="text-neutral-600 dark:text-neutral-300">
                {option} {per}
                {per === "unit" && parseInt(option) > 1 ? "s" : ""}
              </span>
            </p>
          )}

          <p className="mt-4">
            <span className="capitalize">{t("priceOneArticle")}</span>:{" "}
            <span className="text-neutral-600 dark:text-neutral-300">
              {(parseInt(option) * unitPrice).toFixed(2)}€
            </span>
          </p>
          <Separator classname="bg-neutral-400 dark:bg-neutral-200 mb-4 mt-0" />
          <p className="font-medium italic text-right">
            <span className="capitalize">{t("subtotal")}</span>:{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {totalPrice.toFixed(2)}€
            </span>
          </p>
        </div>
      </div>
      <Separator classname="bg-neutral-500 dark:bg-neutral-300 mb-4" />
    </>
  );
}
