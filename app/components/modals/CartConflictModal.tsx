"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { twMerge } from "tailwind-merge";

import { ProductCart, useProductsAndCart } from "@/app/context/productsAndCartContext";
import { disableBodyScroll, enableBodyScroll } from "@/app/utils/bodyScroll";
import { buttonClassname } from "@/app/staticData/cartPageClasses";
import CartProductCard from "@/app/components/cart/CartProductCard";
import { useFetchWrapper } from "@/app/hooks/useFetchWrapper";

interface CartConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResolve: (choice: "local" | "remote", cart: { total: number; products: ProductCart[] }) => void;
  localCart: { total: number; products: ProductCart[] };
  remoteCart: { total: number; products: ProductCart[] };
}

const CartDisplay = ({ title, cart }: { title: string; cart: { total: number; products: ProductCart[] } }) => {
  const t = useTranslations("cartConflictModal");
  return (
    <div className="flex flex-col w-full border border-gray-200 rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 p-4 border-b bg-gray-50 rounded-t-lg">{title}</h3>
      <div className="overflow-y-auto p-4 flex-grow max-h-[40vh]">
        {cart?.products?.length > 0 ? (
          cart?.products?.map((product) => <CartProductCard key={product.cartItemId} {...product} isInModale={true} />)
        ) : (
          <p className="text-sm text-gray-500 text-center py-8">Cart is empty.</p>
        )}
      </div>
      <div className="p-4 border-t font-semibold flex justify-between items-center bg-gray-50 rounded-b-lg">
        <span>{t("totalLabel")}:</span>
        <span>{cart?.total?.toFixed(2)}€</span>
      </div>
    </div>
  );
};

export default function CartConflictModal({ isOpen, onClose, onResolve, localCart, remoteCart }: CartConflictModalProps) {
  const t = useTranslations("cartConflictModal");
  const { cart } = useProductsAndCart();
  const { fetchWrapper } = useFetchWrapper();

  const keepLocalCart = async (callback: () => void) => {
    const cartBkp = JSON.stringify(localCart);

    const response = await fetchWrapper("/api/user/backup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartBkp,
      }),
    });

    // Only update the state if the backup is successful
    if (response.ok) {
      console.log("Backup successful.");
      callback();
    }
  };

  useEffect(() => {
    if (isOpen) {
      disableBodyScroll();
    } else {
      enableBodyScroll();
    }
    return () => enableBodyScroll();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm p-4"
      onMouseDown={() => {
        keepLocalCart(onClose);
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-conflict-title"
    >
      <div
        className="bg-gray-100 rounded-xl p-4 sm:p-6 shadow-2xl w-full max-w-4xl mx-auto flex flex-col max-h-[90vh]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex-shrink-0 mb-4 pb-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 id="cart-conflict-title" className="text-xl sm:text-2xl font-bold text-gray-900">
              {t("title")}
            </h2>
            <button
              type="button"
              onClick={() => {
                keepLocalCart(onClose);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green rounded-md"
              aria-label={t("closeAriaLabel")}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">{t("description")}</p>
        </div>

        {/* Carts Comparison */}
        <div className="flex-grow overflow-y-auto pr-2 -mr-2">
          {" "}
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
            <CartDisplay title={t("remoteCartTitle")} cart={remoteCart} />
            <CartDisplay title={t("localCartTitle")} cart={localCart} />
          </div>
        </div>

        {/* Modal Footer with Action Buttons */}
        <div className="flex-shrink-0 mt-6 pt-5 border-t border-gray-200 flex flex-col sm:flex-row-reverse sm:items-center gap-3">
          <button
            type="button"
            onClick={() => {
              keepLocalCart(() => {
                onResolve("local", cart);
              });
            }}
            className={twMerge(buttonClassname, "w-full sm:w-auto")}
          >
            {t("keepLocalButton")}
          </button>
          <button
            type="button"
            onClick={() => onResolve("remote", cart)}
            className={twMerge(buttonClassname, "w-full sm:w-auto", "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50")}
          >
            {t("useRemoteButton")}
          </button>
        </div>
      </div>
    </div>
  );
}
