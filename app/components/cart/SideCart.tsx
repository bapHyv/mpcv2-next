"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { ShoppingCartIcon, XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import { v4 as uuid } from "uuid";

import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import CartProductCard from "@/app/components/cart/CartProductCard";
import { buttonClassname, iconClassname, iconHeaderClassname } from "@/app/staticData/cartPageClasses";
import { useAlerts } from "@/app/context/alertsContext";

const SWIPE_CLOSE_THRESHOLD = 75;

export default function Cart() {
  const [open, setOpen] = useState(false);
  const { cart, setCart } = useProductsAndCart();
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const { addAlert } = useAlerts();

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleEmptyCart = () => {
    setCart({ total: 0, products: [] });
    addAlert(uuid(), t("alerts.cart.cartEmptied.text"), t("alerts.cart.cartEmptied.title"), "yellow");
  };

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!open || e.touches.length === 0) return;
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!open || e.touches.length === 0 || touchStartX.current === 0) return;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!open || touchStartX.current === 0) return;

    const deltaX = touchEndX.current - touchStartX.current;

    if (deltaX > SWIPE_CLOSE_THRESHOLD) {
      setOpen(false);
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const cartTotal = cart?.total ?? 0;

  return (
    <>
      <button
        type="button"
        className="relative flex items-center rounded-full p-1 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
        onClick={() => setOpen(true)}
        aria-label={t("cart.iconSR")}
      >
        <span className="sr-only">{t("cart.iconSR")}</span>
        <ShoppingCartIcon className={iconHeaderClassname} />
        {cart?.products?.length > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-medium text-white ring-1 ring-black"
          >
            {cart.products.length}
          </span>
        )}
      </button>

      {/* SIDE CART DIALOG */}
      <Dialog open={open} onClose={setOpen} className="relative z-[8000]">
        {/* Backdrop */}
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 ease-in-out data-[closed]:opacity-0"
        />
        {/* Panel Container */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-16 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-300 ease-in-out data-[closed]:translate-x-full"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Panel Content */}
                <div className={twMerge("flex h-full flex-col overflow-y-hidden bg-white shadow-xl")}>
                  {/* Header */}
                  <div className="bg-gray-50 px-4 py-4 sm:px-6 border-b border-gray-200">
                    {/* Header background + border */}
                    <div className="flex items-end justify-between">
                      <DialogTitle className="text-lg font-semibold leading-6 text-gray-900">{t("cart.title")}</DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="relative flex flex-col justify-center items-center rounded-md p-1 text-gray-900 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">{t("cart.closeButtonSR")}</span>
                          <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                          <span className="text-xxs">{t("cart.close")}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Product List (Scrollable Area) */}
                  <div className="relative flex-1 overflow-y-auto px-1 py-8 sm:px-6">
                    {cart?.products?.length > 0 ? (
                      <ul role="list" className="-my-4">
                        {cart.products.map((product) => (
                          <li key={product.cartItemId} className="py-1">
                            <CartProductCard {...product} isInModale={false} />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center text-gray-500 mt-10">{t("cart.emptyMessage")}</p>
                    )}
                  </div>

                  {/* Footer: Total + Button */}
                  {cart?.products?.length > 0 && (
                    <div className="border-t border-gray-200 px-4 py-4 sm:px-6 bg-gray-50">
                      <div className="flex justify-between text-base font-medium text-gray-900 mb-3">
                        <p>{t("cart.totalLabel")}</p>
                        <p>{cartTotal.toFixed(2)}€</p>
                      </div>
                      <div className="w-full flex gap-x-3">
                        <Link href={`/${locale}/panier`} className="w-1/2">
                          <button
                            type="button"
                            className={twMerge(buttonClassname, "w-full bg-transparent text-green ring-2 ring-green")}
                            disabled={!cart?.products?.length}
                          >
                            {t("cart.checkoutButton")}
                          </button>
                        </Link>
                        <Link href={`/${locale}/expedition`} className="w-1/2">
                          <button type="button" className={twMerge(buttonClassname, "w-full")} disabled={!cart?.products?.length}>
                            {t("cart.shippingButton")}
                          </button>
                        </Link>
                      </div>
                      <div className="mt-4 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          {t("cart.orSeparator")}{" "}
                          <button type="button" className="font-medium text-green hover:text-opacity-80" onClick={() => setOpen(false)}>
                            {t("cart.continueShoppingButton")} <span aria-hidden="true"> →</span>
                          </button>
                        </p>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={handleEmptyCart}
                          type="button"
                          className={twMerge(buttonClassname, "bg-red-600 w-full flex gap-x-2 items-end")}
                        >
                          <TrashIcon className={iconClassname} />
                          <div>
                            <span>{t("alerts.cart.emptyCartButton")}</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
