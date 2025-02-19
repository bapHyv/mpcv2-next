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

  /**
   * UI:
   *  [x] display addresses from authContext instead of localStorage
   *  [x] If no address: No address registered yet. Press the button below to add one, you'll be able to choose them when purchasing something
   *  [x] Add button "Add address"
   *  [x] Put the add address form in a modal
   *
   * add address:
   *  [-] get response
   *  [-] add address with setUserData
   *  [-] alert different cases
   *
   * delete address:
   *  [-] filter out address with address id using setUserData
   *  [-] alert different cases
   *
   * update address:
   *  [-] get response
   *  [-] update address with setUserData
   *  [-] alert different cases
   */

  return (
    <>
      <p className="text-green text-center font-medium text-2xl my-8">{t("title")}</p>
      {!userData ? null : userData.addresses ? (
        <DisplayAddresses addresses={userData.addresses} setEditingAddress={setEditingAddress} setIsModalOpen={setIsModalOpen} />
      ) : (
        <p
          className="m-8 p-4 md:p-8 border border-neutral-300 rounded-md text-neutral-500 italic text-center"
          onClick={() => setIsAddModalOpen(true)}
        >
          No address registered yet. Press on the text or the button below to add one, you will be able to choose them when purchasing something
        </p>
      )}
      <div className="flex items-center justify-center">
        <button type="button" className="px-3 py-2 rounded-md bg-blue-500 cursor-pointer text-white" onClick={() => setIsAddModalOpen(true)}>
          Add address
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
