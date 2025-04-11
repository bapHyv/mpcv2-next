// UpdateAddresseModale.tsx (Styled)
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
    {" "}
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

  const [state, formAction] = useFormState(updateAddress, editingAddress as any);

  const { setUserData } = useAuth();
  const { addAlert } = useAlerts();
  const { sseData } = useSse();

  useEffect(() => {
    disableBodyScroll();
    return () => enableBodyScroll();
  }, []);

  useEffect(() => {
    if (isResponseApi(state) && state.statusCode !== 0) {
      console.log(0);
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
        console.log(1);
        let alertTitle = t("alerts.genericError.title");
        let alertText = state.message || t("alerts.genericError.text");
        let alertType: "yellow" | "red" = "red";
        switch (state.statusCode) {
          case 400:
            alertTitle = t("alerts.profile.addresses.update.400.title");
            alertText = state.message || t("alerts.profile.addresses.update.400.text");
            alertType = "yellow";
            break;
          case 422:
            alertTitle = t("alerts.profile.addresses.update.422.title");
            alertText = state.message || t("alerts.profile.addresses.update.422.text");
            alertType = "yellow";
            break;
        }
        addAlert(uuid(), alertText, alertTitle, alertType);
        setIsModalOpen(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    setEditingAddress((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm p-4" onMouseDown={() => setIsModalOpen(false)}>
      <div
        className="bg-white rounded-lg p-6 sm:p-8 shadow-xl w-full max-w-lg mx-auto relative transform transition-all duration-300 ease-in-out overflow-y-auto max-h-[80vh]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{t("addresses.modal.title")}</h2>
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green rounded-md"
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Form */}
        <form action={formAction} className="space-y-4">
          {" "}
          {/* Hidden input for address ID is crucial for update action */}
          <input type="hidden" name="id" value={editingAddress.id} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <FormField id="firstname" label={t("addresses.firstName")} required>
              <input type="text" name="firstname" required value={editingAddress.firstname} onChange={handleModalChange} className={inputClassname} />
            </FormField>
            <FormField id="lastname" label={t("addresses.lastName")} required>
              <input type="text" name="lastname" required value={editingAddress.lastname} onChange={handleModalChange} className={inputClassname} />
            </FormField>
          </div>
          <FormField id="country" label={t("addresses.country")} required>
            <select name="country" required value={editingAddress.country} onChange={handleModalChange} className={inputClassname}>
              {sseData?.shippingMethods?.byShippingZones && // Null check
                Object.keys(sseData.shippingMethods.byShippingZones).map((s, i) => (
                  <option key={s + i} value={s}>
                    {s}
                  </option>
                ))}
            </select>
          </FormField>
          <FormField id="address1" label={t("addresses.address1")} required>
            <input type="text" name="address1" required value={editingAddress.address1} onChange={handleModalChange} className={inputClassname} />
          </FormField>
          <FormField id="address2" label={t("addresses.address2")}>
            <input type="text" name="address2" value={editingAddress.address2} onChange={handleModalChange} className={inputClassname} />
          </FormField>
          <FormField id="company" label={t("addresses.modal.company")}>
            <input type="text" name="company" value={editingAddress.company} onChange={handleModalChange} className={inputClassname} />
          </FormField>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <FormField id="city" label={t("addresses.city")} required>
              <input type="text" name="city" required value={editingAddress.city} onChange={handleModalChange} className={inputClassname} />
            </FormField>
            <FormField id="postalCode" label={t("addresses.postalCode")} required>
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
          <FormField id="phone" label={t("addresses.phone")} required>
            <input type="tel" name="phone" required value={editingAddress.phone} onChange={handleModalChange} className={inputClassname} />
          </FormField>
          <FormField id="email" label={t("addresses.email")} required>
            <input type="email" name="email" required value={editingAddress.email} onChange={handleModalChange} className={inputClassname} />
          </FormField>
          {/* Checkboxes Section */}
          <fieldset className="pt-4">
            <legend className="block text-sm font-medium leading-6 text-gray-900 mb-2">Type d&apos;adresse</legend>
            <div className="space-y-3">
              {/* Billing Checkbox */}
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
                    {t("addresses.billing")}
                  </label>
                </div>
              </div>
              {/* Shipping Checkbox */}
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
                    {t("addresses.shipping")}
                  </label>
                </div>
              </div>
            </div>
          </fieldset>
          {/* Form Buttons */}
          <div className="mt-6 pt-5 border-t border-gray-200 flex justify-end gap-x-3">
            {/* Cancel Button */}
            <button
              type="button"
              // Light/secondary button style
              className={twMerge(buttonClassname, "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50")}
              onClick={() => setIsModalOpen(false)}
            >
              {t("addresses.modal.cancel")}
            </button>
            {/* Save Button */}
            <SubmitButton text={t("addresses.modal.save")} />
          </div>
        </form>
      </div>
    </div>
  );
}
