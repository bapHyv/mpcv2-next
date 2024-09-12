"use client";

import { useCart } from "@/app/cartContext";
import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ShoppingCartIcon, XMarkIcon } from "@heroicons/react/20/solid";
import CartProductCard from "./CartProductCard";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";

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
  const { cart } = useCart();
  const t = useTranslations("cart");
  const { locale } = useParams();

  // console.log(locale);

  const computeTotal = () => {
    let total = 0;

    cart.forEach((product) => {
      total += product.totalPrice;
    });

    return total;
  };

  return (
    <>
      <div className="flex items-center">
        <div className="relative">
          <ShoppingCartIcon
            onClick={() => setOpen(true)}
            className="w-10 h-10 rounded-full bg-white text-black p-1 cursor-pointer"
          />
          <span className="sr-only">Items in shopping cart</span>
          {!!cart.length && (
            <span className="absolute -top-1 -right-1 text-white bg-red-600 rounded-full text-xs px-1">
              {cart.length}
            </span>
          )}
        </div>
      </div>
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
            <div className="relative flex h-full flex-col overflow-y-scroll bg-white dark:bg-neutral-800 shadow-xl pt-28 pb-16">
              <div className="px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <DialogTitle className="text-base font-semibold leading-6 text-neutral-900 dark:text-neutral-200 capitalize">
                    {t("cart")}
                  </DialogTitle>
                  <div className="ml-3 flex h-7 items-center">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="relative rounded-md bg-white text-neutral-400 hover:text-neutral-500 dark:text-neutral-700 dark:hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <span className="absolute -inset-2.5" />
                      <span className="sr-only">Close panel</span>
                      <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
              {!!cart.length && (
                <div className="mt-6 flex-1 px-2">
                  {/* PRODUCT CART */}
                  {cart.map((product) => (
                    <CartProductCard
                      key={`${product.id}-${product.option}-${product.name}-${product.cartItemId}`}
                      {...product}
                    />
                  ))}
                </div>
              )}
              <div className="fixed bottom-0 flex justify-between items-center w-full px-2 bg-white py-3">
                <p className="font-semibold text-sm">
                  TOTAL:{" "}
                  <span className="text-blue-600 dark:text-blue-400">
                    {computeTotal().toFixed(2)}€
                  </span>
                </p>
                <Link href={`/${locale}/panier`}>
                  <button
                    disabled={!cart.length}
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
