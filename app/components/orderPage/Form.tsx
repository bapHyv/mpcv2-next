"use client";

import React, { useEffect, useMemo, useState } from "react";
import Title from "../Title";
import { twMerge } from "tailwind-merge";

import { useSse } from "@/app/context/sseContext";
import { sectionClassname, titleClassname } from "@/app/staticData/cartPageClasses";
import { useAuth } from "@/app/context/authContext";
import { province } from "@/app/staticData/provinces";
import { useOrder } from "@/app/context/orderContext";
import Star from "@/app/components/Star";
import { billingAddress } from "@/app/types/orderTypes";
import clsx from "clsx";

interface Props {
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  formData: {
    [x: string]: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      [x: string]: string;
    }>
  >;
}

export default function Form({ handleChange, formData, setFormData }: Props) {
  const { sseData } = useSse();
  const { userData } = useAuth();
  const { setOrder } = useOrder();

  const shippingAddress = useMemo(() => {
    if (userData) return userData.addresses.find((address) => address.shipping);
    return undefined;
  }, [userData]);

  const billingAddress = useMemo(() => {
    if (userData) return userData.addresses.find((address) => address.billing);
    return undefined;
  }, [userData]);

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      "shipping-firstname": shippingAddress ? shippingAddress.firstname : "",
      "shipping-lastname": shippingAddress ? shippingAddress.lastname : "",
      "shipping-company": shippingAddress ? shippingAddress.company : "",
      "shipping-country": shippingAddress ? shippingAddress.country : sseData ? Object.keys(sseData?.shippingMethods.byShippingZones)[0] : "",
      "shipping-address1": shippingAddress ? shippingAddress.address1 : "",
      "shipping-address2": shippingAddress ? shippingAddress.address2 : "",
      "shipping-postalCode": shippingAddress ? shippingAddress.postalCode : "",
      "shipping-city": shippingAddress ? shippingAddress.city : "",
      "shipping-province": "",
      "shipping-phone": shippingAddress ? shippingAddress.phone : "",
      "shipping-email": shippingAddress ? shippingAddress.email : "",
      "shipping-password": "",
      "billing-firstname": billingAddress ? billingAddress.firstname : "",
      "billing-lastname": billingAddress ? billingAddress.lastname : "",
      "billing-company": billingAddress ? billingAddress.company : "",
      "billing-country": billingAddress ? billingAddress.country : sseData ? Object.keys(sseData?.shippingMethods.byShippingZones)[0] : "",
      "billing-address1": billingAddress ? billingAddress.address1 : "",
      "billing-address2": billingAddress ? billingAddress.address2 : "",
      "billing-postalCode": billingAddress ? billingAddress.postalCode : "",
      "billing-city": billingAddress ? billingAddress.city : "",
      "billing-province": "",
      "billing-phone": billingAddress ? billingAddress.phone : "",
      "billing-email": billingAddress ? billingAddress.email : "",
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shippingAddress, billingAddress]);

  useEffect(() => {
    if (formData.province) {
      setFormData((prevState) => ({ ...prevState, province: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.country]);

  useEffect(() => {
    setOrder((prevState) => {
      return {
        ...prevState,
        shippingAddress: {
          firstname: formData["shipping-firstname"],
          lastname: formData["shipping-lastname"],
          company: formData["shipping-company"],
          country: formData["shipping-country"],
          address1: formData["shipping-address1"],
          address2: formData["shipping-address2"],
          postalCode: formData["shipping-postalCode"],
          city: formData["shipping-city"],
          province: formData["shipping-province"],
          phone: formData["shipping-phone"],
          email: formData["shipping-email"],
          password: "",
        },
        billingAddress: {
          firstname: formData["billing-firstname"],
          lastname: formData["billing-lastname"],
          company: formData["billing-company"],
          country: formData["billing-country"],
          address1: formData["billing-address1"],
          address2: formData["billing-address2"],
          postalCode: formData["billing-postalCode"],
          city: formData["billing-city"],
          province: formData["billing-province"],
          phone: formData["billing-phone"],
          email: formData["billing-email"],
        },
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  /**
   * Deals with the following edge case:
   * The user click on differentBilling, fills up the form then changes his mind.
   * The billingAddress must be empty to avoir billing it to the wrong address.
   */
  useEffect(() => {
    if (formData["different-billing"] === "false") {
      setOrder((prevState) => ({
        ...prevState,
        billingAddress: {} as billingAddress,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData["different-billing"]]);

  return (
    <>
      <div aria-labelledby="shipping address" className={twMerge(sectionClassname, "bg-white")}>
        <Title
          title="Adresse de livraison"
          type="h2"
          classname={twMerge(titleClassname)}
          firstLetterClassname="text-2xl"
          id="linked-account-discount-code"
        />
        <fieldset aria-label="informations personnelles adresse de livraison">
          <legend className="font-bold">Informations personnelles</legend>
          <div className="mt-2 flex flex-col">
            <label htmlFor="shipping-firstname">Prénom {<Star />}</label>
            <input
              type="text"
              id="shipping-firstname"
              name="shipping-firstname"
              value={formData[`shipping-firstname`]}
              onChange={handleChange}
              required
              autoComplete="shipping given-name"
              aria-label="first name"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="mt-2 flex flex-col">
            <label htmlFor="shipping-lastname">Nom {<Star />}</label>
            <input
              type="text"
              id="shipping-lastname"
              name="shipping-lastname"
              value={formData[`shipping-lastname`]}
              onChange={handleChange}
              required
              autoComplete="shipping family-name"
              aria-label="last name"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="mt-2 flex flex-col">
            <label htmlFor="shipping-company">Nom de l&apos;entreprise (facultatif)</label>
            <input
              type="text"
              id="shipping-company"
              name="shipping-company"
              value={formData[`shipping-company`]}
              onChange={handleChange}
              aria-label="company"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black"
            />
          </div>
        </fieldset>
        <fieldset className="mt-6" aria-label="informations adresse de livraison">
          <legend className="font-bold">Informations d&apos;adresse</legend>
          <div className="mt-2 flex flex-col">
            <label htmlFor="shipping-country">Pays/régions {<Star />}</label>
            <select
              name="shipping-country"
              id="shipping-country"
              value={formData[`shipping-country`]}
              onChange={handleChange}
              required
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black"
            >
              {sseData &&
                Object.keys(sseData.shippingMethods.byShippingZones).map((s, i) => (
                  <option key={s + i} value={s}>
                    {s}
                  </option>
                ))}
            </select>
          </div>
          <div className="mt-2 flex flex-col">
            <label htmlFor="shipping-address1">Numéro et nom de rue {<Star />}</label>
            <input
              type="text"
              id="shipping-address1"
              name="shipping-address1"
              value={formData[`shipping-address1`]}
              onChange={handleChange}
              required
              placeholder="Numéro de voie et nom de la rue"
              autoComplete="shipping address-line1"
              aria-label="Numéro et nom de rue"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="mt-2 flex flex-col">
            <input
              type="text"
              id="shipping-address2"
              name="shipping-address2"
              value={formData[`shipping-address2`]}
              onChange={handleChange}
              placeholder="Bâtiment, appartement, lot, etc (facultatif)"
              autoComplete="shipping address-line2"
              aria-label="Adresse ligne 2"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="mt-2 flex flex-col">
            <label htmlFor="shipping-postal-code">Code postal {<Star />}</label>
            <input
              type="text"
              id="shipping-postal-code"
              name="shipping-postalCode"
              value={formData[`shipping-postalCode`]}
              onChange={handleChange}
              required
              autoComplete="shipping postal-code"
              aria-label="Code postal"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="mt-2 flex flex-col">
            <label htmlFor="shipping-city">Ville {<Star />}</label>
            <input
              type="text"
              id="shipping-city"
              name="shipping-city"
              value={formData[`shipping-city`]}
              onChange={handleChange}
              required
              autoComplete="shipping address-level2"
              aria-label="Ville"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black"
            />
          </div>
          {formData.country in province && (
            <div className="mt-2 flex flex-col">
              <label htmlFor="shipping-province">
                {province[formData.country as keyof typeof province].name} {province[formData.country as keyof typeof province].required && <Star />}
              </label>
              <select
                name="shipping-province"
                id="shipping-province"
                value={formData[`shipping-province`]}
                onChange={handleChange}
                required={province[formData.country as keyof typeof province].required}
                className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black"
              >
                <option value="">Veuillez selectionner une option...</option>
                {province[formData.country as keyof typeof province].options.map((s, i) => (
                  <option key={s.key} value={s.value}>
                    {s.key}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="mt-2 flex flex-col">
            <label htmlFor="shipping-phone">Téléphone {<Star />}</label>
            <input
              type="tel"
              id="shipping-phone"
              name="shipping-phone"
              value={formData[`shipping-phone`]}
              onChange={handleChange}
              required
              autoComplete="shipping tel"
              aria-label="Téléphone"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="mt-2 flex flex-col">
            <label htmlFor="shipping-email">Adresse e-mail {<Star />}</label>
            <input
              type="email"
              id="shipping-email"
              name="shipping-email"
              value={formData[`shipping-email`]}
              onChange={handleChange}
              required
              autoComplete="shipping email"
              aria-label="Adresse e-mail"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black"
            />
          </div>
          {!userData && (
            <div className="mt-2 flex flex-col">
              <label htmlFor="shipping-password">Mot de passe {<Star />}</label>
              <input
                type="password"
                id="shipping-password"
                name="shipping-password"
                value={formData[`shipping-password`]}
                onChange={handleChange}
                required
                aria-label="password"
                className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black"
              />
            </div>
          )}
        </fieldset>
      </div>

      {/* DIFFERENT BILLING ADDRESS */}
      <div aria-labelledby="differeng billing address checkbox" className={twMerge(sectionClassname)}>
        <div className="flex gap-x-2 items-center">
          <input
            type="checkbox"
            name="different-billing"
            id="different-billing"
            checked={formData["different-billing"] === "true"}
            onChange={(e) => handleChange(e)}
            aria-label="different billing"
            className="focus:ring-1 focus:ring-black checked:bg-green focus:checked:bg-light-green"
          />
          <label htmlFor="different-billing" className="cursor-pointer">
            Expédier à une adresse différente ?
          </label>
        </div>
      </div>

      {/* BILLING ADDRESS */}
      <div className={clsx({ hidden: formData["different-billing"] === "false" })}>
        <Title
          title="Adresse de facturation"
          type="h2"
          classname={twMerge(titleClassname, "mt-6")}
          firstLetterClassname="text-2xl"
          id="linked-account-discount-code"
        />
        <fieldset aria-label="informations personnelles adresse de facturation">
          <legend className="font-bold">Informations personnelles</legend>
          <div className="mt-2 flex flex-col">
            <label htmlFor="billing-firstname">Prénom {<Star />}</label>
            <input
              type="text"
              id="billing-firstname"
              name="billing-firstname"
              value={formData[`billing-firstname`]}
              onChange={handleChange}
              required
              autoComplete="billing given-name"
              aria-label="first name"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="mt-2 flex flex-col">
            <label htmlFor="billing-lastname">Nom {<Star />}</label>
            <input
              type="text"
              id="billing-lastname"
              name="billing-lastname"
              value={formData[`billing-lastname`]}
              onChange={handleChange}
              required
              autoComplete="billing family-name"
              aria-label="last name"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="mt-2 flex flex-col">
            <label htmlFor="billing-company">Nom de l&apos;entreprise (facultatif)</label>
            <input
              type="text"
              id="billing-company"
              name="billing-company"
              value={formData[`billing-company`]}
              onChange={handleChange}
              aria-label="company"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black"
            />
          </div>
        </fieldset>
        <fieldset className="mt-6" aria-label="information adresse de facturation">
          <legend className="font-bold">Informations d&apos;adresse</legend>
          <div className="mt-2 flex flex-col">
            <label htmlFor="billing-country">Pays/régions {<Star />}</label>
            <select
              name="billing-country"
              id="billing-country"
              value={formData[`billing-country`]}
              onChange={handleChange}
              required
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black"
            >
              {sseData &&
                Object.keys(sseData.shippingMethods.byShippingZones).map((s, i) => (
                  <option key={s + i} value={s}>
                    {s}
                  </option>
                ))}
            </select>
          </div>
          <div className="mt-2 flex flex-col">
            <label htmlFor="billing-address1">Numéro et nom de rue {<Star />}</label>
            <input
              type="text"
              id="billing-address1"
              name="billing-address1"
              value={formData[`billing-address1`]}
              onChange={handleChange}
              required
              placeholder="Numéro de voie et nom de la rue"
              autoComplete="billing address-line1"
              aria-label="Numéro et nom de rue"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="mt-2 flex flex-col">
            <input
              type="text"
              id="billing-address2"
              name="billing-address2"
              value={formData[`billing-address2`]}
              onChange={handleChange}
              placeholder="Bâtiment, appartement, lot, etc (facultatif)"
              autoComplete="billing address-line2"
              aria-label="Adresse ligne 2"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="mt-2 flex flex-col">
            <label htmlFor="billing-postal-code">Code postal {<Star />}</label>
            <input
              type="text"
              id="billing-postal-code"
              name="billing-postalCode"
              value={formData[`billing-postalCode`]}
              onChange={handleChange}
              required
              autoComplete="billing postal-code"
              aria-label="Code postal"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="mt-2 flex flex-col">
            <label htmlFor="billing-city">Ville {<Star />}</label>
            <input
              type="text"
              id="billing-city"
              name="billing-city"
              value={formData[`billing-city`]}
              onChange={handleChange}
              required
              autoComplete="billing address-level2"
              aria-label="Ville"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black"
            />
          </div>
          {formData.country in province && (
            <div className="mt-2 flex flex-col">
              <label htmlFor="billing-province">
                {province[formData.country as keyof typeof province].name} {province[formData.country as keyof typeof province].required && <Star />}
              </label>
              <select
                name="billing-province"
                id="billing-province"
                value={formData[`billing-province`]}
                onChange={handleChange}
                required={province[formData.country as keyof typeof province].required}
                className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black"
              >
                <option value="">Veuillez selectionner une option...</option>
                {province[formData.country as keyof typeof province].options.map((s, i) => (
                  <option key={s.key} value={s.value}>
                    {s.key}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="mt-2 flex flex-col">
            <label htmlFor="billing-phone">Téléphone {<Star />}</label>
            <input
              type="tel"
              id="billing-phone"
              name="billing-phone"
              value={formData[`billing-phone`]}
              onChange={handleChange}
              required
              autoComplete="billing tel"
              aria-label="Téléphone"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="mt-2 flex flex-col">
            <label htmlFor="billing-email">Adresse e-mail {<Star />}</label>
            <input
              type="email"
              id="billing-email"
              name="billing-email"
              value={formData[`billing-email`]}
              onChange={handleChange}
              required
              autoComplete="billing email"
              aria-label="Adresse e-mail"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black"
            />
          </div>
        </fieldset>
      </div>
    </>
  );
}
