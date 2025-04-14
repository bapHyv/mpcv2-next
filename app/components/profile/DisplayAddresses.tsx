"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useTranslations } from "next-intl";
import { v4 as uuid } from "uuid";
import { twMerge } from "tailwind-merge";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

import { Address } from "@/app/types/profileTypes";
import { deleteAddress } from "@/app/actions";
import { useAuth } from "@/app/context/authContext";
import { isId } from "@/app/utils/typeGuardsFunctions";
import { useAlerts } from "@/app/context/alertsContext";
import { buttonClassname } from "@/app/staticData/cartPageClasses";

interface Params {
  addresses: Address[];
  setIsModalOpen: (address: Address) => void;
}

export default function AddressList({ addresses, setIsModalOpen }: Params) {
  const t = useTranslations("");
  const initialState = { message: "", data: null, isSuccess: false, statusCode: 0, id: "" };
  const [state, formAction] = useFormState(deleteAddress, initialState as any);
  const { setUserData } = useAuth();
  const { addAlert } = useAlerts();

  useEffect(() => {
    if (state.statusCode !== 0) {
      if (state.isSuccess && isId(state.data) && state.statusCode === 200) {
        const { id } = state.data;
        setUserData((prevState) => {
          if (prevState) {
            const addressIdToRemove = typeof id === "number" ? id : parseInt(id, 10);
            if (isNaN(addressIdToRemove)) return prevState;

            const updatedAddresses = prevState.addresses.filter((address) => address.id !== addressIdToRemove);
            return { ...prevState, addresses: updatedAddresses };
          }
          return null;
        });
        addAlert(uuid(), t("alerts.profile.addresses.delete.200.text"), t("alerts.profile.addresses.delete.200.title"), "emerald");
      } else {
        let titleKey = "alerts.genericError.title";
        let textKey = "alerts.genericError.text";
        let alertType: "yellow" | "red" = "red";

        switch (state.statusCode) {
          case 400:
            titleKey = "alerts.profile.addresses.delete.400.title";
            textKey = "alerts.profile.addresses.delete.400.text";
            alertType = "yellow";
            break;
          case 500:
            titleKey = "alerts.profile.addresses.delete.500.title";
            textKey = "alerts.profile.addresses.delete.500.text";
            alertType = "red";
            break;
          // TODO: Add 403, 404 cases if needed
        }
        const alertText = state.message || t(textKey);
        addAlert(uuid(), alertText, t(titleKey), alertType);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <ul role="list" className="space-y-4">
      {addresses.map((address: Address, i) => (
        <li
          key={address.id}
          className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow duration-150 ease-in-out"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            {/* Address Details */}
            <div className="flex-grow">
              <h3 className="text-base font-semibold text-gray-900">{address.address1}</h3>
              <div className="mt-1 text-sm text-gray-600 space-y-0.5">
                {address.address2 && <p>{address.address2}</p>}
                <p>
                  {address.postalCode} {address.city}
                </p>
                <p>{address.country}</p>
                {/* Show Name */}
                <p className="mt-2 text-xs text-gray-500">
                  {address.firstname} {address.lastname}
                </p>
                {/* Badges */}
                <div className="mt-2 space-x-2">
                  {address.billing && (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {t("addressesPage.billingBadge")}
                    </span>
                  )}
                  {address.shipping && (
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                      {t("addressesPage.shippingBadge")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-shrink-0 gap-x-2 self-end sm:self-center">
              {/* Edit Button */}
              <button
                type="button"
                className={twMerge(buttonClassname, "bg-white border border-gray-300 !text-gray-700 hover:bg-gray-50 px-3 py-1.5 text-xs")}
                onClick={() => setIsModalOpen(address)}
              >
                <PencilIcon className="h-4 w-4 mr-1 sm:mr-0" />
                <span className="hidden sm:inline">{t("addressesPage.editButton")}</span>
              </button>
              {/* Delete Button Form */}
              <form action={formAction} className="inline-block">
                <input type="hidden" value={address.id} name="addressId" />
                <button
                  type="submit"
                  className={twMerge(buttonClassname, "bg-red-600 hover:bg-red-700 focus:ring-red-500 px-3 py-1.5 text-xs")}
                  // Optional: Add confirmation
                  // onClick={(e) => !confirm(t('addressesPage.deleteConfirmPrompt')) && e.preventDefault()} // TODO-TRANSLATION for confirm prompt
                >
                  <TrashIcon className="h-4 w-4 mr-1 sm:mr-0" />
                  <span className="hidden sm:inline">{t("addressesPage.deleteButton")}</span>
                </button>
              </form>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
