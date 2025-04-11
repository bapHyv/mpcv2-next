// Total.tsx (Payment Page)
"use client";

import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { ArrowPathIcon } from "@heroicons/react/20/solid";

import Title from "@/app/components/Title";
import { useAuth } from "@/app/context/authContext";
import { useOrder } from "@/app/context/orderContext";
import { sectionWrapperClassname, titleClassname, buttonClassname } from "@/app/staticData/cartPageClasses";

export default function Total({ isPending }: { isPending: boolean }) {
  const { order } = useOrder();
  const { userData } = useAuth();

  const finalTotal = order.total;

  return (
    <section aria-labelledby="payment-total-heading" className={twMerge(sectionWrapperClassname)}>
      <Title
        title="Récapitulatif Final"
        type="h3"
        classname={twMerge(titleClassname, "mb-4 text-base")}
        firstLetterClassname="text-xl"
        id="payment-total-heading"
      />

      <div className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-3">
        <span className="text-base font-medium text-gray-600 block mb-1">Montant total à payer:</span>
        <span className="text-2xl">{finalTotal.toFixed(2)}€</span>
        {!!order.shippingCost && order.shippingCost > 0 && (
          <span className="block text-xs font-normal text-gray-500 ml-1 mt-0.5">(dont {order.shippingCost.toFixed(2)}€ de frais de port)</span>
        )}
      </div>

      <p className="text-xs text-gray-600 my-4">
        Vos données personnelles seront utilisées pour le traitement de votre commande, vous accompagner au cours de votre visite du site web, et pour
        d’autres raisons décrites dans notre{" "}
        <Link href="/politiques-de-confidentialites" target="_blank" className="text-green underline hover:text-dark-green">
          politique de confidentialité
        </Link>
        .
      </p>

      <div className="mt-6">
        <button
          type="submit"
          disabled={isPending || !order["payment-method"]}
          className={twMerge(buttonClassname, "w-full py-3 text-base flex items-center justify-center")}
        >
          {isPending ? (
            <>
              <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" aria-hidden="true" />
              Traitement...
            </>
          ) : !order["payment-method"] ? (
            "Veuillez choisir une méthode de paiement"
          ) : order["payment-method"] === "bank-transfer" ? (
            "Valider la commande (Virement)"
          ) : (
            "Procéder au paiement sécurisé"
          )}
        </button>
      </div>
    </section>
  );
}
