"use client";
import { useState, FormEvent, useEffect } from "react";
import { useAuth } from "@/app/context/authContext";
import axios from "axios";
import { useTranslations } from "next-intl";

interface AddressPayload {
  id?: number;
  firstname: string;
  lastname: string;
  address1: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  billing: boolean;
  shipping: boolean;
  company?: string;
  address2?: string;
}

export default function Addresses() {
  const t = useTranslations("addresses");

  const { userData, loading }: any = useAuth();
  const [editingAddress, setEditingAddress] = useState<AddressPayload | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State to hold addresses
  const [addresses, setAddresses] = useState<any[]>(() => {
    const storedUserData = localStorage.getItem("userData");
    const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
    return parsedUserData?.addresses || [];
  });

  // State to hold form values
  const [formData, setFormData] = useState<AddressPayload>({
    firstname: "",
    lastname: "",
    address1: "",
    postalCode: "",
    city: "",
    country: "France",
    phone: "",
    email: "",
    billing: true,
    shipping: true,
    company: "",
    address2: "",
  });

  // Handles form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const isChecked = target.checked;
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? isChecked : value,
    }));
  };

  // Function to add address
  const addAddress = async (address: AddressPayload): Promise<void> => {
    try {
      const response = await axios.post("https://api.monplancbd.fr/user/addresses/add", address, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.data) {
        alert("Address added successfully");

        // Add the new address to local state and local storage
        const newAddress = response.data; // Assuming API response contains the added address
        const updatedAddresses = [...addresses, newAddress];
        setAddresses(updatedAddresses);

        // Update local storage
        const storedUserData = localStorage.getItem("userData");
        const parsedUserData = storedUserData ? JSON.parse(storedUserData) : {};
        parsedUserData.addresses = updatedAddresses;
        localStorage.setItem("userData", JSON.stringify(parsedUserData));
      }
    } catch (err: any) {
      console.error("Failed to add address:", err);
      alert(`Failed to add address: ${err.response.data}`);
    }
  };

  // Handles form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await addAddress(formData);
  };

  const handleDelete = async (addressId: number) => {
    try {
      const response = await axios.delete(`https://api.monplancbd.fr/user/addresses/${addressId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.status === 200) {
        alert(`Address deleted successfully`);

        // Remove the deleted address from local state and local storage
        const updatedAddresses = addresses.filter((address: any) => address.id !== addressId);
        setAddresses(updatedAddresses);

        // Update local storage
        const storedUserData = localStorage.getItem("userData");
        const parsedUserData = storedUserData ? JSON.parse(storedUserData) : {};
        parsedUserData.addresses = updatedAddresses;
        localStorage.setItem("userData", JSON.stringify(parsedUserData));
      }
    } catch (error) {
      console.error(`Failed to delete address with ID ${addressId}:`, error);
    }
  };

  const handleUpdateAddress = async (updatedAddress: AddressPayload) => {
    try {
      const response = await axios.put(`https://api.monplancbd.fr/user/addresses/${updatedAddress.id}`, updatedAddress, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.status === 200) {
        alert("Address updated successfully");
        // Update local state
        const updatedAddresses = addresses.map((address) => (address.id === updatedAddress.id ? updatedAddress : address));
        setAddresses(updatedAddresses);
        // Update local storage
        const storedUserData = localStorage.getItem("userData");
        const parsedUserData = storedUserData ? JSON.parse(storedUserData) : {};
        parsedUserData.addresses = updatedAddresses;
        localStorage.setItem("userData", JSON.stringify(parsedUserData));
        // Close modal
        setIsModalOpen(false);
      }
    } catch (error: any) {
      console.error("Failed to update address:", error.response.data);
      alert(`Failed to update address : ${error.response.data}`);
    }
  };

  return (
    <>
      <ul role="list" className="max-w-4xl mx-auto p-6">
        {addresses.length > 0 && <p className="text-green text-center font-medium text-2xl mt-8 mb-6">{t("title")}</p>}
        {addresses.map((address: any, i) => (
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
                <button className="text-red-600 hover:text-red-800 font-medium" onClick={() => handleDelete(address.id)}>
                  {t("modal.delete")}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for Editing Address */}
      {isModalOpen && editingAddress && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setIsModalOpen(false)} // Close modal on background click
        >
          <div
            className="bg-white rounded-lg p-6 md:p-8 shadow-lg w-11/12 md:max-w-lg mx-auto relative transform transition-all duration-300 ease-in-out overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()} // Prevent background click from closing modal
          >
            <h2 className="text-2xl font-semibold mb-6 text-green">{t("modal.title")}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateAddress(editingAddress);
              }}
            >
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
      )}

      {/* Form for Adding New Address */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <div className="space-y-12">
          <div className="grid grid-cols-1 gap-y-10 gap-x-8 border-b border-gray-300 pb-12 md:grid-cols-3">
            <div className="grid max-w-2xl grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6 md:col-span-2">
              {/* Firstname */}
              <div className="sm:col-span-3">
                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                  {t("firstName")}
                </label>
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  required
                  value={formData.firstname}
                  onChange={handleChange}
                  className=" block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
                />
              </div>

              {/* Lastname */}
              <div className="sm:col-span-3">
                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                  {t("lastName")}
                </label>
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  required
                  value={formData.lastname}
                  onChange={handleChange}
                  className=" block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
                />
              </div>

              {/* Country Selector */}
              <div className="sm:col-span-3">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  {t("country")}
                </label>
                <select
                  id="country"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className=" block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
                >
                  <option>France</option>
                  <option>Belgium</option>
                </select>
              </div>

              {/* Street Address */}
              <div className="col-span-full">
                <label htmlFor="address1" className="block text-sm font-medium text-gray-700">
                  {t("address1")}
                </label>
                <input
                  id="address1"
                  name="address1"
                  type="text"
                  required
                  value={formData.address1}
                  onChange={handleChange}
                  className=" block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
                />
              </div>

              {/* Address Line 2 */}
              <div className="col-span-full">
                <label htmlFor="address2" className="block text-sm font-medium text-gray-700">
                  {t("address2")}
                </label>
                <input
                  id="address2"
                  name="address2"
                  type="text"
                  value={formData.address2 || ""}
                  onChange={handleChange}
                  className=" block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
                />
              </div>

              {/* City */}
              <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  {t("city")}
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  required
                  onChange={handleChange}
                  className=" block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
                />
              </div>

              {/* Postal Code */}
              <div className="sm:col-span-2">
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  {t("postalCode")}
                </label>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                  className=" block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
                />
              </div>

              {/* Phone */}
              <div className="sm:col-span-3">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  {t("phone")}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className=" block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
                />
              </div>

              {/* Email */}
              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t("email")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className=" block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green focus:ring-green sm:text-sm"
                />
              </div>

              {/* Billing Checkbox */}
              <div className="sm:col-span-3 flex items-center gap-x-2">
                <input
                  id="billing"
                  name="billing"
                  type="checkbox"
                  defaultChecked={true}
                  checked={formData.billing}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-green focus:ring-green"
                />
                <label htmlFor="billing" className="text-sm font-medium text-gray-700">
                  {t("billing")}
                </label>
              </div>

              {/* Shipping Checkbox */}
              <div className="sm:col-span-3 flex items-center gap-x-2">
                <input
                  id="shipping"
                  name="shipping"
                  type="checkbox"
                  defaultChecked={true}
                  checked={formData.shipping}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-green focus:ring-green"
                />
                <label htmlFor="shipping" className="text-sm font-medium text-gray-700">
                  {t("shipping")}
                </label>
              </div>
            </div>
          </div>

          {/* Form Buttons */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="submit"
              className="rounded-md bg-green px-6 py-2 text-sm text-white hover:bg-teal-700 focus:ring-2 focus:ring-green transition-colors"
            >
              {t("addAddress")}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
