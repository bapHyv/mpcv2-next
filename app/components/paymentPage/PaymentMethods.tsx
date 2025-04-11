// PaymentMethods.tsx
"use client";

import Image from "next/image";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

import Title from "@/app/components/Title";
import Star from "@/app/components/Star";
import { useOrder } from "@/app/context/orderContext";
import { sectionWrapperClassname, titleClassname, checkRadioClassname } from "@/app/staticData/cartPageClasses";

export default function PaymentMethods() {
  const { order, handleChange } = useOrder();

  const PaymentOption = ({
    id,
    value,
    title,
    imageSrc,
    imageAlt,
    description,
  }: {
    id: string;
    value: string;
    title: string;
    imageSrc?: string;
    imageAlt?: string;
    description: string;
  }) => {
    const isChecked = order["payment-method"] === value;
    return (
      <div className={clsx("relative flex items-start border border-gray-200 rounded-md p-4", isChecked && "border-green ring-1 ring-green")}>
        {/* Radio Input */}
        <div className="flex h-6 items-center">
          <input
            id={id}
            name="payment-method"
            type="radio"
            value={value}
            checked={isChecked}
            required
            onChange={(e) => handleChange(e)}
            className={checkRadioClassname}
          />
        </div>
        {/* Label, Image, Description */}
        <div className="ml-3 text-sm leading-6 flex-grow">
          <label htmlFor={id} className="font-medium text-gray-900 cursor-pointer flex justify-between items-center w-full">
            <span>{title}</span>
            {/* Optional Image */}
            {imageSrc && imageAlt && <Image width={100} height={20} src={imageSrc} alt={imageAlt} className="object-contain flex-shrink-0 ml-2" />}
          </label>
          {/* Conditional Description */}
          {isChecked && <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">{description}</div>}
        </div>
      </div>
    );
  };

  return (
    <section aria-labelledby="payment-method-heading" className={twMerge(sectionWrapperClassname)}>
      <fieldset>
        <legend className="flex items-center gap-x-1 mb-4">
          <Title
            title="Mode de paiement"
            type="h3"
            classname={twMerge(titleClassname, "!mb-0 text-base")}
            firstLetterClassname="text-xl"
            id="payment-method-heading"
          />
          <Star />
        </legend>

        <div className="space-y-4">
          <PaymentOption
            id="payment-method-secure-3d-card"
            value="secure-3d-card"
            title="Carte Bancaire 3D Secure"
            imageSrc="/cb-visa-mastercard.png"
            imageAlt="CB Visa Mastercard"
            description="En choisissant ce mode de paiement vous pourrez effectuer votre règlement sur le serveur sécurisé de notre banque."
          />

          <PaymentOption
            id="payment-method-bank-transfer"
            value="bank-transfer"
            title="Virement bancaire"
            description="Effectuez le paiement directement depuis votre compte bancaire. Veuillez utiliser l’ID de votre commande comme référence du paiement. Votre commande ne sera pas expédiée tant que les fonds ne seront pas reçus."
          />
        </div>
      </fieldset>
    </section>
  );
}
