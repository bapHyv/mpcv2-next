"use client";

import { XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { v4 as uuid } from "uuid";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

import { ProductCart, useProductsAndCart } from "@/app/context/productsAndCartContext";
import { useAlerts } from "@/app/context/alertsContext";

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
  const tAlerts = useTranslations("alerts.cart");

  // Ensure product data from context is available
  const productContextData = products ? products[id] : null;
  // Safely parse stock, default to 0 if missing or invalid
  const currentStock = productContextData ? parseInt(productContextData.stock || "0", 10) : 0;
  const isStockAvailableForIncrement = !isNaN(currentStock) && currentStock >= parseInt(option, 10) * (quantity + 1); // Check if enough stock for *next* increment

  // --- Handlers ---
  const removeProduct = () => {
    const updatedCartProducts = cart.products.filter((product) => product.cartItemId !== cartItemId);
    setCart((prevCart) => ({ ...prevCart, products: updatedCartProducts }));
    // Use translated alert
    addAlert(uuid(), tAlerts("productRemoved.text", { name }), tAlerts("productRemoved.title"), "yellow");
  };

  const incrementQuantity = () => {
    // Check if enough stock exists for the *next* item based on the option size
    if (isStockAvailableForIncrement) {
      setCart((prevCart) => {
        const updatedCartProducts = prevCart.products.map((product) => {
          if (product.cartItemId === cartItemId) {
            const newQuantity = product.quantity + 1;
            return {
              ...product,
              quantity: newQuantity,
              totalPrice: newQuantity * product.unitPrice, // Recalculate total
            };
          }
          return product;
        });
        return { ...prevCart, products: updatedCartProducts };
      });
      // Use translated alert with variables
      addAlert(uuid(), tAlerts("quantityAdded.text", { option, per, name }), tAlerts("quantityAdded.title"), "emerald");
    } else {
      // Optional: Alert if cannot increment due to stock
      addAlert(uuid(), `Stock insuffisant pour ajouter plus de ${name} (${option}${per}).`, "Stock Limité", "yellow"); // TODO-TRANSLATION
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
              totalPrice: newQuantity * product.unitPrice, // Recalculate total
            };
          }
          return product;
        });
        return { ...prevCart, products: updatedCartProducts };
      });
      // Use translated alert with variables
      addAlert(uuid(), tAlerts("quantityRemoved.text", { option, per, name }), tAlerts("quantityRemoved.title"), "yellow");
    }
    // Optional: If quantity is 1, maybe call removeProduct directly or disable button further?
    // Currently, the button is visually disabled below, but logic doesn't prevent click if somehow enabled.
  };

  // --- Render ---
  return (
    // Use <> </> fragment if no wrapper needed, otherwise use div
    <div
      className={twMerge(
        "relative flex border border-gray-200 rounded-md shadow-sm bg-white", // Use consistent border/shadow
        "mb-3 max-h-[120px] sm:max-h-[140px]", // Adjusted margin/height
        isInModale ? "!mb-0 border-none shadow-none" : "" // Override for modal
      )}
    >
      {/* Remove Button (Top Right) - Only if not in modal */}
      {!isInModale && (
        <button // Use button element
          type="button"
          onClick={removeProduct}
          aria-label={`Remove ${name}`} // TODO-TRANSLATION
          className="absolute z-10 p-0.5 top-1 right-1 text-gray-400 hover:text-gray-600 bg-white/50 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-1 focus:ring-inset focus:ring-red-500"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}

      {/* Image Container */}
      <div className="relative flex-shrink-0 w-1/4 sm:w-1/3">
        {" "}
        {/* Adjusted width */}
        <Image
          // Use NEXT_PUBLIC_ vars if image path is constructed client-side
          src={!!image ? `https://www.monplancbd.fr/wp-content/uploads/${image.url}` : "/canna-vert.png"}
          alt={!!image ? image.alt : name} // Use product name as fallback alt
          fill // Use fill layout
          sizes="(max-width: 640px) 20vw, 15vw" // Provide sizes
          className={clsx("rounded-l-md object-cover", isInModale && "!rounded-md")} // Cover image, round left (or all in modal)
        />
      </div>

      {/* Details Container */}
      <div className="flex-grow p-2 sm:p-3 flex flex-col justify-between text-sm">
        {" "}
        {/* Use flex-col and justify-between */}
        {/* Top part: Name and Unit Price */}
        <div>
          <p className="font-semibold text-gray-900 truncate text-base leading-tight">{name}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {option}
            {per} - {unitPrice.toFixed(2)}€{t("unitPriceSuffix", { per })} {/* e.g. /g */}
          </p>
        </div>
        {/* Bottom part: Quantity and Total */}
        <div className="flex items-end justify-between mt-1">
          {/* Quantity Control (Only if not in modal) */}
          {!isInModale && productContextData ? ( // Check if productContextData exists
            <div className="flex items-center gap-x-1 border border-gray-300 bg-white rounded-full px-1 py-0.5 shadow-sm">
              <button type="button" onClick={decrementQuantity} disabled={quantity <= 1} aria-label="Decrease quantity">
                {" "}
                {/* TODO-TRANSLATION */}
                <MinusIcon
                  className={twMerge(
                    "h-5 w-5 p-0.5 rounded-full transition-colors",
                    quantity <= 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-100 active:bg-gray-200"
                  )}
                />
              </button>
              <span className="font-medium text-gray-800 text-sm w-5 text-center tabular-nums">{quantity}</span>
              <button type="button" onClick={incrementQuantity} disabled={!isStockAvailableForIncrement} aria-label="Increase quantity">
                {" "}
                {/* TODO-TRANSLATION */}
                <PlusIcon
                  className={twMerge(
                    "h-5 w-5 p-0.5 rounded-full transition-colors",
                    !isStockAvailableForIncrement ? "text-gray-300 cursor-not-allowed" : "text-green hover:bg-emerald-50 active:bg-emerald-100"
                  )}
                />
              </button>
            </div>
          ) : (
            // Display quantity if in modal or no context data
            <span className="text-xs text-gray-500">Qty: {quantity}</span>
          )}

          {/* Total Price */}
          <p className="font-semibold text-base text-blue-600">
            {" "}
            {/* Consistent color */}
            {totalPrice.toFixed(2)}€
          </p>
        </div>
        {/* Old layout commented out for reference
         <p className="text-sm text-right">
           {quantity} x {unitPrice.toFixed(2)}€
         </p>
         <p className="font-medium italic text-right text-sm">
           <span className="text-blue-600">{totalPrice.toFixed(2)}€</span>
         </p>
         */}
      </div>
    </div>
  );
}
