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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("shippingPage.addressForm");
  const { sseData } = useSse();
  const { userData } = useAuth();
  const { setOrder, order, handleChange } = useOrder();

  const getProvinceLabelKey = (countryCode: string): string => {
    if (countryCode === "USA") return "stateLabel";
    return "provinceLabel"; // Default
  };

  useEffect(() => {
    setOrder((prevState) => {
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
    setOrder((prevState) => {
      if (
        prevState.billingAddress.country !== order.billingAddress.country ||
        prevState.billingAddress.province ||
        (prevState["different-billing"] && !order["different-billing"])
      ) {
        return {
          ...prevState,
          billingAddress: order["different-billing"] ? { ...prevState.billingAddress, province: "" } : { ...prevState.billingAddress },
        };
      }
      return prevState;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.billingAddress.country, order["different-billing"]]);

  return (
    <>
      {/* Shipping Address Section */}
      <section aria-labelledby="shipping-address-heading" className={twMerge(sectionWrapperClassname)}>
        <Title
          title={t("shippingTitle")}
          type="h2"
          classname={twMerge(titleClassname, "mb-6 text-lg")}
          firstLetterClassname="text-2xl"
          id="shipping-address-heading"
        />

        {/* --- Personal Info --- */}
        <fieldset aria-label={t("personalInfoLegend")} className="mb-6 border-b border-gray-200 pb-6">
          <legend className="text-base font-semibold text-gray-900 mb-4">{t("personalInfoLegend")}</legend>
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
            <FormField id="shipping-firstname" label={t("firstNameLabel")} required>
              <input
                id="shipping-firstname"
                type="text"
                name="firstname"
                value={order.shippingAddress.firstname}
                onChange={handleChange}
                required
                autoComplete="shipping given-name"
                className={inputClassname}
              />
            </FormField>
            <FormField id="shipping-lastname" label={t("lastNameLabel")} required>
              <input
                id="shipping-lastname"
                type="text"
                name="lastname"
                value={order.shippingAddress.lastname}
                onChange={handleChange}
                required
                autoComplete="shipping family-name"
                className={inputClassname}
              />
            </FormField>
            <FormField id="shipping-company" label={t("companyLabel")} className="sm:col-span-2">
              <input
                id="shipping-company"
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
        <fieldset aria-label={t("addressInfoLegend")}>
          <legend className="text-base font-semibold text-gray-900 mb-4">{t("addressInfoLegend")}</legend>
          <div className="space-y-4">
            <FormField id="shipping-country" label={t("countryLabel")} required>
              <select
                id="shipping-country"
                name="country"
                value={order.shippingAddress.country}
                onChange={handleChange}
                required
                className={inputClassname}
              >
                <option value="">{t("countrySelectDefault")}</option>
                {sseData?.shippingMethods?.byShippingZones &&
                  Object.keys(sseData.shippingMethods.byShippingZones).map((s, i) => (
                    <option key={s + i} value={s}>
                      {s}
                    </option>
                  ))}
              </select>
            </FormField>
            <FormField id="shipping-address1" label={t("address1Label")} required>
              <input
                id="shipping-address1"
                type="text"
                name="address1"
                value={order.shippingAddress.address1}
                onChange={handleChange}
                required
                placeholder={t("address1Placeholder")}
                autoComplete="shipping address-line1"
                className={inputClassname}
              />
            </FormField>
            <FormField id="shipping-address2" label={t("address2Label")}>
              <input
                id="shipping-address2"
                type="text"
                name="address2"
                value={order.shippingAddress.address2}
                onChange={handleChange}
                placeholder={t("address2Placeholder")}
                autoComplete="shipping address-line2"
                className={inputClassname}
              />
            </FormField>
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
              <FormField id="shipping-postal-code" label={t("postalCodeLabel")} required>
                <input
                  id="shipping-postal-code"
                  type="text"
                  name="postalCode"
                  value={order.shippingAddress.postalCode}
                  onChange={handleChange}
                  required
                  autoComplete="shipping postal-code"
                  className={inputClassname}
                />
              </FormField>
              <FormField id="shipping-city" label={t("cityLabel")} required>
                <input
                  id="shipping-city"
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
            {/* Province field logic */}
            {order.shippingAddress.country && province[order.shippingAddress.country as keyof typeof province] && (
              <FormField
                id="shipping-province"
                label={t(getProvinceLabelKey(order.shippingAddress.country))}
                required={province[order.shippingAddress.country as keyof typeof province].required}
              >
                <select
                  id="shipping-province"
                  name="province"
                  value={order.shippingAddress.province}
                  onChange={handleChange}
                  required={province[order.shippingAddress.country as keyof typeof province].required}
                  className={inputClassname}
                >
                  <option value="">{t("provinceSelectDefault")}</option>
                  {province[order.shippingAddress.country as keyof typeof province].options.map((s) => (
                    <option key={s.key} value={s.value}>
                      {s.key}
                    </option>
                  ))}
                </select>
              </FormField>
            )}
            <FormField id="shipping-phone" label={t("phoneLabel")} required helpText={t("phoneHelpText")}>
              <input
                id="shipping-phone"
                type="tel"
                name="phone"
                value={order.shippingAddress.phone}
                onChange={handleChange}
                required
                autoComplete="shipping tel"
                className={inputClassname}
              />
            </FormField>
            <FormField id="shipping-email" label={t("emailLabel")} required helpText={t("emailHelpText")}>
              <input
                id="shipping-email"
                type="email"
                name="email"
                value={order.shippingAddress.email}
                onChange={handleChange}
                required
                autoComplete="shipping email"
                className={inputClassname}
              />
            </FormField>
            {/* Password (Guest Checkout) */}
            {!userData && (
              <FormField id="password" label={t("createPasswordLabel")} required helpText={t("createPasswordHelpText")}>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={order.password}
                  onChange={handleChange}
                  required
                  className={inputClassname}
                />
              </FormField>
            )}
            <FormField id="shipping-order-notes" label={t("orderNotesLabel")}>
              <textarea
                id="shipping-order-notes"
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
              {t("differentBillingLabel")}
            </label>
          </div>
        </div>
      </div>

      {/* Billing Address Section - Conditionally Shown */}
      <section aria-labelledby="billing-address-heading" className={twMerge(sectionWrapperClassname, clsx({ hidden: !order["different-billing"] }))}>
        <Title
          title={t("billingTitle")}
          type="h2"
          classname={twMerge(titleClassname, "mb-6 text-lg")}
          firstLetterClassname="text-2xl"
          id="billing-address-heading"
        />
        {/* Billing Personal Info */}
        <fieldset aria-label={t("personalInfoLegend")} className="mb-6 border-b border-gray-200 pb-6">
          <legend className="text-base font-semibold text-gray-900 mb-4">{t("personalInfoLegend")}</legend>
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
            <FormField id="billing-firstname" label={t("firstNameLabel")} required={order["different-billing"]}>
              <input
                id="billing-firstname"
                type="text"
                name="firstname"
                value={order.billingAddress.firstname}
                onChange={handleChange}
                required={order["different-billing"]}
                autoComplete="billing given-name"
                className={inputClassname}
              />
            </FormField>
            <FormField id="billing-lastname" label={t("lastNameLabel")} required={order["different-billing"]}>
              <input
                id="billing-lastname"
                type="text"
                name="lastname"
                value={order.billingAddress.lastname}
                onChange={handleChange}
                required={order["different-billing"]}
                autoComplete="billing family-name"
                className={inputClassname}
              />
            </FormField>
            <FormField id="billing-company" label={t("companyLabel")} className="sm:col-span-2">
              <input
                id="billing-company"
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
        {/* Billing Address Info */}
        <fieldset aria-label={t("addressInfoLegend")}>
          <legend className="text-base font-semibold text-gray-900 mb-4">{t("addressInfoLegend")}</legend>
          <div className="space-y-4">
            <FormField id="billing-country" label={t("countryLabel")} required={order["different-billing"]}>
              <select
                id="billing-country"
                name="country"
                value={order.billingAddress.country}
                onChange={handleChange}
                required={order["different-billing"]}
                className={inputClassname}
              >
                <option value="">{t("countrySelectDefault")}</option>
                {sseData?.shippingMethods?.byShippingZones &&
                  Object.keys(sseData.shippingMethods.byShippingZones).map((s, i) => (
                    <option key={s + i} value={s}>
                      {s}
                    </option>
                  ))}
              </select>
            </FormField>
            <FormField id="billing-address1" label={t("address1Label")} required={order["different-billing"]}>
              <input
                id="billing-address1"
                type="text"
                name="address1"
                value={order.billingAddress.address1}
                onChange={handleChange}
                required={order["different-billing"]}
                placeholder={t("address1Placeholder")}
                autoComplete="billing address-line1"
                className={inputClassname}
              />
            </FormField>
            <FormField id="billing-address2" label={t("address2Label")}>
              <input
                id="billing-address2"
                type="text"
                name="address2"
                value={order.billingAddress.address2}
                onChange={handleChange}
                placeholder={t("address2Placeholder")}
                autoComplete="billing address-line2"
                className={inputClassname}
              />
            </FormField>
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
              <FormField id="billing-postal-code" label={t("postalCodeLabel")} required={order["different-billing"]}>
                <input
                  id="billing-postal-code"
                  type="text"
                  name="postalCode"
                  value={order.billingAddress.postalCode}
                  onChange={handleChange}
                  required={order["different-billing"]}
                  autoComplete="billing postal-code"
                  className={inputClassname}
                />
              </FormField>
              <FormField id="billing-city" label={t("cityLabel")} required={order["different-billing"]}>
                <input
                  id="billing-city"
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
            {/* Billing Province */}
            {order.billingAddress.country && province[order.billingAddress.country as keyof typeof province] && (
              <FormField
                id="billing-province"
                label={t(getProvinceLabelKey(order.billingAddress.country))}
                required={order["different-billing"] && province[order.billingAddress.country as keyof typeof province].required}
              >
                <select
                  id="billing-province"
                  name="province"
                  value={order.billingAddress.province}
                  onChange={handleChange}
                  required={order["different-billing"] && province[order.billingAddress.country as keyof typeof province].required}
                  className={inputClassname}
                >
                  <option value="">{t("provinceSelectDefault")}</option>
                  {province[order.billingAddress.country as keyof typeof province].options.map((s) => (
                    <option key={s.key} value={s.value}>
                      {s.key}
                    </option>
                  ))}
                </select>
              </FormField>
            )}
            <FormField id="billing-phone" label={t("phoneLabel")} required={order["different-billing"]}>
              <input
                id="billing-phone"
                type="tel"
                name="phone"
                value={order.billingAddress.phone}
                onChange={handleChange}
                required={order["different-billing"]}
                autoComplete="billing tel"
                className={inputClassname}
              />
            </FormField>
            <FormField id="billing-email" label={t("emailLabel")} required={order["different-billing"]}>
              <input
                id="billing-email"
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
