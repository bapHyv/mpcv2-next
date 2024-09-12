"use client";

import { ProductCart, useCart } from "@/app/cartContext";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useAlerts } from "@/app/alertsContext";
import { v4 as uuid } from "uuid";

export default function CartProductCard({
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
  const { addAlert } = useAlerts();
  const { cart, setCart } = useCart();
  const t = useTranslations("productCardCart");

  const removeProduct = () => {
    const _cart = cart.filter((product) => product.cartItemId !== cartItemId);
    setCart(_cart);
  };

  const alertDescription = `Le produit ${name} a bien été retiré du panier`;

  return (
    <>
      <div className="relative flex border border-neutral-400 rounded-md shadow-xl dark:shadow-neutral-700 dark:shadow-lg bg-neutral-50 dark:bg-black mb-2 max-h-[140px]">
        <XMarkIcon
          onClick={() => {
            removeProduct();
            addAlert(
              uuid(),
              alertDescription,
              "Suppression de produit",
              "yellow"
            );
          }}
          className="absolute h-[22px] w-[22px] top-0.5 right-0.5 text-neutral-500 cursor-pointer rounded-md hover:bg-neutral-100"
        />
        <div className="relative w-1/4 flex items-center justify-center aspect-w-1">
          <Image
            src={image.url}
            alt={image.url}
            width={1920}
            height={1080}
            objectFit="cover"
            className="rounded-l-md w-full h-full top-0 left-0 object-cover"
          />
        </div>
        {/*Fleurs, hash, moonrock, infusion: titre \n nb gramme - prix/g*/}
        {/*Huile, soins, vapo titre \n nb unit - prix/unit*/}

        <div className="w-3/4 text-neutral-900 dark:text-neutral-50 p-3 md:text-lg">
          <p className="text-md md:text-lg text-dark-green dark:text-light-green">
            {name}
          </p>
          <p className="text-sm">
            {option} {per} - {unitPrice}€/{per}
          </p>

          <p className="text-sm text-right">
            {quantity} x {(parseInt(option) * unitPrice).toFixed(2)}€
          </p>

          <p className="font-medium italic text-right text-sm">
            {/* <span className="capitalize">{t("subtotal")}</span>:{" "} */}
            <span className="text-blue-600 dark:text-blue-400">
              {totalPrice.toFixed(2)}€
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
