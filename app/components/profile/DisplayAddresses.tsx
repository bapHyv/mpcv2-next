"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { useTranslations } from "next-intl";
import { v4 as uuid } from "uuid";

import { Address } from "@/app/types/profileTypes";
import { deleteAddress } from "@/app/actions";
import { useAuth } from "@/app/context/authContext";
import { isId } from "@/app/utils/typeGuardsFunctions";
import { useAlerts } from "@/app/context/alertsContext";

interface Params {
  addresses: Address[];
  setEditingAddress: Dispatch<SetStateAction<Address | null>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Addresses({ addresses, setEditingAddress, setIsModalOpen }: Params) {
  const initialState = { id: "" };
  const t = useTranslations();
  // @ts-ignore
  const [state, formAction] = useFormState(deleteAddress, initialState);
  const { setUserData } = useAuth();
  const { addAlert } = useAlerts();

  useEffect(() => {
    if (state.isSuccess && isId(state.data) && state.data && state.statusCode === 200) {
      const { id } = state.data;
      setUserData((prevState) => {
        if (prevState) {
          //@ts-ignore
          const addresses = prevState.addresses.filter((address) => address.id != id);
          return {
            ...prevState,
            addresses,
          };
        } else {
          return null;
        }
      });
      addAlert(uuid(), t("alerts.profile.addresses.delete.200.text"), t("alerts.profile.addresses.delete.200.title"), "emerald");
    } else if (!state.isSuccess && !state.data) {
      switch (state.statusCode) {
        case 400:
          addAlert(uuid(), t("alerts.profile.addresses.delete.400.text"), t("alerts.profile.addresses.delete.400.title"), "yellow");
          break;
        case 500:
          addAlert(uuid(), t("alerts.profile.addresses.delete.500.text"), t("alerts.profile.addresses.delete.500.title"), "red");
        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <ul role="list" className="max-w-2xl mx-auto px-6 pb-3 xl:p-6">
      {addresses.map((address: Address, i) => (
        <li key={`${address.id}-${i}`} className="bg-white border border-neutral-100 shadow-md rounded-lg p-6 mb-4 hover:shadow-lg transition-shadow">
          <div className="flex flex-col md:flex-row gap-y-3 justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{address.address1}</h3>
              <p className="text-sm text-gray-600">{`${address.country}, ${address.city} ${address.postalCode}`}</p>
            </div>
            <div className="text-sm text-gray-500 w-full md:w-fit flex justify-end gap-x-3">
              <button
                type="button"
                className="white py-2 px-3 bg-blue-500 text-white rounded-md"
                onClick={() => {
                  setEditingAddress(address);
                  setIsModalOpen(true);
                }}
              >
                {t("addresses.modal.update")}
              </button>
              <form action={formAction}>
                <input type="hidden" value={address.id} name="addressId" id="addressId" />
                <button type="submit" className="white py-2 px-3 bg-red-600 text-white rounded-md">
                  {t("addresses.modal.delete")}
                </button>
              </form>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
