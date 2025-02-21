"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { useTranslations } from "next-intl";
import { v4 as uuid } from "uuid";

import { useAlerts } from "@/app/context/alertsContext";
import { useAuth } from "@/app/context/authContext";
import { Address } from "@/app/types/profileTypes";
import { updateAddress } from "@/app/actions";
import { isAddress } from "@/app/utils/typeGuardsFunctions";

interface Params {
  editingAddress: Address;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setEditingAddress: Dispatch<SetStateAction<Address | null>>;
}

export default function UpdateAddresseModale({ editingAddress, setEditingAddress, setIsModalOpen }: Params) {
  const t = useTranslations("");

  // @ts-ignore
  const [state, formAction] = useFormState(updateAddress, editingAddress);

  const { setUserData } = useAuth();
  const { addAlert } = useAlerts();

  useEffect(() => {
    if (state.isSuccess && isAddress(state.data) && state.data && state.statusCode === 200) {
      const updatedAddress = state.data;
      setUserData((prevState) => {
        if (prevState) {
          const filteredAddresses = prevState.addresses.filter((address) => address.id != updatedAddress.id);
          return {
            ...prevState,
            addresses: [...filteredAddresses, updatedAddress],
          };
        } else {
          return null;
        }
      });

      addAlert(uuid(), t("alerts.profile.addresses.update.200.text"), t("alerts.profile.addresses.update.200.title"), "emerald");
      setIsModalOpen(false);
    } else if (!state.isSuccess && !state.data) {
      switch (state.statusCode) {
        case 400:
          addAlert(uuid(), t("alerts.profile.addresses.update.400.text"), t("alerts.profile.addresses.update.400.title"), "yellow");
          break;
        case 422:
          addAlert(uuid(), t("alerts.profile.addresses.update.422.text"), t("alerts.profile.addresses.update.422.title"), "yellow");
          break;
        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onMouseDown={() => setIsModalOpen(false)} // Close modal on background click
    >
      <div
        className="bg-white rounded-lg p-6 md:p-8 shadow-lg w-11/12 md:max-w-lg mx-auto relative transform transition-all duration-300 ease-in-out overflow-y-auto max-h-[80dvh] md:max-h-[90dvh]"
        onMouseDown={(e) => e.stopPropagation()} // Prevent background click from closing modal
      >
        <h2 className="text-2xl font-semibold mb-6 text-green">{t("addresses.modal.title")}</h2>
        <form action={formAction}>
          <input type="hidden" name="addressId" id="addressId" value={editingAddress.id} />
          <div className="grid grid-cols-1 gap-y-4 md:gap-y-6">
            {/* Firstname */}
            <div>
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                {t("addresses.firstName")}
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                required
                value={editingAddress.firstname}
                onChange={(e) => setEditingAddress((prev) => ({ ...prev!, firstname: e.target.value }))}
                placeholder={t("addresses.firstName")}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
              />
            </div>

            {/* Lastname */}
            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                {t("addresses.lastName")}
              </label>
              <input
                required
                type="text"
                id="lastname"
                name="lastname"
                value={editingAddress.lastname}
                onChange={(e) => setEditingAddress((prev) => ({ ...prev!, lastname: e.target.value }))}
                placeholder={t("addresses.lastName")}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
              />
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                {t("addresses.country")}
              </label>
              <input
                type="text"
                id="country"
                name="country"
                required
                value={editingAddress.country}
                onChange={(e) => setEditingAddress((prev) => ({ ...prev!, country: e.target.value }))}
                placeholder={t("addresses.country")}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
              />
            </div>

            {/* Address Line 1 */}
            <div>
              <label htmlFor="address1" className="block text-sm font-medium text-gray-700">
                {t("addresses.address1")}
              </label>
              <input
                type="text"
                id="address1"
                name="address1"
                required
                value={editingAddress.address1}
                onChange={(e) => setEditingAddress((prev) => ({ ...prev!, address1: e.target.value }))}
                placeholder={t("addresses.address1")}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
              />
            </div>

            {/* Address Line 2 */}
            <div>
              <label htmlFor="address2" className="block text-sm font-medium text-gray-700">
                {t("addresses.address2")}
              </label>
              <input
                type="text"
                id="address2"
                name="address2"
                value={editingAddress.address2}
                onChange={(e) => setEditingAddress((prev) => ({ ...prev!, address2: e.target.value }))}
                placeholder={t("addresses.address2")}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
              />
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                {t("addresses.modal.company")}
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={editingAddress.company}
                onChange={(e) => setEditingAddress((prev) => ({ ...prev!, company: e.target.value }))}
                placeholder={t("addresses.modal.company")}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
              />
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                {t("addresses.city")}
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                value={editingAddress.city}
                onChange={(e) => setEditingAddress((prev) => ({ ...prev!, city: e.target.value }))}
                placeholder={t("addresses.city")}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
              />
            </div>

            {/* Postal Code */}
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                {t("addresses.postalCode")}
              </label>
              <input
                type="number"
                id="postalCode"
                name="postalCode"
                required
                value={editingAddress.postalCode}
                onChange={(e) => setEditingAddress((prev) => ({ ...prev!, postalCode: e.target.value }))}
                placeholder={t("addresses.postalCode")}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                {t("addresses.phone")}
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                required
                value={editingAddress.phone}
                onChange={(e) => setEditingAddress((prev) => ({ ...prev!, phone: e.target.value }))}
                placeholder={t("addresses.phone")}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
              />
            </div>

            {/* City */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t("addresses.email")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={editingAddress.email}
                onChange={(e) => setEditingAddress((prev) => ({ ...prev!, email: e.target.value }))}
                placeholder={t("addresses.email")}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
              />
            </div>

            {/* Address Type */}
            {/* Billing Checkbox */}
            <div className="flex flex-col">
              <div>
                <input
                  id="billing"
                  name="billing"
                  type="checkbox"
                  checked={editingAddress.billing}
                  onChange={(e) => setEditingAddress((prev) => ({ ...prev!, billing: e.target.checked }))}
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
                  checked={editingAddress.shipping}
                  onChange={(e) =>
                    setEditingAddress((prev) => {
                      console.log(e.target.checked);
                      return { ...prev!, shipping: e.target.checked };
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-green focus:ring-green"
                />
                <label htmlFor="shipping" className="text-sm font-medium text-gray-700 ml-2">
                  {t("addresses.shipping")}
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button type="button" className="px-3 py-2 bg-red-600 text-white rounded-md" onClick={() => setIsModalOpen(false)}>
              {t("addresses.modal.cancel")}
            </button>
            <button type="submit" className="bg-green text-white px-3 py-2 rounded-md transition-colors">
              {t("addresses.modal.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
