"use client";

import { Address } from "@/app/types/profileTypes";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";

interface Params {
  editingAddress: Address;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setEditingAddress: Dispatch<SetStateAction<Address | null>>;
}

export default function UpdateAddresseModale({ editingAddress, setEditingAddress, setIsModalOpen }: Params) {
  const t = useTranslations("addresses");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => setIsModalOpen(false)} // Close modal on background click
    >
      <div
        className="bg-white rounded-lg p-6 md:p-8 shadow-lg w-11/12 md:max-w-lg mx-auto relative transform transition-all duration-300 ease-in-out overflow-y-auto max-h-[80vh]"
        onClick={(e) => e.stopPropagation()} // Prevent background click from closing modal
      >
        <h2 className="text-2xl font-semibold mb-6 text-green">{t("modal.title")}</h2>
        <form>
          <div className="grid grid-cols-1 gap-y-4 md:gap-y-6">
            {/* Firstname */}
            <div>
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                {t("firstName")}
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                required
                value={editingAddress.firstname}
                onChange={(e) => setEditingAddress((prev) => ({ ...prev!, firstname: e.target.value }))}
                placeholder={t("firstName")}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
              />
            </div>

            {/* Lastname */}
            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                {t("lastName")}
              </label>
              <input
                required
                type="text"
                id="lastname"
                name="lastname"
                value={editingAddress.lastname}
                onChange={(e) => setEditingAddress((prev) => ({ ...prev!, lastname: e.target.value }))}
                placeholder={t("lastName")}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
              />
            </div>

            {/* Address Line 1 */}
            <div>
              <label htmlFor="address1" className="block text-sm font-medium text-gray-700">
                {t("address1")}
              </label>
              <input
                type="text"
                id="address1"
                name="address1"
                required
                value={editingAddress.address1}
                onChange={(e) => setEditingAddress((prev) => ({ ...prev!, address1: e.target.value }))}
                placeholder={t("address1")}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
              />
            </div>

            {/* Address Line 2 */}
            <div>
              <label htmlFor="address2" className="block text-sm font-medium text-gray-700">
                {t("address2")}
              </label>
              <input
                type="text"
                id="address2"
                name="address2"
                value={editingAddress.address2 || ""}
                onChange={(e) => setEditingAddress((prev) => ({ ...prev!, address2: e.target.value }))}
                placeholder={t("address2")}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
              />
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                {t("city")}
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                value={editingAddress.city}
                onChange={(e) => setEditingAddress((prev) => ({ ...prev!, city: e.target.value }))}
                placeholder={t("city")}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
              />
            </div>

            {/* Postal Code */}
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                {t("postalCode")}
              </label>
              <input
                type="number"
                id="postalCode"
                name="postalCode"
                required
                value={editingAddress.postalCode}
                onChange={(e) => setEditingAddress((prev) => ({ ...prev!, postalCode: e.target.value }))}
                placeholder={t("postalCode")}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
              />
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                {t("country")}
              </label>
              <input
                type="text"
                id="country"
                name="country"
                required
                value={editingAddress.country}
                onChange={(e) => setEditingAddress((prev) => ({ ...prev!, country: e.target.value }))}
                placeholder={t("country")}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                {t("phone")}
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                required
                value={editingAddress.phone || ""}
                onChange={(e) => setEditingAddress((prev) => ({ ...prev!, phone: e.target.value }))}
                placeholder={t("phone")}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
              />
            </div>

            {/* Address Type */}
            <div>
              <label htmlFor="addressType" className="block text-sm font-medium text-gray-700">
                {t("modal.addressType.title")}
              </label>
              <select
                id="addressType"
                name="addressType"
                value={editingAddress.billing && editingAddress.shipping ? "both" : editingAddress.billing ? "billing" : "shipping"}
                onChange={(e) => {
                  const value = e.target.value;
                  setEditingAddress((prev) => ({
                    ...prev!,
                    billing: value === "billing" || value === "both",
                    shipping: value === "shipping" || value === "both",
                  }));
                }}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
              >
                <option value="billing">{t("modal.addressType.billing")}</option>
                <option value="shipping">{t("modal.addressType.shipping")}</option>
                <option value="both">{t("modal.addressType.both")}</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button type="button" className="text-gray-700 hover:text-gray-900 font-medium" onClick={() => setIsModalOpen(false)}>
              {t("modal.cancel")}
            </button>
            <button type="submit" className="bg-green text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors">
              {t("modal.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
