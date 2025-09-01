"use client";

import { XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { v4 as uuid } from "uuid";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

import { ProductCart, useProductsAndCart } from "@/app/context/productsAndCartContext";
import { useAlerts } from "@/app/context/alertsContext";

/**
 *
 * increment quantity is disabled even though there is enough stock
 * features:
 *
 *  productOptions:
 *    Lorsque je clique sur l'une des options, option et price doivent changer dans ProductsAndCartContext.products[productId]
 *    Lorsque je clique sur ajouter au panier, le produit doit s'ajouter dans le panier
 *            ↳ Si le produit existe déjà dans le panier, la quantité doit s'incrémenter
 *    Lorsque le stock est inférieur à l'option, l'option doit être désactivée et ne doit pas être cliquable.
 *    Si le stock est inférieur à toutes les options, toutes les options ainsi que le bouton ajouter au panier doivent être désativées
 */

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
  const t = useTranslations("");

  const productContextData = products ? products[id] : null;
  const currentStock = productContextData ? parseInt(productContextData.stock || "0", 10) : 0;
  const isStockAvailableForIncrement = !isNaN(currentStock) && currentStock >= parseInt(option, 10);
  const pricePer = unitPrice / parseInt(option);

  const removeProduct = () => {
    const updatedCartProducts = cart.products.filter((product) => product.cartItemId !== cartItemId);
    setCart((prevCart) => ({ ...prevCart, products: updatedCartProducts }));
    addAlert(uuid(), t("alerts.cart.productRemoved.text", { name }), t("alerts.cart.productRemoved.title"), "yellow");
  };

  const incrementQuantity = () => {
    if (isStockAvailableForIncrement) {
      setCart((prevCart) => {
        const updatedCartProducts = prevCart.products.map((product) => {
          if (product.cartItemId === cartItemId) {
            const newQuantity = product.quantity + 1;
            return {
              ...product,
              quantity: newQuantity,
              totalPrice: newQuantity * product.unitPrice,
            };
          }
          return product;
        });
        return { ...prevCart, products: updatedCartProducts };
      });
      addAlert(uuid(), t("alerts.cart.quantityAdded.text", { option, per, name }), t("alerts.cart.quantityAdded.title"), "emerald");
    } else {
      addAlert(
        uuid(),
        t("alerts.cart.insufficientStockIncrement.text", { name, option, per }),
        t("alerts.cart.insufficientStockIncrement.title"),
        "yellow"
      );
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setCart((prevCart) => {
        const updatedCartProducts = prevCart.products.map((product) => {
          if (product.cartItemId === cartItemId) {
            const newQuantity = product.quantity - 1;
            return {
              ...product,
              quantity: newQuantity,
              totalPrice: newQuantity * product.unitPrice,
            };
          }
          return product;
        });
        return { ...prevCart, products: updatedCartProducts };
      });
      addAlert(uuid(), t("alerts.cart.quantityRemoved.text", { option, per, name }), t("alerts.cart.quantityRemoved.title"), "yellow");
    }
    // Optional: If quantity is 1, maybe call removeProduct directly or disable button further?
    // Currently, the button is visually disabled below, but logic doesn't prevent click if somehow enabled.
  };

  return (
    <div
      className={twMerge(
        "relative flex border border-gray-200 rounded-md shadow-sm bg-white",
        "mb-3 max-h-[120px] sm:max-h-[140px]",
        isInModale ? "!mb-0 border-none shadow-none" : ""
      )}
    >
      {!isInModale && (
        <button
          type="button"
          onClick={removeProduct}
          aria-label={t("productCardCart.removeAriaLabel", { name })}
          className="absolute z-10 p-0.5 top-1 right-1 text-gray-400 hover:text-gray-600 bg-white/50 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-1 focus:ring-inset focus:ring-red-500"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}

      <div className="flex w-full">
        {/* Image Container */}
        <div className="relative flex-shrink-0 w-1/4 md:w-[92px] md:h-[92px]">
          <Image
            src={!!image ? `https://www.monplancbd.fr/wp-content/uploads/${image.url}` : "/canna-vert.png"}
            alt={!!image ? image.alt : name}
            fill
            sizes="(max-width: 640px) 20vw, 15vw"
            className={clsx("rounded-l-md object-cover", isInModale && "!rounded-md")}
          />
        </div>

        {/* Details Container */}
        <div className="flex-grow p-2 sm:p-3 flex flex-col justify-between text-sm w-3/4 sm:w-2/3">
          <div>
            <p className="font-semibold text-gray-900 truncate text-xs md:text-sm leading-tight w-11/12">{name}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {quantity} x {option} {per} - {pricePer.toFixed(2)}€{t("productCardCart.unitPriceSuffix", { per })}
            </p>
          </div>
          {/* Bottom part: Quantity and Total */}
          <div className="flex items-end justify-between mt-1">
            {!isInModale && productContextData ? (
              <div className="flex items-center gap-x-1 border border-gray-300 bg-white rounded-full px-1 py-0.5 shadow-sm">
                <button type="button" onClick={decrementQuantity} disabled={quantity <= 1} aria-label={t("productCardCart.decreaseQtyAriaLabel")}>
                  <MinusIcon
                    className={twMerge(
                      "h-5 w-5 p-0.5 rounded-full transition-colors",
                      quantity <= 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-100 active:bg-gray-200"
                    )}
                  />
                </button>
                <span className="font-medium text-gray-800 text-sm w-5 text-center tabular-nums">{quantity}</span>
                <button
                  type="button"
                  onClick={incrementQuantity}
                  disabled={!isStockAvailableForIncrement}
                  aria-label={t("productCardCart.increaseQtyAriaLabel")}
                >
                  <PlusIcon
                    className={twMerge(
                      "h-5 w-5 p-0.5 rounded-full transition-colors",
                      !isStockAvailableForIncrement ? "text-gray-300 cursor-not-allowed" : "text-green hover:bg-emerald-50 active:bg-emerald-100"
                    )}
                  />
                </button>
              </div>
            ) : (
              <span className="text-xs text-gray-500">Qty: {quantity}</span>
            )}

            <p className="font-semibold text-sm text-blue-600">{totalPrice.toFixed(2)}€</p>
          </div>
        </div>
      </div>
    </div>
  );
}
