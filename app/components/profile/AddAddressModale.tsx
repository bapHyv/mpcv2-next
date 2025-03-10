"use client";

import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { v4 as uuid } from "uuid";

import { Address } from "@/app/types/profileTypes";
import { addAddress } from "@/app/actions";
import { isAddress } from "@/app/utils/typeGuardsFunctions";
import { useAuth } from "@/app/context/authContext";
import { useAlerts } from "@/app/context/alertsContext";
import { useSse } from "@/app/context/sseContext";

interface Params {
  setIsAddModalOpen: Dispatch<SetStateAction<boolean>>;
}

type addAddressForm = Omit<Address, "id">;

export default function AddAddressModale({ setIsAddModalOpen }: Params) {
  const t = useTranslations();
  const { setUserData } = useAuth();
  const { addAlert } = useAlerts();
  const { sseData } = useSse();

  const [formData, setFormData] = useState<addAddressForm>({
    firstname: "",
    lastname: "",
    company: "",
    country: sseData ? Object.keys(sseData?.shippingMethods.byShippingZones)[0] : "",
    address1: "",
    address2: "",
    postalCode: "",
    city: "",
    phone: "",
    email: "",
    billing: false,
    shipping: false,
  });

  //@ts-ignore
  const [state, formAction] = useFormState(addAddress, formData);

  useEffect(() => {
    console.log(state.data);
    if (state.isSuccess && state.data && state.statusCode === 200) {
      setUserData((prevState) => {
        if (prevState && isAddress(state.data)) {
          return {
            ...prevState,
            addresses: [...prevState.addresses, state.data],
          };
        } else {
          return null;
        }
      });

      addAlert(uuid(), t("alerts.profile.addresses.add.200.text"), t("alerts.profile.addresses.add.200.title"), "emerald");
      setIsAddModalOpen(false);
    } else if (!state.isSuccess && !state.data) {
      switch (state.statusCode) {
        case 400:
          addAlert(uuid(), t("alerts.profile.addresses.add.400.text"), t("alerts.profile.addresses.add.400.title"), "yellow");
          setIsAddModalOpen(false);
          break;
        case 409:
          addAlert(uuid(), t("alerts.profile.addresses.add.409.text"), t("alerts.profile.addresses.add.409.title"), "yellow");
          setIsAddModalOpen(false);
          break;
        case 422:
          addAlert(uuid(), t("alerts.profile.addresses.add.422.text"), t("alerts.profile.addresses.add.422.title"), "yellow");
          setIsAddModalOpen(false);
          break;
        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const isChecked = target.checked;
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? isChecked : value,
    }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      // onClick={() => setIsAddModalOpen(false)}
      onMouseDown={() => setIsAddModalOpen(false)}
    >
      <div
        className="bg-white rounded-lg p-6 md:p-8 shadow-lg w-11/12 md:max-w-lg mx-auto relative transform transition-all duration-300 ease-in-out overflow-y-auto max-h-[80vh]"
        onMouseDown={(e) => e.stopPropagation()} // Prevent background click from closing modal
      >
        <h2 className="text-2xl font-semibold mb-6 text-green">{t("addresses.addAddress")}</h2>

        <form action={formAction} className="max-w-4xl mx-auto flex flex-col gap-y-5">
          {/* Firstname */}
          <div>
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
              {t("addresses.firstName")}
            </label>
            <input
              id="firstname"
              name="firstname"
              type="text"
              required
              value={formData.firstname}
              onChange={handleChange}
              className=" block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
            />
          </div>

          {/* Lastname */}
          <div>
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
              {t("addresses.lastName")}
            </label>
            <input
              id="lastname"
              name="lastname"
              type="text"
              required
              value={formData.lastname}
              onChange={handleChange}
              className=" block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
            />
          </div>

          {/* Country Selector */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              {t("addresses.country")}
            </label>
            <select
              id="country"
              name="country"
              required
              value={formData.country}
              onChange={handleChange}
              className=" block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
            >
              {sseData &&
                Object.keys(sseData.shippingMethods.byShippingZones).map((s, i) => (
                  <option key={s + i} value={s}>
                    {s}
                  </option>
                ))}
            </select>
          </div>

          {/* Street Address */}
          <div>
            <label htmlFor="address1" className="block text-sm font-medium text-gray-700">
              {t("addresses.address1")}
            </label>
            <input
              id="address1"
              name="address1"
              type="text"
              required
              value={formData.address1}
              onChange={handleChange}
              className=" block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label htmlFor="address2" className="block text-sm font-medium text-gray-700">
              {t("addresses.address2")}
            </label>
            <input
              id="address2"
              name="address2"
              type="text"
              value={formData.address2}
              onChange={handleChange}
              className=" block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
            />
          </div>

          {/* Company */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              {t("addresses.modal.company")}
            </label>
            <input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              className=" block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
            />
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              {t("addresses.city")}
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              required
              onChange={handleChange}
              className=" block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
            />
          </div>

          {/* Postal Code */}
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
              {t("addresses.postalCode")}
            </label>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              required
              value={formData.postalCode}
              onChange={handleChange}
              className=" block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              {t("addresses.phone")}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              className=" block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t("addresses.email")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className=" block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
            />
          </div>

          {/* Billing Checkbox */}
          <div className="flex flex-col">
            <div>
              <input
                id="billing"
                name="billing"
                type="checkbox"
                checked={formData.billing}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-green focus:ring-green"
              />
              <label htmlFor="billing" className="text-sm font-medium text-gray-700 ml-2">
                {t("addresses.billing")}
              </label>
            </div>
            <div>
              <input
                id="shipping"
                name="shipping"
                type="checkbox"
                checked={formData.shipping}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-green focus:ring-green"
              />
              <label htmlFor="shipping" className="text-sm font-medium text-gray-700 ml-2">
                {t("addresses.shipping")}
              </label>
            </div>
          </div>

          {/* Form Buttons */}
          <div className="mt-2 flex justify-end gap-4">
            <button type="button" className="px-3 py-2 bg-red-600 text-white rounded-md" onClick={() => setIsAddModalOpen(false)}>
              {t("addresses.modal.cancel")}
            </button>
            <button
              type="submit"
              className="rounded-md bg-green px-3 py-2 text-white hover:bg-teal-700 focus:ring-2 focus:ring-green transition-colors"
            >
              {t("addresses.addAddress")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
