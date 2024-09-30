"use client";

import { ProductCart, useCart } from "@/app/cartContext";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/20/solid";
import { useAlerts } from "@/app/alertsContext";
import { v4 as uuid } from "uuid";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { useProducts } from "@/app/productsContext";
import { updateProductLogic } from "@/app/utils/productFunctions";

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
  const { products, setProducts, updateProduct } = useProducts();
  const t = useTranslations("productCardCart");

  // When removing a product from the cart, the cart total and the product's stock must be recomputed
  const removeProduct = () => {
    const updatedCartProducts = cart.products.filter(
      (product) => product.cartItemId !== cartItemId
    );

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

  const alertRemoveProductDescription = `Le produit ${name} a bien été retiré du panier`;

  return (
    <>
      <div className="relative flex border border-neutral-400 rounded-md shadow-xl dark:shadow-neutral-700 dark:shadow-lg bg-neutral-50 dark:bg-black mb-2 max-h-[140px]">
        <XMarkIcon
          onClick={() => {
            removeProduct();
            addAlert(
              uuid(),
              alertRemoveProductDescription,
              "Suppression de produit",
              "yellow"
            );
          }}
          className="absolute h-[22px] w-[22px] top-0.5 right-0.5 text-neutral-500 cursor-pointer rounded-md hover:bg-neutral-100"
        />
        <div className="relative w-1/4 flex items-center justify-center aspect-w-1">
          <Image
            src={`https://www.monplancbd.fr/wp-content/uploads/${image.url}`}
            alt={image.alt}
            width={1920}
            height={1080}
            className="rounded-l-md w-full h-full top-0 left-0 object-cover"
          />
        </div>
        {/*Fleurs, hash, moonrock, infusion: titre \n nb gramme - prix/g*/}
        {/*Huile, soins, vapo titre \n nb unit - prix/unit*/}

        <div className="w-3/4 text-neutral-900 dark:text-neutral-50 p-3 md:text-lg">
          <p className="text-md md:text-lg text-dark-green dark:text-light-green">{name}</p>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm">
              {option} {per} - {unitPrice}€/{per}
            </p>

            <div className="flex items-center gap-x-3 border border-neutral-300 bg-neutral-200 rounded-full">
              <MinusIcon
                onClick={decrementQuantity}
                className={twMerge(
                  clsx(
                    quantity === 1
                      ? "cursor-not-allowed bg-neutral-400"
                      : "cursor-pointer bg-green",
                    "text-white rounded-full h-5 w-5"
                  )
                )}
              />
              <span className="text-sm">{quantity}</span>
              <PlusIcon
                onClick={incrementQuantity}
                className={twMerge(
                  clsx(
                    parseInt(products[id].stock) < parseInt(option)
                      ? "cursor-not-allowed bg-neutral-400"
                      : "cursor-pointer bg-green",
                    "text-white rounded-full h-5 w-5"
                  )
                )}
              />
            </div>
          </div>

          <p className="text-sm text-right">
            {quantity} x {unitPrice.toFixed(2)}€
          </p>

          <p className="font-medium italic text-right text-sm">
            {/* <span className="capitalize">{t("subtotal")}</span>:{" "} */}
            <span className="text-blue-600 dark:text-blue-400">{totalPrice.toFixed(2)}€</span>
          </p>
        </div>
      </div>
    </>
  );
}
