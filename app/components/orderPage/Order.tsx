"use client";

import { sectionClassname, titleClassname } from "@/app/staticData/cartPageClasses";
import { twMerge } from "tailwind-merge";
import Title from "@/app/components/Title";
import { useOrder } from "@/app/context/orderContext";
import Link from "next/link";
import { useAuth } from "@/app/context/authContext";
import Star from "@/app/components/Star";
import { useMemo } from "react";

export default function Order({ isPending }: { isPending: boolean }) {
  const { order } = useOrder();
  const { userData } = useAuth();

  const isDisabled = useMemo(
    () => order["shipping-method"] === "boxtal_connect" && !order["parcel-point"],
    [order["shipping-method"], order["parcel-point"]]
  );

  return (
    <div aria-labelledby="Commander" className={twMerge(sectionClassname)}>
      <Title title="Commander" type="h2" classname={twMerge(titleClassname)} firstLetterClassname="text-2xl" id="linked-account-discount-code" />
      <span>{order.total.toFixed(2)}€</span>
      {!!order.shippingCost && <span className="text-neutral-500 text-xs italic"> (dont {order.shippingCost.toFixed(2)}€ de frais de port)</span>}
      <p className="mt-2">
        Vos données personnelles seront utilisées pour le traitement de votre commande, vous accompagner au cours de votre visite du site web, et pour
        d’autres raisons décrites dans notre{" "}
        <Link href="/politiques-de-confidentialites" target="_blank" className="text-green underline">
          politique de confidentialité
        </Link>
        .
      </p>

      {!userData && (
        <fieldset className="mt-2">
          <div className="flex gap-x-2 items-center">
            <input type="checkbox" name="condition-generales" id="condition-generales" required />
            <label htmlFor="condition-generales">
              J’ai lu et j’accepte les{" "}
              <Link href="/conditions-generales-de-vente" target="_blank" className="text-green underline">
                conditions générales
              </Link>{" "}
              <Star />
            </label>
          </div>
          <div className="flex gap-x-2 items-center">
            <input type="checkbox" name="actualite-produits" id="actualite-produits" />
            <label htmlFor="actualite-produits">Je souhaite recevoir les actualités concernant les produits et promotions.</label>
          </div>
        </fieldset>
      )}
      <button
        type="submit"
        disabled={isDisabled || isPending}
        className="mt-6 w-full py-2 bg-green text-white rounded-md shadow-md cursor-pointer disabled:bg-neutral-500 disabled:cursor-not-allowed"
      >
        {order["payment-method"] === "secure-3d-card" ? "Payer par carte bancaire" : "Commander"}

        {isDisabled ? <span className="text-sm italic"> (Veuillez choisir un point relais)</span> : ""}
      </button>
    </div>
  );
}
