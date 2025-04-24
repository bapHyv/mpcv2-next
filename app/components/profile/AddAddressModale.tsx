"use client";

import { useTranslations } from "next-intl";
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { v4 as uuid } from "uuid";
import { twMerge } from "tailwind-merge";
import { XMarkIcon } from "@heroicons/react/24/solid";

import { Address } from "@/app/types/profileTypes";
import { addAddress } from "@/app/actions";
import { isAddress } from "@/app/utils/typeGuardsFunctions";
import { useAuth } from "@/app/context/authContext";
import { useAlerts } from "@/app/context/alertsContext";
import { useSse } from "@/app/context/sseContext";
import { disableBodyScroll, enableBodyScroll } from "@/app/utils/bodyScroll";

import { inputClassname, buttonClassname, checkRadioClassname } from "@/app/staticData/cartPageClasses";
import Star from "@/app/components/Star";
import SubmitButton from "@/app/components/SubmitButton";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { IActionResponse } from "@/app/types/apiTypes";

interface Params {
  setIsAddModalOpen: Dispatch<SetStateAction<boolean>>;
}

type addAddressForm = Omit<Address, "id">;

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

export default function AddAddressModale({ setIsAddModalOpen }: Params) {
  const t = useTranslations("");

  const { setUserData } = useAuth();
  const { addAlert } = useAlerts();
  const { sseData } = useSse();

  const [formData, setFormData] = useState<addAddressForm>({
    firstname: "",
    lastname: "",
    company: "",
    country: sseData?.shippingMethods?.byShippingZones ? Object.keys(sseData.shippingMethods.byShippingZones)[0] || "" : "",
    address1: "",
    address2: "",
    postalCode: "",
    city: "",
    phone: "",
    email: "",
    billing: false,
    shipping: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [actionResponse, setActionResponse] = useState<IActionResponse>({
    message: "",
    data: null,
    isSuccess: false,
    statusCode: 0,
  });

  const handleResetActionResponse = () => {
    setActionResponse({
      message: "",
      data: null,
      isSuccess: false,
      statusCode: 0,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.type === "checkbox" ? target.checked : target.value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const addAddressFunction = async () => {
      try {
        const strigifiedData = JSON.stringify(formData);
        setIsLoading(true);
        console.log("Adding address...");
        const response = await addAddress(strigifiedData);
        setIsLoading(false);
        setActionResponse(response);
      } catch (error) {
        console.error(error);
      }
    };
    addAddressFunction();
  };

  useEffect(() => {
    disableBodyScroll();
    return () => enableBodyScroll();
  }, []);

  useEffect(() => {
    if (actionResponse.statusCode !== 0) {
      if (actionResponse.isSuccess && isAddress(actionResponse.data) && actionResponse.statusCode === 200) {
        setUserData((prevState) => {
          if (prevState) return { ...prevState, addresses: [...prevState.addresses, actionResponse.data as Address] };
          return null;
        });
        addAlert(uuid(), t("alerts.profile.addresses.add.200.text"), t("alerts.profile.addresses.add.200.title"), "emerald");
        setIsAddModalOpen(false);
        setIsLoading(false);
        setTimeout(() => handleResetActionResponse(), 1000);
      } else if (!actionResponse.isSuccess) {
        let titleKey = "alerts.genericError.title";
        let textKey = "alerts.genericError.text";
        let alertType: "yellow" | "red" = "red";

        switch (actionResponse.statusCode) {
          case 400:
            titleKey = "alerts.profile.addresses.add.400.title";
            textKey = "alerts.profile.addresses.add.400.text";
            alertType = "yellow";
            break;
          case 409:
            titleKey = "alerts.profile.addresses.add.409.title";
            textKey = "alerts.profile.addresses.add.409.text";
            alertType = "yellow";
            break;
          case 422:
            titleKey = "alerts.profile.addresses.add.422.title";
            textKey = "alerts.profile.addresses.add.422.text";
            alertType = "yellow";
            break;
        }
        const alertText = actionResponse.message || t(textKey);
        addAlert(uuid(), alertText, t(titleKey), alertType);
        setTimeout(() => handleResetActionResponse(), 1000);
        setIsAddModalOpen(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionResponse]);

  return (
    <div
      className="fixed inset-0 z-[7000] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
      onMouseDown={() => setIsAddModalOpen(false)}
    >
      <div className="relative w-full max-w-lg mx-auto">
        <div
          className="bg-white rounded-lg p-6 sm:p-8 shadow-xl w-full max-w-lg mx-auto relative transform transition-all duration-300 ease-in-out overflow-y-auto max-h-[90vh]"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{t("addressesPage.addModalTitle")}</h2> {/* Translated Title */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green rounded-md"
            >
              <span className="sr-only">{t("addresses.modal.closeButtonSR")}</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <FormField id="firstname" label={t("addressesPage.form.firstNameLabel")} required>
                <input type="text" name="firstname" required value={formData.firstname} onChange={handleChange} className={inputClassname} />
              </FormField>
              <FormField id="lastname" label={t("addressesPage.form.lastNameLabel")} required>
                <input type="text" name="lastname" required value={formData.lastname} onChange={handleChange} className={inputClassname} />
              </FormField>
            </div>
            <FormField id="country" label={t("addressesPage.form.countryLabel")} required>
              <select name="country" required value={formData.country} onChange={handleChange} className={inputClassname}>
                {sseData?.shippingMethods?.byShippingZones &&
                  Object.keys(sseData.shippingMethods.byShippingZones).map((s, i) => (
                    <option key={s + i} value={s}>
                      {s}
                    </option>
                  ))}
              </select>
            </FormField>
            <FormField id="address1" label={t("addressesPage.form.address1Label")} required>
              <input type="text" name="address1" required value={formData.address1} onChange={handleChange} className={inputClassname} />
            </FormField>
            <FormField id="address2" label={t("addressesPage.form.address2Label")}>
              <input type="text" name="address2" value={formData.address2} onChange={handleChange} className={inputClassname} />
            </FormField>
            <FormField id="company" label={t("addressesPage.form.companyLabel")}>
              <input type="text" name="company" value={formData.company} onChange={handleChange} className={inputClassname} />
            </FormField>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <FormField id="city" label={t("addressesPage.form.cityLabel")} required>
                <input type="text" name="city" required value={formData.city} onChange={handleChange} className={inputClassname} />
              </FormField>
              <FormField id="postalCode" label={t("addressesPage.form.postalCodeLabel")} required>
                <input type="text" name="postalCode" required value={formData.postalCode} onChange={handleChange} className={inputClassname} />
              </FormField>
            </div>
            <FormField id="phone" label={t("addressesPage.form.phoneLabel")} required>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className={inputClassname} />
            </FormField>
            <FormField id="email" label={t("addressesPage.form.emailLabel")} required>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputClassname} />
            </FormField>
            {/* Checkboxes */}
            <fieldset className="pt-4">
              <legend className="block text-sm font-medium leading-6 text-gray-900 mb-2">{t("addressesPage.form.addressTypeLegend")}</legend>{" "}
              <div className="space-y-3">
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="billing"
                      name="billing"
                      type="checkbox"
                      checked={formData.billing}
                      onChange={handleChange}
                      className={checkRadioClassname}
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label htmlFor="billing" className="font-medium text-gray-900 cursor-pointer">
                      {t("addressesPage.form.billingCheckboxLabel")}
                    </label>
                  </div>{" "}
                </div>
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="shipping"
                      name="shipping"
                      type="checkbox"
                      checked={formData.shipping}
                      onChange={handleChange}
                      className={checkRadioClassname}
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label htmlFor="shipping" className="font-medium text-gray-900 cursor-pointer">
                      {t("addressesPage.form.shippingCheckboxLabel")}
                    </label>
                  </div>{" "}
                </div>
              </div>
            </fieldset>
            {/* Buttons */}
            <div className="mt-6 pt-5 border-t border-gray-200 flex justify-end gap-x-3">
              <button
                type="button"
                className={twMerge(buttonClassname, "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50")}
                onClick={() => setIsAddModalOpen(false)}
              >
                {t("addressesPage.form.cancelButton")}
              </button>
              <SubmitButton text={t("addressesPage.form.submitAddButton")} isDisabled={isLoading} />
            </div>
          </form>
        </div>

        {isLoading && (
          <>
            <div className="absolute inset-0 bg-white opacity-60" />

            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
