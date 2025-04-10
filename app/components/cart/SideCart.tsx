"use client";

import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import CartProductCard from "./CartProductCard";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { categories } from "@/app/staticData/categories";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
interface CartProduct {
  id: string;
  quantity: number;
  price: number;
  option?: {
    per: "g" | "unit";
    value: 50;
  };
}

interface Commande {
  customerId: string;
  deliveryAddress: string;
  billingAddress: string;
  fidelityPointUsed: number;
  products: CartProduct[];
}

export default function Cart() {
  const [open, setOpen] = useState(false);

  const { cart } = useProductsAndCart();
  const t = useTranslations("cart");
  const { locale } = useParams();
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isInCategoryPage = categories.has(pathname.split("/")[2]);

  return (
    <>
      {/* ICON NAVBAR */}
      <div className="flex items-center">
        <div className="relative cursor-pointer" onClick={() => setOpen(true)}>
          <ShoppingCartIcon className="w-10 h-10 sm:w-6 sm:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 text-white" />
          <span className="sr-only">Items in shopping cart</span>
          {!!cart?.products?.length && (
            <span className="absolute -top-1 -right-1 text-white bg-red-600 rounded-full text-xs px-1">{cart?.products?.length}</span>
          )}
        </div>
      </div>

      {/* SIDE CART */}
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-neutral-900 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
        />
        <div className="fixed inset-0" />

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <DialogPanel
            transition
            className="pointer-events-auto w-screen max-w-xs sm:max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
          >
            <div
              className={twMerge(
                clsx("relative flex h-full flex-col overflow-y-scroll bg-white shadow-xl pt-3 pb-28 md:pt-28 md:pb-16", {
                  "pb-[150px]": isInCategoryPage,
                  "md:pt-[160px]": isInCategoryPage,
                })
              )}
            >
              <div className="px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <DialogTitle className="text-base font-semibold leading-6 text-neutral-900 capitalize">{t("cart")}</DialogTitle>
                  <div className="ml-3 flex h-7 items-center">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="relative rounded-md bg-white text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <span className="absolute -inset-2.5" />
                      <span className="sr-only">Close panel</span>
                      <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* PRODUCT CARDS CART */}
              {!!cart?.products?.length && (
                <div className="mt-6 md:mt-2 flex-1 px-2">
                  {cart?.products?.map((product) => (
                    <CartProductCard key={`${product.id}-${product.option}-${product.name}-${product.cartItemId}`} {...product} isInModale={false} />
                  ))}
                </div>
              )}

              {/* TOTAL + "PLACE ORDER" BUTTON */}
              <div
                className={twMerge(
                  clsx("fixed bottom-14 sm:bottom-0 flex justify-between items-center w-full px-2 bg-white py-3", {
                    "bottom-[98px]": isInCategoryPage,
                  })
                )}
              >
                <p className="font-semibold text-sm">
                  TOTAL: <span className="text-blue-600">{cart?.total?.toFixed(2)}€</span>
                </p>
                <Link href={`/${locale}/panier`}>
                  <button
                    disabled={!cart?.products?.length}
                    className="bg-green py-1 px-2 text-white rounded-md uppercase text-sm z-[4000] disabled:bg-neutral-400 disabled:cursor-not-allowed"
                  >
                    {t("order")}
                  </button>
                </Link>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
