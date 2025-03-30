"use client";

import React, { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

import Star from "@/app/components/Star";
import Title from "@/app/components/Title";

import { useAuth } from "@/app/context/authContext";
import { useOrder } from "@/app/context/orderContext";
import { useSse } from "@/app/context/sseContext";
import { sectionClassname, titleClassname } from "@/app/staticData/cartPageClasses";
import { province } from "@/app/staticData/provinces";

export default function Form() {
  const { sseData } = useSse();
  const { userData } = useAuth();
  const { setOrder, order, handleChange } = useOrder();

  /**
   * Those two useEffect make sure the province is reset everytime the country changes.
   * It avoids setting the province to the wrong country
   */
  useEffect(() => {
    setOrder((prevState) => {
      return {
        ...prevState,
        shippingAddress: { ...prevState.shippingAddress, province: "" },
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.shippingAddress.country]);

  useEffect(() => {
    setOrder((prevState) => {
      return {
        ...prevState,
        billingAddress: { ...prevState.billingAddress, province: "" },
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.billingAddress.country]);

  return (
    <>
      <div aria-labelledby="shipping address" className={twMerge(sectionClassname, "bg-white")}>
        <Title
          title="Adresse de livraison"
          type="h2"
          classname={twMerge(titleClassname, "text-lg")}
          firstLetterClassname="text-3xl"
          id="linked-account-discount-code"
        />
        <fieldset aria-label="informations personnelles adresse de livraison">
          <legend className="font-bold">Informations personnelles</legend>
          <div className="mt-2 flex flex-col">
            <label className="text-sm" htmlFor="shipping-firstname">
              Prénom {<Star />}
            </label>
            <input
              type="text"
              id="shipping-firstname"
              name="firstname"
              value={order.shippingAddress.firstname}
              onChange={handleChange}
              required
              autoComplete="shipping given-name"
              aria-label="first name"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black text-xs md:text-sm"
            />
          </div>
          <div className="mt-2 flex flex-col">
            <label className="text-sm" htmlFor="shipping-lastname">
              Nom {<Star />}
            </label>
            <input
              type="text"
              id="shipping-lastname"
              name="lastname"
              value={order.shippingAddress.lastname}
              onChange={handleChange}
              required
              autoComplete="shipping family-name"
              aria-label="last name"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black text-xs md:text-sm"
            />
          </div>
          <div className="mt-2 flex flex-col">
            <label className="text-sm" htmlFor="shipping-company">
              Nom de l&apos;entreprise (facultatif)
            </label>
            <input
              type="text"
              id="shipping-company"
              name="company"
              value={order.shippingAddress.company}
              onChange={handleChange}
              aria-label="company"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black text-xs md:text-sm"
            />
          </div>
        </fieldset>
        <fieldset className="mt-6" aria-label="informations adresse de livraison">
          <legend className="font-bold">Informations d&apos;adresse</legend>
          <div className="mt-2 flex flex-col">
            <label className="text-sm" htmlFor="shipping-country">
              Pays/régions {<Star />}
            </label>
            <select
              id="shipping-country"
              name="country"
              value={order.shippingAddress.country}
              onChange={handleChange}
              required
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black text-xs md:text-sm"
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
            <label className="text-sm" htmlFor="shipping-address1">
              Numéro et nom de rue {<Star />}
            </label>
            <input
              type="text"
              id="shipping-address1"
              name="address1"
              value={order.shippingAddress.address1}
              onChange={handleChange}
              required
              placeholder="Numéro de voie et nom de la rue"
              autoComplete="shipping address-line1"
              aria-label="Numéro et nom de rue"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black text-xs md:text-sm"
            />
          </div>
          <div className="mt-2 flex flex-col">
            <input
              type="text"
              id="shipping-address2"
              name="address2"
              value={order.shippingAddress.address2}
              onChange={handleChange}
              placeholder="Bâtiment, appartement, lot, etc (facultatif)"
              autoComplete="shipping address-line2"
              aria-label="Adresse ligne 2"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black text-xs md:text-sm"
            />
          </div>
          <div className="mt-2 flex flex-col">
            <label className="text-sm" htmlFor="shipping-postal-code">
              Code postal {<Star />}
            </label>
            <input
              type="text"
              id="shipping-postal-code"
              name="postalCode"
              value={order.shippingAddress.postalCode}
              onChange={handleChange}
              required
              autoComplete="shipping postal-code"
              aria-label="Code postal"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black text-xs md:text-sm"
            />
          </div>
          <div className="mt-2 flex flex-col">
            <label className="text-sm" htmlFor="shipping-city">
              Ville {<Star />}
            </label>
            <input
              type="text"
              id="shipping-city"
              name="city"
              value={order.shippingAddress.city}
              onChange={handleChange}
              required
              autoComplete="shipping address-level2"
              aria-label="Ville"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black text-xs md:text-sm"
            />
          </div>
          {order.shippingAddress.country in province && (
            <div className="mt-2 flex flex-col">
              <label className="text-sm" htmlFor="shipping-province">
                {province[order.shippingAddress.country as keyof typeof province].name}{" "}
                {province[order.shippingAddress.country as keyof typeof province].required && <Star />}
              </label>
              <select
                id="shipping-province"
                name="province"
                value={order.shippingAddress.province}
                onChange={handleChange}
                required={province[order.shippingAddress.country as keyof typeof province].required}
                className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black text-xs md:text-sm"
              >
                <option value="">Veuillez selectionner une option...</option>
                {province[order.shippingAddress.country as keyof typeof province].options.map((s, i) => (
                  <option key={s.key} value={s.value}>
                    {s.key}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="mt-2 flex flex-col">
            <label className="text-sm" htmlFor="shipping-phone">
              Téléphone {<Star />}
            </label>
            <input
              type="tel"
              id="shipping-phone"
              name="phone"
              value={order.shippingAddress.phone}
              onChange={handleChange}
              required
              autoComplete="shipping tel"
              aria-label="Téléphone"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black text-xs md:text-sm"
            />
          </div>
          <div className="mt-2 flex flex-col">
            <label className="text-sm" htmlFor="shipping-email">
              Adresse e-mail {<Star />}
            </label>
            <input
              type="email"
              id="shipping-email"
              name="email"
              value={order.shippingAddress.email}
              onChange={handleChange}
              required
              autoComplete="shipping email"
              aria-label="Adresse e-mail"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black text-xs md:text-sm"
            />
          </div>
          {!userData && (
            <div className="mt-2 flex flex-col">
              <label className="text-sm" htmlFor="shipping-password">
                Mot de passe {<Star />}{" "}
                <span className="text-xs italic text-neutral-500">
                  (Votre compte va être crée avec l&apos;email ci dessus et ce mot de passe. Si vous êtes déjà client chez nous vous serez
                  automatiquement redirigé vers la page de connexion)
                </span>
              </label>
              <input
                type="password"
                id="shipping-password"
                name="password"
                value={order.password}
                onChange={handleChange}
                required
                aria-label="password"
                className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black text-xs md:text-sm"
              />
            </div>
          )}
          <div className="mt-2 flex flex-col">
            <label className="text-sm" htmlFor="shipping-order-notes">
              Notes de commande (facultatif)
            </label>
            <textarea
              rows={5}
              id="shipping-order-notes"
              name="order-notes"
              value={order.shippingAddress["order-notes"]}
              onChange={handleChange}
              aria-label="Note de commande"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black text-xs md:text-sm"
            ></textarea>
          </div>
        </fieldset>
      </div>

      {/* CHECKBOX DIFFERENT BILLING ADDRESS */}
      <div aria-labelledby="differeng billing address checkbox" className={twMerge(sectionClassname)}>
        <div className="flex gap-x-2 items-center">
          <input
            type="checkbox"
            id="different-billing"
            name="different-billing"
            checked={order["different-billing"]}
            onChange={handleChange}
            aria-label="different billing"
            className="focus:ring-1 focus:ring-black checked:bg-green focus:checked:bg-light-green"
          />
          <label className="text-sm cursor-pointer" htmlFor="different-billing">
            Facturer à une adresse différente ?
          </label>
        </div>
      </div>

      {/* BILLING ADDRESS */}
      <div aria-labelledby="billing address" className={twMerge(sectionClassname, "bg-white", clsx({ hidden: !order["different-billing"] }))}>
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
            <label className="text-sm" htmlFor="billing-firstname">
              Prénom {<Star />}
            </label>
            <input
              type="text"
              id="billing-firstname"
              name="firstname"
              value={order.billingAddress.firstname}
              onChange={handleChange}
              required={order["different-billing"]}
              autoComplete="billing given-name"
              aria-label="first name"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black text-xs md:text-sm"
            />
          </div>
          <div className="mt-2 flex flex-col">
            <label className="text-sm" htmlFor="billing-lastname">
              Nom {<Star />}
            </label>
            <input
              type="text"
              id="billing-lastname"
              name="lastname"
              value={order.billingAddress.lastname}
              onChange={handleChange}
              required={order["different-billing"]}
              autoComplete="billing family-name"
              aria-label="last name"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black text-xs md:text-sm"
            />
          </div>
          <div className="mt-2 flex flex-col">
            <label className="text-sm" htmlFor="billing-company">
              Nom de l&apos;entreprise (facultatif)
            </label>
            <input
              type="text"
              id="billing-company"
              name="company"
              value={order.billingAddress.company}
              onChange={handleChange}
              aria-label="company"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black text-xs md:text-sm"
            />
          </div>
        </fieldset>
        <fieldset className="mt-6" aria-label="information adresse de facturation">
          <legend className="font-bold">Informations d&apos;adresse</legend>
          <div className="mt-2 flex flex-col">
            <label className="text-sm" htmlFor="billing-country">
              Pays/régions {<Star />}
            </label>
            <select
              id="billing-country"
              name="country"
              value={order.billingAddress.country}
              onChange={handleChange}
              required={order["different-billing"]}
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black text-xs md:text-sm"
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
            <label className="text-sm" htmlFor="billing-address1">
              Numéro et nom de rue {<Star />}
            </label>
            <input
              type="text"
              id="billing-address1"
              name="address1"
              value={order.billingAddress.address1}
              onChange={handleChange}
              required={order["different-billing"]}
              placeholder="Numéro de voie et nom de la rue"
              autoComplete="billing address-line1"
              aria-label="Numéro et nom de rue"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black text-xs md:text-sm"
            />
          </div>
          <div className="mt-2 flex flex-col">
            <input
              type="text"
              id="billing-address2"
              name="address2"
              value={order.billingAddress.address2}
              onChange={handleChange}
              placeholder="Bâtiment, appartement, lot, etc (facultatif)"
              autoComplete="billing address-line2"
              aria-label="Adresse ligne 2"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black text-xs md:text-sm"
            />
          </div>
          <div className="mt-2 flex flex-col">
            <label className="text-sm" htmlFor="billing-postal-code">
              Code postal {<Star />}
            </label>
            <input
              type="text"
              id="billing-postal-code"
              name="postalCode"
              value={order.billingAddress.postalCode}
              onChange={handleChange}
              required={order["different-billing"]}
              autoComplete="billing postal-code"
              aria-label="Code postal"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black text-xs md:text-sm"
            />
          </div>
          <div className="mt-2 flex flex-col">
            <label className="text-sm" htmlFor="billing-city">
              Ville {<Star />}
            </label>
            <input
              type="text"
              id="billing-city"
              name="city"
              value={order.billingAddress.city}
              onChange={handleChange}
              required={order["different-billing"]}
              autoComplete="billing address-level2"
              aria-label="Ville"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black text-xs md:text-sm"
            />
          </div>
          {order.billingAddress.country in province && (
            <div className="mt-2 flex flex-col">
              <label className="text-sm" htmlFor="billing-province">
                {province[order.billingAddress.country as keyof typeof province].name}{" "}
                {province[order.billingAddress.country as keyof typeof province].required && <Star />}
              </label>
              <select
                id="billing-province"
                name="province"
                value={order.billingAddress.province}
                onChange={handleChange}
                required={province[order.billingAddress.country as keyof typeof province].required}
                className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black text-xs md:text-sm"
              >
                <option value="">Veuillez selectionner une option...</option>
                {province[order.billingAddress.country as keyof typeof province].options.map((s, i) => (
                  <option key={s.key} value={s.value}>
                    {s.key}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="mt-2 flex flex-col">
            <label className="text-sm" htmlFor="billing-phone">
              Téléphone {<Star />}
            </label>
            <input
              type="tel"
              id="billing-phone"
              name="phone"
              value={order.billingAddress.phone}
              onChange={handleChange}
              required={order["different-billing"]}
              autoComplete="billing tel"
              aria-label="Téléphone"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black text-xs md:text-sm"
            />
          </div>
          <div className="mt-2 flex flex-col">
            <label className="text-sm" htmlFor="billing-email">
              Adresse e-mail {<Star />}
            </label>
            <input
              type="email"
              id="billing-email"
              name="email"
              value={order.billingAddress.email}
              onChange={handleChange}
              required={order["different-billing"]}
              autoComplete="billing email"
              aria-label="Adresse e-mail"
              className="border-1 border-neutral-300 shadow-md rounded-md focus:ring-1 focus:ring-black text-xs md:text-sm"
            />
          </div>
        </fieldset>
      </div>
    </>
  );
}
