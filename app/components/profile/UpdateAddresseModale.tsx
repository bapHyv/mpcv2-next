"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { useTranslations } from "next-intl";
import { v4 as uuid } from "uuid";
import { twMerge } from "tailwind-merge";
import { XMarkIcon } from "@heroicons/react/24/solid";

import { useAlerts } from "@/app/context/alertsContext";
import { useAuth } from "@/app/context/authContext";
import { Address } from "@/app/types/profileTypes";
import { updateAddress } from "@/app/actions";
import { isAddress, isResponseApi } from "@/app/utils/typeGuardsFunctions";
import { useSse } from "@/app/context/sseContext";
import { disableBodyScroll, enableBodyScroll } from "@/app/utils/bodyScroll";

import { inputClassname, buttonClassname, checkRadioClassname } from "@/app/staticData/cartPageClasses";
import Star from "@/app/components/Star";
import SubmitButton from "@/app/components/SubmitButton";

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
      {label} {required && <Star />}
    </label>
    {children}
    {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
  </div>
);

interface Params {
  editingAddress: Address;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setEditingAddress: Dispatch<SetStateAction<Address | null>>;
}

export default function UpdateAddresseModale({ editingAddress, setEditingAddress, setIsModalOpen }: Params) {
  const t = useTranslations("");

  const initialFormStateForAction = {
    message: "",
    data: editingAddress,
    isSuccess: false,
    statusCode: 0,
  };
  const [state, formAction] = useFormState(updateAddress, initialFormStateForAction as any);

  const { setUserData } = useAuth();
  const { addAlert } = useAlerts();
  const { sseData } = useSse();

  useEffect(() => {
    disableBodyScroll();
    return () => enableBodyScroll();
  }, []);

  useEffect(() => {
    if (isResponseApi(state) && state.statusCode !== 0) {
      if (state.isSuccess && isAddress(state.data) && state.statusCode === 200) {
        const updatedAddress = state.data;
        setUserData((prevState) => {
          if (prevState) {
            const updatedAddresses = prevState.addresses.map((addr) => (addr.id === updatedAddress.id ? updatedAddress : addr));
            return { ...prevState, addresses: updatedAddresses };
          }
          return null;
        });
        addAlert(uuid(), t("alerts.profile.addresses.update.200.text"), t("alerts.profile.addresses.update.200.title"), "emerald");
        setIsModalOpen(false);
      } else {
        let alertTitleKey = "alerts.genericError.title";
        let alertTextKey = "alerts.genericError.text";
        let alertType: "yellow" | "red" = "red";
        switch (state.statusCode) {
          case 400:
            alertTitleKey = "alerts.profile.addresses.update.400.title";
            alertTextKey = "alerts.profile.addresses.update.400.text";
            alertType = "yellow";
            break;
          case 422:
            alertTitleKey = "alerts.profile.addresses.update.422.title";
            alertTextKey = "alerts.profile.addresses.update.422.text";
            alertType = "yellow";
            break;
          // TODO: Add other cases if needed
        }
        const alertText = state.message || t(alertTextKey);
        addAlert(uuid(), alertText, t(alertTitleKey), alertType);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // --- Handlers ---
  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setEditingAddress((prev) => {
      if (!prev) return null;
      return { ...prev, [name]: type === "checkbox" ? checked : value };
    });
  };

  return (
    <div
      className="fixed inset-0 z-[7000] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
      onMouseDown={() => setIsModalOpen(false)}
    >
      <div
        className="bg-white rounded-lg p-6 sm:p-8 shadow-xl w-full max-w-lg mx-auto relative transform transition-all duration-300 ease-in-out overflow-y-auto max-h-[90vh]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{t("addressesPage.editModalTitle")}</h2>
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green rounded-md"
          >
            <span className="sr-only">{t("addresses.modal.closeButtonSR")}</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Form */}
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={editingAddress.id} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <FormField id="firstname" label={t("addressesPage.form.firstNameLabel")} required>
              <input type="text" name="firstname" required value={editingAddress.firstname} onChange={handleModalChange} className={inputClassname} />
            </FormField>
            <FormField id="lastname" label={t("addressesPage.form.lastNameLabel")} required>
              <input type="text" name="lastname" required value={editingAddress.lastname} onChange={handleModalChange} className={inputClassname} />
            </FormField>
          </div>
          <FormField id="country" label={t("addressesPage.form.countryLabel")} required>
            <select name="country" required value={editingAddress.country} onChange={handleModalChange} className={inputClassname}>
              {sseData?.shippingMethods?.byShippingZones &&
                Object.keys(sseData.shippingMethods.byShippingZones).map((s, i) => (
                  <option key={s + i} value={s}>
                    {s}
                  </option>
                ))}
            </select>
          </FormField>
          <FormField id="address1" label={t("addressesPage.form.address1Label")} required>
            <input type="text" name="address1" required value={editingAddress.address1} onChange={handleModalChange} className={inputClassname} />
          </FormField>
          <FormField id="address2" label={t("addressesPage.form.address2Label")}>
            <input type="text" name="address2" value={editingAddress.address2} onChange={handleModalChange} className={inputClassname} />
          </FormField>
          <FormField id="company" label={t("addressesPage.form.companyLabel")}>
            <input type="text" name="company" value={editingAddress.company} onChange={handleModalChange} className={inputClassname} />
          </FormField>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <FormField id="city" label={t("addressesPage.form.cityLabel")} required>
              <input type="text" name="city" required value={editingAddress.city} onChange={handleModalChange} className={inputClassname} />
            </FormField>
            <FormField id="postalCode" label={t("addressesPage.form.postalCodeLabel")} required>
              <input
                type="text"
                name="postalCode"
                required
                value={editingAddress.postalCode}
                onChange={handleModalChange}
                className={inputClassname}
              />
            </FormField>
          </div>
          <FormField id="phone" label={t("addressesPage.form.phoneLabel")} required>
            <input type="tel" name="phone" required value={editingAddress.phone} onChange={handleModalChange} className={inputClassname} />
          </FormField>
          <FormField id="email" label={t("addressesPage.form.emailLabel")} required>
            <input type="email" name="email" required value={editingAddress.email} onChange={handleModalChange} className={inputClassname} />
          </FormField>
          {/* Checkboxes */}
          <fieldset className="pt-4">
            <legend className="block text-sm font-medium leading-6 text-gray-900 mb-2">{t("addressesPage.form.addressTypeLegend")}</legend>
            <div className="space-y-3">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id="billing"
                    name="billing"
                    type="checkbox"
                    checked={editingAddress.billing}
                    onChange={handleModalChange}
                    className={checkRadioClassname}
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label htmlFor="billing" className="font-medium text-gray-900 cursor-pointer">
                    {t("addressesPage.form.billingCheckboxLabel")}
                  </label>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id="shipping"
                    name="shipping"
                    type="checkbox"
                    checked={editingAddress.shipping}
                    onChange={handleModalChange}
                    className={checkRadioClassname}
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label htmlFor="shipping" className="font-medium text-gray-900 cursor-pointer">
                    {t("addressesPage.form.shippingCheckboxLabel")}
                  </label>
                </div>
              </div>
            </div>
          </fieldset>
          {/* Buttons */}
          <div className="mt-6 pt-5 border-t border-gray-200 flex justify-end gap-x-3">
            <button
              type="button"
              className={twMerge(buttonClassname, "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50")}
              onClick={() => setIsModalOpen(false)}
            >
              {t("addressesPage.form.cancelButton")}
            </button>
            <SubmitButton text={t("addressesPage.form.submitUpdateButton")} />
          </div>
        </form>
      </div>
    </div>
  );
}
