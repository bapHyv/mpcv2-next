"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";

import DisplayAddresses from "@/app/components/profile/DisplayAddresses";
import UpdateAddresseModale from "@/app/components/profile/UpdateAddresseModale";
import AddAddressModale from "@/app/components/profile/AddAddressModale";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import Title from "@/app/components/Title";

import { Address } from "@/app/types/profileTypes";
import { useAuth } from "@/app/context/authContext";
import { buttonClassname, subtleSectionWrapperClassname, titleClassname } from "@/app/staticData/cartPageClasses";
import { PlusIcon } from "@heroicons/react/20/solid";

export default function Content() {
  const t = useTranslations("addresses");

  const { userData } = useAuth();
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (address: Address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Title title={t("title")} type="h1" classname={twMerge(titleClassname, "md:mt-14 text-green")} firstLetterClassname="text-xl" />

      {/* Main Content Area */}
      <div className="mb-8">
        {" "}
        {!userData ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <LoadingSpinner size="lg" color="green" />
          </div>
        ) : userData.addresses && userData.addresses.length > 0 ? (
          <DisplayAddresses addresses={userData.addresses} setIsModalOpen={handleOpenEditModal} />
        ) : (
          // Empty state - styled subtly
          <div className={twMerge(subtleSectionWrapperClassname, "text-center")}>
            <p className="text-gray-600 italic mb-4">{t("text")}</p>
            {/* Add button directly within the empty state */}
            <button
              type="button"
              className={twMerge(buttonClassname, "inline-flex items-center")} // Use standard button style
              onClick={handleOpenAddModal}
            >
              <PlusIcon className="h-5 w-5 mr-1.5" aria-hidden="true" />
              {t("button")}
            </button>
          </div>
        )}
      </div>

      {/* Always show Add button if user has addresses */}
      {userData && userData.addresses && userData.addresses.length > 0 && (
        <div className="flex items-center justify-center mt-6">
          <button
            type="button"
            className={twMerge(buttonClassname, "inline-flex items-center")} // Style add button
            onClick={handleOpenAddModal}
          >
            <PlusIcon className="h-5 w-5 mr-1.5" aria-hidden="true" />
            {t("button")}
          </button>
        </div>
      )}

      {/* Modal Components (remain functionally the same) */}
      {isAddModalOpen && <AddAddressModale setIsAddModalOpen={setIsAddModalOpen} />}
      {isModalOpen && editingAddress && (
        <UpdateAddresseModale
          editingAddress={editingAddress}
          setEditingAddress={setEditingAddress} // Pass setter for internal state mgmt
          setIsModalOpen={setIsModalOpen} // Pass standard setter to close
        />
      )}
    </div>
  );
}
