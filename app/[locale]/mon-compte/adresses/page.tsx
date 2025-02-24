"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { useAuth } from "@/app/context/authContext";
import { addAddress, deleteAddress, updateAddress } from "@/app/actions";
import { Address } from "@/app/types/profileTypes";
import DisplayAddresses from "@/app/components/profile/DisplayAddresses";
import UpdateAddresseModale from "@/app/components/profile/UpdateAddresseModale";
import AddAddressModale from "@/app/components/profile/AddAddressModale";

export default function Page() {
  const t = useTranslations("addresses");

  const { userData } = useAuth();
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <p className="text-green text-center font-medium text-2xl my-8">{t("title")}</p>
      {!userData ? null : !!userData.addresses.length ? (
        <DisplayAddresses addresses={userData.addresses} setEditingAddress={setEditingAddress} setIsModalOpen={setIsModalOpen} />
      ) : (
        <p
          className="m-8 p-4 md:p-8 border border-neutral-300 rounded-md text-neutral-500 italic text-center cursor-pointer"
          onClick={() => setIsAddModalOpen(true)}
        >
          {t("text")}
        </p>
      )}
      <div className="flex items-center justify-center">
        <button type="button" className="px-3 py-2 rounded-md bg-blue-500 cursor-pointer text-white" onClick={() => setIsAddModalOpen(true)}>
          {t("button")}
        </button>
      </div>

      {/* Form for Adding New Address */}
      {isAddModalOpen && <AddAddressModale setIsAddModalOpen={setIsAddModalOpen} />}
      {/* Modal for Editing Address */}
      {isModalOpen && editingAddress && (
        <UpdateAddresseModale editingAddress={editingAddress} setEditingAddress={setEditingAddress} setIsModalOpen={setIsModalOpen} />
      )}
    </>
  );
}
