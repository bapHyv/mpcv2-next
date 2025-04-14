"use client";

import Image from "next/image";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { useTranslations } from "next-intl";

import Title from "@/app/components/Title";
import Star from "@/app/components/Star";
import { useOrder } from "@/app/context/orderContext";
import { sectionWrapperClassname, titleClassname, checkRadioClassname } from "@/app/staticData/cartPageClasses";

const PaymentOption = ({
  id,
  value,
  title,
  imageSrc,
  imageAlt,
  description,
  isChecked,
  handleChange,
}: {
  id: string;
  value: string;
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  description: string;
  isChecked: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className={clsx("relative flex items-start border border-gray-200 rounded-md p-4", isChecked && "border-green ring-1 ring-green")}>
      <div className="flex h-6 items-center">
        <input
          id={id}
          name="payment-method"
          type="radio"
          value={value}
          checked={isChecked}
          required
          onChange={handleChange}
          className={checkRadioClassname}
        />
      </div>
      <div className="ml-3 text-sm leading-6 flex-grow">
        <label htmlFor={id} className="font-medium text-gray-900 cursor-pointer flex justify-between items-center w-full">
          <span>{title}</span>
          {imageSrc && imageAlt && <Image width={100} height={20} src={imageSrc} alt={imageAlt} className="object-contain flex-shrink-0 ml-2" />}
        </label>
        {isChecked && <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">{description}</div>}
      </div>
    </div>
  );
};

export default function PaymentMethods() {
  const t = useTranslations("paymentPage.paymentMethods");
  const { order, handleChange } = useOrder();

  return (
    <section aria-labelledby="payment-method-heading" className={twMerge(sectionWrapperClassname)}>
      <fieldset>
        <legend className="flex items-center gap-x-1 mb-4">
          <Title
            title={t("title")}
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
            title={t("cardTitle")}
            imageSrc="/cb-visa-mastercard.png"
            imageAlt={t("cardImageAlt")}
            description={t("cardDescription")}
            isChecked={order["payment-method"] === "secure-3d-card"}
            handleChange={handleChange}
          />

          {/* Bank Transfer Option */}
          <PaymentOption
            id="payment-method-bank-transfer"
            value="bank-transfer"
            title={t("bankTransferTitle")}
            description={t("bankTransferDescription")}
            isChecked={order["payment-method"] === "bank-transfer"}
            handleChange={handleChange}
          />
        </div>
      </fieldset>
    </section>
  );
}
