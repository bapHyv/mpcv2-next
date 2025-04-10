"use client";

import { ProductCart, useProductsAndCart } from "@/app/context/productsAndCartContext";
import { useAlerts } from "@/app/context/alertsContext";

import { XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/20/solid";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { v4 as uuid } from "uuid";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

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
  isInModale,
}: ProductCart & { isInModale: boolean }) {
  const { addAlert } = useAlerts();
  const { cart, setCart, products } = useProductsAndCart();
  const t = useTranslations("productCardCart");

  const removeProduct = () => {
    const updatedCartProducts = cart.products.filter((product) => product.cartItemId !== cartItemId);

    setCart((prevCart) => ({ ...prevCart, products: updatedCartProducts }));
  };

  const incrementQuantity = () => {
    if (parseInt(products[id].stock) >= parseInt(option)) {
      setCart((prevCart) => {
        const updatedCartProducts = prevCart.products.map((product) => {
          if (product.cartItemId === cartItemId) {
            return {
              ...product,
              quantity: product.quantity + 1,
              totalPrice: (product.quantity + 1) * product.unitPrice,
            };
          }
          return product;
        });

        return { ...prevCart, products: updatedCartProducts };
      });

      const alertAddQuantityDescription = `Vous avez bien ajouté ${option} ${per} du produit: ${name}`;
      addAlert(uuid(), alertAddQuantityDescription, "Ajout de produit", "emerald");
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setCart((prevCart) => {
        const updatedCartProducts = prevCart.products.map((product) => {
          if (product.cartItemId === cartItemId) {
            return {
              ...product,
              quantity: product.quantity - 1,
              totalPrice: (product.quantity - 1) * product.unitPrice,
            };
          }
          return product;
        });

        return { ...prevCart, products: updatedCartProducts };
      });

      const alertRemoveQuantityDescription = `Vous avez retiré ${option} ${per} du produit: ${name}`;
      addAlert(uuid(), alertRemoveQuantityDescription, "Ajout de produit", "yellow");
    }
  };

  return (
    <>
      <div
        className={twMerge(
          clsx("relative flex border border-neutral-400 rounded-md shadow-xl bg-neutral-50 mb-2 max-h-[140px]", { "mb-0": isInModale })
        )}
      >
        {!isInModale && (
          <XMarkIcon
            onClick={() => {
              removeProduct();
              addAlert(uuid(), `Le produit ${name} a bien été retiré du panier`, "Suppression de produit", "yellow");
            }}
            className="absolute h-[22px] w-[22px] top-0.5 right-0.5 text-neutral-700 cursor-pointer rounded-md hover:bg-neutral-100"
          />
        )}
        <div className="relative w-1/4 flex items-center justify-center aspect-w-1">
          <Image
            src={!!image?.url ? `https://www.monplancbd.fr/wp-content/uploads/${image.url}` : "/canna-vert.png"}
            alt={!!image?.url ? image.alt : "logo monplancbd"}
            width={1920}
            height={1080}
            className="rounded-l-md w-full h-full top-0 left-0 object-cover"
          />
        </div>
        {/*Fleurs, hash, moonrock, infusion: titre \n nb gramme - prix/g*/}
        {/*Huile, soins, vapo titre \n nb unit - prix/unit*/}

        <div className="w-3/4 text-neutral-900 p-3 md:text-lg">
          <div className="w-full">
            <p className="text-md text-ellipsis overflow-hidden text-nowrap md:text-lg text-dark-green">{name}</p>
          </div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm">
              {option} {per} - {unitPrice}€/{per}
            </p>

            {!isInModale && (
              <div className="flex items-center gap-x-3 border border-neutral-300 bg-neutral-200 rounded-full">
                <MinusIcon
                  onClick={decrementQuantity}
                  className={twMerge(
                    clsx(quantity === 1 ? "cursor-not-allowed bg-neutral-400" : "cursor-pointer bg-green", "text-white rounded-full h-5 w-5")
                  )}
                />
                <span className="text-sm">{quantity}</span>
                <PlusIcon
                  onClick={incrementQuantity}
                  className={twMerge(
                    clsx(
                      parseInt(products[id]?.stock) < parseInt(option) ? "cursor-not-allowed bg-neutral-400" : "cursor-pointer bg-green",
                      "text-white rounded-full h-5 w-5"
                    )
                  )}
                />
              </div>
            )}
          </div>

          <p className="text-sm text-right">
            {quantity} x {unitPrice.toFixed(2)}€
          </p>

          <p className="font-medium italic text-right text-sm">
            {/* <span className="capitalize">{t("subtotal")}</span>:{" "} */}
            <span className="text-blue-600">{totalPrice.toFixed(2)}€</span>
          </p>
        </div>
      </div>
    </>
  );
}
