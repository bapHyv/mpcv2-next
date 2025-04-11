// Total.tsx
"use client";

import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { useMemo } from "react";
import { ArrowPathIcon } from "@heroicons/react/20/solid"; // For pending state

import Star from "@/app/components/Star";
import Title from "@/app/components/Title";
import { useAuth } from "@/app/context/authContext";
import { useOrder } from "@/app/context/orderContext";
// Import refined classes
import { sectionWrapperClassname, titleClassname, buttonClassname, checkRadioClassname } from "@/app/staticData/cartPageClasses";

export default function Total({ isPending }: { isPending: boolean }) {
  // Renamed component from 'Order'
  // Keep hooks
  const { order } = useOrder();
  const { userData } = useAuth();

  // Keep isDisabled logic
  const isDisabled = useMemo(() => isPending || (order["shipping-method"] === "boxtal_connect" && !order["parcel-point"]), [isPending, order]);

  // Calculate final total including shipping
  const finalTotalWithShipping = order.total; // order.total already includes shipping cost

  return (
    // Use standard section wrapper
    <section aria-labelledby="total-heading" className={twMerge(sectionWrapperClassname)}>
      <Title
        title="Total Commande"
        type="h3" // Use h3 for hierarchy
        classname={twMerge(titleClassname, "mb-4 text-base")} // Adjust size/margin
        firstLetterClassname="text-xl"
        id="total-heading"
      />

      {/* Display Final Total */}
      <div className="text-lg font-semibold text-gray-900 mb-3">
        <span>{finalTotalWithShipping.toFixed(2)}€</span>
        {!!order.shippingCost && order.shippingCost > 0 && (
          <span className="text-sm font-normal text-gray-500 ml-1">(dont {order.shippingCost.toFixed(2)}€ de frais de port)</span>
        )}
      </div>

      {/* Privacy Policy Text */}
      <p className="text-xs text-gray-600 mb-4">
        Vos données personnelles seront utilisées pour le traitement de votre commande, vous accompagner au cours de votre visite du site web, et pour
        d’autres raisons décrites dans notre{" "}
        <Link href="/politiques-de-confidentialites" target="_blank" className="text-green underline hover:text-dark-green">
          politique de confidentialité
        </Link>
        .
      </p>

      {/* Conditional Checkboxes */}
      {!userData && (
        <fieldset className="mb-6 space-y-3">
          {" "}
          {/* Spacing for checkboxes */}
          <legend className="sr-only">Conditions et Marketing</legend>
          {/* Terms and Conditions Checkbox */}
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="condition-generales"
                name="condition-generales"
                type="checkbox"
                required
                className={checkRadioClassname} // Apply style
              />
            </div>
            <div className="ml-3 text-sm leading-6">
              <label htmlFor="condition-generales" className="text-gray-700 cursor-pointer">
                J’ai lu et j’accepte les{" "}
                <Link href="/conditions-generales-de-vente" target="_blank" className="text-green underline font-medium hover:text-dark-green">
                  conditions générales
                </Link>{" "}
                <Star />
              </label>
            </div>
          </div>
          {/* Marketing Opt-in Checkbox */}
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="optInMarketing"
                name="optInMarketing"
                type="checkbox"
                className={checkRadioClassname} // Apply style
              />
            </div>
            <div className="ml-3 text-sm leading-6">
              <label htmlFor="optInMarketing" className="text-gray-700 cursor-pointer">
                Je souhaite recevoir les actualités concernant les produits et promotions.
              </label>
            </div>
          </div>
        </fieldset>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isDisabled || isPending} // Disable if pending or specific conditions met
        // Use refined button class, make it full width and larger
        className={twMerge(buttonClassname, "w-full py-3 text-base")}
      >
        {isPending ? (
          <>
            <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" aria-hidden="true" />
            Traitement...
          </>
        ) : isDisabled && order["shipping-method"] === "boxtal_connect" ? (
          "Veuillez choisir un point relais"
        ) : userData ? (
          "Procéder au paiement"
        ) : (
          "Créer compte et payer"
        ) // Different text based on login status
        }
      </button>
      {/* Add a message if parcel point is needed but not selected */}
      {isDisabled && order["shipping-method"] === "boxtal_connect" && !isPending && (
        <p className="text-center text-xs text-red-600 mt-2">Sélectionnez un point relais sur la carte ci-dessus.</p>
      )}
    </section>
  );
}
