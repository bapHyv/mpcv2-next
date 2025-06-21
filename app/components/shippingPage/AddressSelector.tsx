"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";

import { useAuth } from "@/app/context/authContext";
import { useOrder } from "@/app/context/orderContext";
import { Address } from "@/app/types/profileTypes";
import { subtleSectionWrapperClassname } from "@/app/staticData/cartPageClasses";

interface AddressSelectorProps {
  type: "shipping" | "billing";
}

const AddressCard = ({ address, isSelected, onSelect }: { address: Address; isSelected: boolean; onSelect: () => void }) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={twMerge(
        "w-full text-left p-4 border rounded-lg transition-all duration-150 ease-in-out",
        isSelected ? "bg-green/10 border-green ring-2 ring-green shadow-md" : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
      )}
      aria-pressed={isSelected}
    >
      <p className="font-semibold text-gray-800">
        {address.firstname} {address.lastname}
      </p>
      <address className="text-sm text-gray-600 not-italic mt-1 space-y-0.5">
        {address.company && <p>{address.company}</p>}
        <p>{address.address1}</p>
        {address.address2 && <p>{address.address2}</p>}
        <p>
          {address.postalCode} {address.city}
        </p>
        <p>{address.country}</p>
      </address>
    </button>
  );
};

export default function AddressSelector({ type }: AddressSelectorProps) {
  const t = useTranslations("shippingPage.addressSelector");
  const { userData } = useAuth();
  const { order, setOrder } = useOrder();

  const availableAddresses = useMemo(() => {
    return userData?.addresses?.filter((addr) => addr[type]) || [];
  }, [userData, type]);

  const handleSelectAddress = (selectedAddress: Address) => {
    setOrder((prevOrder) => {
      const newAddressForOrder = {
        firstname: selectedAddress.firstname,
        lastname: selectedAddress.lastname,
        company: selectedAddress.company,
        address1: selectedAddress.address1,
        address2: selectedAddress.address2,
        city: selectedAddress.city,
        postalCode: selectedAddress.postalCode,
        country: selectedAddress.country,
        province: "",
        phone: selectedAddress.phone,
        email: selectedAddress.email,
        "order-notes": type === "shipping" ? prevOrder.shippingAddress["order-notes"] : "",
      };

      return {
        ...prevOrder,
        [type === "shipping" ? "shippingAddress" : "billingAddress"]: newAddressForOrder,
      };
    });
  };

  if (!userData || availableAddresses.length === 0) {
    return null;
  }

  const currentOrderAddress = type === "shipping" ? order.shippingAddress : order.billingAddress;

  return (
    <section aria-labelledby={`${type}-address-selector-heading`} className={twMerge(subtleSectionWrapperClassname, "!mt-0 !mb-6")}>
      <h3 id={`${type}-address-selector-heading`} className="text-base font-medium text-gray-800 mb-3">
        {t(type === "shipping" ? "shippingTitle" : "billingTitle")}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {availableAddresses.map((address) => {
          const isSelected =
            currentOrderAddress.firstname === address.firstname &&
            currentOrderAddress.lastname === address.lastname &&
            currentOrderAddress.address1 === address.address1 &&
            currentOrderAddress.postalCode === address.postalCode;

          return <AddressCard key={address.id} address={address} isSelected={isSelected} onSelect={() => handleSelectAddress(address)} />;
        })}
      </div>
    </section>
  );
}
