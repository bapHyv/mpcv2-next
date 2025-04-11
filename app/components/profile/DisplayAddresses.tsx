// DisplayAddresses.tsx
"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { useTranslations } from "next-intl";
import { v4 as uuid } from "uuid";
import { twMerge } from "tailwind-merge"; // Import twMerge
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline"; // Icons for buttons

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

export default function DisplayAddresses({ addresses, setIsModalOpen }: Params) {
  const initialState = { message: "", data: null, isSuccess: false, statusCode: 0, id: "" };
  const t = useTranslations();
  const [state, formAction] = useFormState(deleteAddress, initialState as any);
  const { setUserData } = useAuth();
  const { addAlert } = useAlerts();

  useEffect(() => {
    if (state.statusCode !== 0) {
      if (state.isSuccess && isId(state.data) && state.statusCode === 200) {
        const { id } = state.data;
        setUserData((prevState) => {
          if (prevState) {
            const updatedAddresses = prevState.addresses.filter((address) => address.id !== parseInt(id)); // Ensure comparison is correct type if needed
            return {
              ...prevState,
              addresses: updatedAddresses,
            };
          }
          return null;
        });
        addAlert(uuid(), t("alerts.profile.addresses.delete.200.text"), t("alerts.profile.addresses.delete.200.title"), "emerald");
      } else {
        let alertTitle = t("alerts.genericError.title");
        let alertText = state.message || t("alerts.genericError.text");
        let alertType: "yellow" | "red" = "red";

        switch (state.statusCode) {
          case 400: // Bad Request (e.g., invalid ID format)
            alertTitle = t("alerts.profile.addresses.delete.400.title");
            alertText = state.message || t("alerts.profile.addresses.delete.400.text");
            alertType = "yellow";
            break;
          case 500: // Server Error
            alertTitle = t("alerts.profile.addresses.delete.500.title");
            alertText = state.message || t("alerts.profile.addresses.delete.500.text");
            alertType = "red";
            break;
        }
        addAlert(uuid(), alertText, alertTitle, alertType);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <ul role="list" className="space-y-4">
      {addresses.map((address: Address, i) => (
        <li
          key={`${address.id}-${i}`}
          className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow duration-150 ease-in-out"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            {/* Address Details */}
            <div className="flex-grow">
              <h3 className="text-base font-semibold text-gray-900">{address.address1}</h3>
              {/* Other details */}
              <div className="mt-1 text-sm text-gray-600 space-y-0.5">
                {address.address2 && <p>{address.address2}</p>}
                <p>
                  {address.postalCode} {address.city}
                </p>
                <p>{address.country}</p>
                <p className="mt-2 text-xs text-gray-500">
                  {address.firstname} {address.lastname}
                </p>
                <div className="mt-2 space-x-2">
                  {address.billing && (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                      Facturation
                    </span>
                  )}
                  {address.shipping && (
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                      Livraison
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Use flex-shrink-0 to prevent buttons from shrinking */}
            <div className="flex flex-shrink-0 gap-x-2 self-end sm:self-center">
              {" "}
              {/* Edit Button */}
              <button
                type="button"
                className={twMerge(buttonClassname, "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 text-xs")}
                onClick={() => setIsModalOpen(address)}
              >
                <PencilIcon className="h-4 w-4 sm:mr-0" /> <span className="hidden sm:inline">{t("addresses.modal.update")}</span>
              </button>
              <form action={formAction} className="inline-block">
                {" "}
                <input type="hidden" value={address.id} name="addressId" />
                <button type="submit" className={twMerge(buttonClassname, "bg-red-600 hover:bg-red-700 focus:ring-red-500 px-3 py-1.5 text-xs")}>
                  <TrashIcon className="h-4 w-4 sm:mr-0" /> <span className="hidden sm:inline">{t("addresses.modal.delete")}</span>
                </button>
              </form>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
