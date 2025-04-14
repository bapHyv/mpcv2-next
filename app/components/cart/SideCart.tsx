"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import CartProductCard from "@/app/components/cart/CartProductCard";
import { buttonClassname } from "@/app/staticData/cartPageClasses";

export default function Cart() {
  const [open, setOpen] = useState(false);
  const { cart } = useProductsAndCart();
  const t = useTranslations("cart");
  const locale = useLocale();
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const cartTotal = cart?.total ?? 0;

  return (
    <>
      <button
        type="button"
        className="relative flex items-center rounded-full p-1 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
        onClick={() => setOpen(true)}
        aria-label={t("iconSR")}
      >
        <span className="sr-only">{t("iconSR")}</span>
        <ShoppingCartIcon className="w-10 h-10 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
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
      <Dialog open={open} onClose={setOpen} className="relative z-50">
        {/* Backdrop */}
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 ease-in-out data-[closed]:opacity-0"
        />
        {/* Panel Container */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-300 ease-in-out data-[closed]:translate-x-full"
              >
                {/* Panel Content */}
                <div className={twMerge("flex h-full flex-col overflow-y-hidden bg-white shadow-xl")}>
                  {/* Header */}
                  <div className="bg-gray-50 px-4 py-4 sm:px-6 border-b border-gray-200">
                    {/* Header background + border */}
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-lg font-semibold leading-6 text-gray-900">{t("title")}</DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="relative rounded-md p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">{t("closeButtonSR")}</span>
                          <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Product List (Scrollable Area) */}
                  <div className="relative flex-1 overflow-y-auto px-4 py-4 sm:px-6">
                    {cart?.products?.length > 0 ? (
                      <ul role="list" className="-my-4 divide-y divide-gray-200">
                        {cart.products.map((product) => (
                          <li key={product.cartItemId} className="py-4">
                            <CartProductCard {...product} isInModale={false} />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center text-gray-500 mt-10">{t("emptyMessage")}</p>
                    )}
                  </div>

                  {/* Footer: Total + Button */}
                  {cart?.products?.length > 0 && (
                    <div className="border-t border-gray-200 px-4 py-4 sm:px-6 bg-gray-50">
                      <div className="flex justify-between text-base font-medium text-gray-900 mb-3">
                        <p>{t("totalLabel")}</p>
                        <p>{cartTotal.toFixed(2)}€</p>
                      </div>
                      <Link href={`/${locale}/panier`} className="block">
                        <button type="button" className={twMerge(buttonClassname, "w-full py-2.5")} disabled={!cart?.products?.length}>
                          {t("checkoutButton")}
                        </button>
                      </Link>
                      <div className="mt-4 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          {t("orSeparator")}{" "}
                          <button type="button" className="font-medium text-green hover:text-opacity-80" onClick={() => setOpen(false)}>
                            {t("continueShoppingButton")} <span aria-hidden="true"> →</span>
                          </button>
                        </p>
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
