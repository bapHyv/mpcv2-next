"use client";

import { Address } from "@/app/types/profileTypes";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";

interface Params {
  addresses: Address[];
  setEditingAddress: Dispatch<SetStateAction<Address | null>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Addresses({ addresses, setEditingAddress, setIsModalOpen }: Params) {
  const t = useTranslations("addresses");
  return (
    <ul role="list" className="max-w-4xl mx-auto p-6">
      {addresses.map((address: Address, i) => (
        <li key={`${address.id}-${i}`} className="bg-white shadow-md rounded-lg p-6 mb-4 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-green">{address.address1}</h3>
              <p className="text-sm text-gray-600">{`${address.country}, ${address.city} ${address.postalCode}`}</p>
            </div>
            <div className="text-sm text-gray-500 flex gap-4">
              <button
                className="text-green hover:text-teal-800 font-medium"
                onClick={() => {
                  setEditingAddress(address);
                  setIsModalOpen(true);
                }}
              >
                {t("modal.update")}
              </button>
              <button className="text-red-600 hover:text-red-800 font-medium">{t("modal.delete")}</button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
