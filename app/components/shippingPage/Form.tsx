// Form.tsx
"use client";

import React, { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

import Star from "@/app/components/Star";
import Title from "@/app/components/Title";
import { useAuth } from "@/app/context/authContext";
import { useOrder } from "@/app/context/orderContext";
import { useSse } from "@/app/context/sseContext";
import {
  sectionWrapperClassname,
  subtleSectionWrapperClassname,
  titleClassname,
  inputClassname,
  checkRadioClassname,
} from "@/app/staticData/cartPageClasses";
import { province } from "@/app/staticData/provinces";

const FormField = ({
  id,
  label,
  required,
  children,
  helpText,
  className,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
  helpText?: string;
  className?: string;
}) => (
  <div className={twMerge("mb-4", className)}>
    <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900 mb-1">
      {" "}
      {label} {required && <Star />}
    </label>
    {children}
    {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
  </div>
);

export default function Form() {
  const { sseData } = useSse();
  const { userData } = useAuth();
  const { setOrder, order, handleChange } = useOrder();

  useEffect(() => {
    // Reset shipping province when shipping country changes
    setOrder((prevState) => {
      // Only update if the country actually changed and province exists
      if (prevState.shippingAddress.country !== order.shippingAddress.country || prevState.shippingAddress.province) {
        return {
          ...prevState,
          shippingAddress: { ...prevState.shippingAddress, province: "" },
        };
      }
      return prevState;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.shippingAddress.country]);

  useEffect(() => {
    // Reset billing province when billing country changes OR when 'different-billing' is unchecked
    setOrder((prevState) => {
      if (
        prevState.billingAddress.country !== order.billingAddress.country ||
        prevState.billingAddress.province ||
        (prevState["different-billing"] && !order["different-billing"]) // If checkbox was just unchecked
      ) {
        return {
          ...prevState,
          // Reset only if different billing is active OR was just deactivated
          billingAddress: order["different-billing"] ? { ...prevState.billingAddress, province: "" } : { ...prevState.billingAddress }, // Keep current billing if checkbox inactive
        };
      }
      return prevState; // No change needed
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.billingAddress.country, order["different-billing"]]);

  return (
    <>
      {/* Shipping Address Section */}
      <section aria-labelledby="shipping-address-heading" className={twMerge(sectionWrapperClassname)}>
        <Title
          title="Adresse de livraison"
          type="h2"
          classname={twMerge(titleClassname, "mb-6 text-lg")}
          firstLetterClassname="text-2xl"
          id="shipping-address-heading"
        />

        {/* --- Personal Info --- */}
        <fieldset aria-label="Informations personnelles adresse de livraison" className="mb-6 border-b border-gray-200 pb-6">
          {" "}
          {/* Separator */}
          <legend className="text-base font-semibold text-gray-900 mb-4">Informations personnelles</legend>
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
            <FormField id="shipping-firstname" label="Prénom" required>
              <input
                type="text"
                name="firstname"
                value={order.shippingAddress.firstname}
                onChange={handleChange}
                required
                autoComplete="shipping given-name"
                className={inputClassname}
              />
            </FormField>
            <FormField id="shipping-lastname" label="Nom" required>
              <input
                type="text"
                name="lastname"
                value={order.shippingAddress.lastname}
                onChange={handleChange}
                required
                autoComplete="shipping family-name"
                className={inputClassname}
              />
            </FormField>
            <FormField id="shipping-company" label="Nom de l'entreprise (facultatif)" className="sm:col-span-2">
              <input
                type="text"
                name="company"
                value={order.shippingAddress.company}
                onChange={handleChange}
                autoComplete="shipping organization"
                className={inputClassname}
              />
            </FormField>
          </div>
        </fieldset>

        {/* --- Address Info --- */}
        <fieldset aria-label="Informations d'adresse de livraison">
          <legend className="text-base font-semibold text-gray-900 mb-4">Informations d&apos;adresse</legend>
          <div className="space-y-4">
            {" "}
            <FormField id="shipping-country" label="Pays/région" required>
              <select name="country" value={order.shippingAddress.country} onChange={handleChange} required className={inputClassname}>
                <option value="">Sélectionnez un pays...</option>
                {sseData?.shippingMethods?.byShippingZones &&
                  Object.keys(sseData.shippingMethods.byShippingZones).map((s, i) => (
                    <option key={s + i} value={s}>
                      {s}
                    </option>
                  ))}
              </select>
            </FormField>
            <FormField id="shipping-address1" label="Numéro et nom de rue" required>
              <input
                type="text"
                name="address1"
                value={order.shippingAddress.address1}
                onChange={handleChange}
                required
                placeholder="Ex: 123 Rue Principale"
                autoComplete="shipping address-line1"
                className={inputClassname}
              />
            </FormField>
            <FormField id="shipping-address2" label="Bâtiment, appartement, etc. (facultatif)">
              <input
                type="text"
                name="address2"
                value={order.shippingAddress.address2}
                onChange={handleChange}
                placeholder="Ex: Appartement 4B"
                autoComplete="shipping address-line2"
                className={inputClassname}
              />
            </FormField>
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
              <FormField id="shipping-postal-code" label="Code postal" required>
                <input
                  type="text"
                  name="postalCode"
                  value={order.shippingAddress.postalCode}
                  onChange={handleChange}
                  required
                  autoComplete="shipping postal-code"
                  className={inputClassname}
                />
              </FormField>
              <FormField id="shipping-city" label="Ville" required>
                <input
                  type="text"
                  name="city"
                  value={order.shippingAddress.city}
                  onChange={handleChange}
                  required
                  autoComplete="shipping address-level2"
                  className={inputClassname}
                />
              </FormField>
            </div>
            {/* Province field logic - Ensure province data exists */}
            {order.shippingAddress.country && province[order.shippingAddress.country as keyof typeof province] && (
              <FormField
                id="shipping-province"
                label={province[order.shippingAddress.country as keyof typeof province].name}
                required={province[order.shippingAddress.country as keyof typeof province].required}
              >
                <select
                  name="province"
                  value={order.shippingAddress.province}
                  onChange={handleChange}
                  required={province[order.shippingAddress.country as keyof typeof province].required}
                  className={inputClassname}
                >
                  <option value="">Veuillez selectionner...</option>
                  {province[order.shippingAddress.country as keyof typeof province].options.map((s) => (
                    <option key={s.key} value={s.value}>
                      {s.key}
                    </option>
                  ))}
                </select>
              </FormField>
            )}
            <FormField id="shipping-phone" label="Téléphone" required helpText="Nécessaire pour la livraison.">
              <input
                type="tel"
                name="phone"
                value={order.shippingAddress.phone}
                onChange={handleChange}
                required
                autoComplete="shipping tel"
                className={inputClassname}
              />
            </FormField>
            <FormField id="shipping-email" label="Adresse e-mail" required helpText="Pour la confirmation de commande.">
              <input
                type="email"
                name="email"
                value={order.shippingAddress.email}
                onChange={handleChange}
                required
                autoComplete="shipping email"
                className={inputClassname}
              />
            </FormField>
            {/* Password field only if not logged in */}
            {!userData && (
              <FormField
                id="shipping-password"
                label="Créer un mot de passe"
                required
                helpText="Votre compte sera créé avec cet email et mot de passe."
              >
                <input type="password" name="password" value={order.password} onChange={handleChange} required className={inputClassname} />
              </FormField>
            )}
            <FormField id="shipping-order-notes" label="Notes de commande (facultatif)">
              <textarea
                rows={4}
                name="order-notes"
                value={order.shippingAddress["order-notes"]}
                onChange={handleChange}
                className={inputClassname}
              ></textarea>
            </FormField>
          </div>
        </fieldset>
      </section>

      {/* Checkbox for Different Billing Address */}
      <div className={twMerge(subtleSectionWrapperClassname)}>
        <div className="relative flex items-start">
          <div className="flex h-6 items-center">
            <input
              id="different-billing"
              name="different-billing"
              type="checkbox"
              checked={order["different-billing"]}
              onChange={handleChange}
              className={checkRadioClassname}
            />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label htmlFor="different-billing" className="font-medium text-gray-900 cursor-pointer">
              Facturer à une adresse différente ?
            </label>
          </div>
        </div>
      </div>

      {/* Billing Address Section - Conditionally Shown */}
      <section aria-labelledby="billing-address-heading" className={twMerge(sectionWrapperClassname, clsx({ hidden: !order["different-billing"] }))}>
        <Title
          title="Adresse de facturation"
          type="h2"
          classname={twMerge(titleClassname, "mb-6 text-lg")}
          firstLetterClassname="text-2xl"
          id="billing-address-heading"
        />
        {/* --- Billing Personal Info --- */}
        <fieldset aria-label="Informations personnelles adresse de facturation" className="mb-6 border-b border-gray-200 pb-6">
          <legend className="text-base font-semibold text-gray-900 mb-4">Informations personnelles</legend>
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
            <FormField id="billing-firstname" label="Prénom" required={order["different-billing"]}>
              <input
                type="text"
                name="firstname"
                value={order.billingAddress.firstname}
                onChange={handleChange}
                required={order["different-billing"]}
                autoComplete="billing given-name"
                className={inputClassname}
              />
            </FormField>
            <FormField id="billing-lastname" label="Nom" required={order["different-billing"]}>
              <input
                type="text"
                name="lastname"
                value={order.billingAddress.lastname}
                onChange={handleChange}
                required={order["different-billing"]}
                autoComplete="billing family-name"
                className={inputClassname}
              />
            </FormField>
            <FormField id="billing-company" label="Nom de l'entreprise (facultatif)" className="sm:col-span-2">
              <input
                type="text"
                name="company"
                value={order.billingAddress.company}
                onChange={handleChange}
                autoComplete="billing organization"
                className={inputClassname}
              />
            </FormField>
          </div>
        </fieldset>
        {/* --- Billing Address Info --- */}
        <fieldset aria-label="Informations d'adresse de facturation">
          <legend className="text-base font-semibold text-gray-900 mb-4">Informations d&apos;adresse</legend>
          <div className="space-y-4">
            <FormField id="billing-country" label="Pays/région" required={order["different-billing"]}>
              <select
                name="country"
                value={order.billingAddress.country}
                onChange={handleChange}
                required={order["different-billing"]}
                className={inputClassname}
              >
                <option value="">Sélectionnez un pays...</option>
                {sseData?.shippingMethods?.byShippingZones &&
                  Object.keys(sseData.shippingMethods.byShippingZones).map((s, i) => (
                    <option key={s + i} value={s}>
                      {s}
                    </option>
                  ))}
              </select>
            </FormField>
            <FormField id="billing-address1" label="Numéro et nom de rue" required={order["different-billing"]}>
              <input
                type="text"
                name="address1"
                value={order.billingAddress.address1}
                onChange={handleChange}
                required={order["different-billing"]}
                placeholder="Ex: 123 Rue Principale"
                autoComplete="billing address-line1"
                className={inputClassname}
              />
            </FormField>
            <FormField id="billing-address2" label="Bâtiment, appartement, etc. (facultatif)">
              <input
                type="text"
                name="address2"
                value={order.billingAddress.address2}
                onChange={handleChange}
                placeholder="Ex: Appartement 4B"
                autoComplete="billing address-line2"
                className={inputClassname}
              />
            </FormField>
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
              <FormField id="billing-postal-code" label="Code postal" required={order["different-billing"]}>
                <input
                  type="text"
                  name="postalCode"
                  value={order.billingAddress.postalCode}
                  onChange={handleChange}
                  required={order["different-billing"]}
                  autoComplete="billing postal-code"
                  className={inputClassname}
                />
              </FormField>
              <FormField id="billing-city" label="Ville" required={order["different-billing"]}>
                <input
                  type="text"
                  name="city"
                  value={order.billingAddress.city}
                  onChange={handleChange}
                  required={order["different-billing"]}
                  autoComplete="billing address-level2"
                  className={inputClassname}
                />
              </FormField>
            </div>
            {/* Billing Province - Ensure province data exists */}
            {order.billingAddress.country && province[order.billingAddress.country as keyof typeof province] && (
              <FormField
                id="billing-province"
                label={province[order.billingAddress.country as keyof typeof province].name}
                required={order["different-billing"] && province[order.billingAddress.country as keyof typeof province].required}
              >
                <select
                  name="province"
                  value={order.billingAddress.province}
                  onChange={handleChange}
                  required={order["different-billing"] && province[order.billingAddress.country as keyof typeof province].required}
                  className={inputClassname}
                >
                  <option value="">Veuillez selectionner...</option>
                  {province[order.billingAddress.country as keyof typeof province].options.map((s) => (
                    <option key={s.key} value={s.value}>
                      {s.key}
                    </option>
                  ))}
                </select>
              </FormField>
            )}
            <FormField id="billing-phone" label="Téléphone" required={order["different-billing"]}>
              <input
                type="tel"
                name="phone"
                value={order.billingAddress.phone}
                onChange={handleChange}
                required={order["different-billing"]}
                autoComplete="billing tel"
                className={inputClassname}
              />
            </FormField>
            <FormField id="billing-email" label="Adresse e-mail" required={order["different-billing"]}>
              <input
                type="email"
                name="email"
                value={order.billingAddress.email}
                onChange={handleChange}
                required={order["different-billing"]}
                autoComplete="billing email"
                className={inputClassname}
              />
            </FormField>
          </div>
        </fieldset>
      </section>
    </>
  );
}
