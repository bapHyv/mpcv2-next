"use client";
import { useState, FormEvent, useEffect } from "react";
import { useAuth } from "@/app/context/authContext";
import axios from "axios";

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
      const response = await axios.post(
        "https://api.monplancbd.fr/user/addresses/add",
        address,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

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
      const response = await axios.delete(
        `https://api.monplancbd.fr/user/addresses/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

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
      const response = await axios.put(
        `https://api.monplancbd.fr/user/addresses/${updatedAddress.id}`,
        updatedAddress,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Address updated successfully");
        // Update local state
        const updatedAddresses = addresses.map((address) =>
          address.id === updatedAddress.id ? updatedAddress : address
        );
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
      <ul role="list">
        {addresses.length > 0 && <p className="text-teal-600 items-center text-center font-medium text-lg mt-8">My addresses</p>}
        {addresses.map((address: any) => (
          <div className="px-12 mt-4 mb-4">
          <li key={address.id} className="py-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-semibold text-teal-600">{address.address1}</h3>
                <p className="text-sm text-gray-600">{`${address.country}, ${address.city} ${address.postalCode}`}</p>
              </div>
              <div className="text-sm text-gray-500 flex gap-4">
                <button
                  className="text-teal-600 hover:text-teal-800"
                  onClick={() => {
                    setEditingAddress(address);
                    setIsModalOpen(true);
                  }}
                >
                  Modify
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleDelete(address.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        </div>
        
        ))}

        {isModalOpen && editingAddress && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setIsModalOpen(false)} // Close modal on background click
          >
            <div
              className="bg-white rounded-lg p-6 shadow-lg max-w-lg w-full relative"
              onClick={(e) => e.stopPropagation()} // Prevent background click from closing modal
            >
              <h2 className="text-lg font-semibold mb-4">Modify Address</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateAddress(editingAddress);
                }}
              >
                <div className="grid grid-cols-1 gap-y-4">
                  {/* Firstname */}
                  <div>
                    <label
                      htmlFor="firstname"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Firstname
                    </label>
                    <input
                      type="text"
                      id="firstname"
                      name="firstname"
                      value={editingAddress.firstname}
                      onChange={(e) =>
                        setEditingAddress((prev) => ({ ...prev!, firstname: e.target.value }))
                      }
                      placeholder="Firstname"
                      className="block w-full border border-gray-300 rounded px-3 py-2  focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>

                  {/* Lastname */}
                  <div>
                    <label
                      htmlFor="lastname"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Lastname
                    </label>
                    <input
                      type="text"
                      id="lastname"
                      name="lastname"
                      value={editingAddress.lastname}
                      onChange={(e) =>
                        setEditingAddress((prev) => ({ ...prev!, lastname: e.target.value }))
                      }
                      placeholder="Lastname"
                      className="block w-full border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>

                  {/* Address Line 1 */}
                  <div>
                    <label
                      htmlFor="address1"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      id="address1"
                      name="address1"
                      value={editingAddress.address1}
                      onChange={(e) =>
                        setEditingAddress((prev) => ({ ...prev!, address1: e.target.value }))
                      }
                      placeholder="Address Line 1"
                      className="block w-full border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>

                  {/* Address Line 2 */}
                  <div>
                    <label
                      htmlFor="address2"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      id="address2"
                      name="address2"
                      value={editingAddress.address2 || ""}
                      onChange={(e) =>
                        setEditingAddress((prev) => ({ ...prev!, address2: e.target.value }))
                      }
                      placeholder="Address Line 2"
                      className="block w-full border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={editingAddress.city}
                      onChange={(e) =>
                        setEditingAddress((prev) => ({ ...prev!, city: e.target.value }))
                      }
                      placeholder="City"
                      className="block w-full border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label
                      htmlFor="postalCode"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Postal Code
                    </label>
                    <input
                      type="number"
                      id="postalCode"
                      name="postalCode"
                      value={editingAddress.postalCode}
                      onChange={(e) =>
                        setEditingAddress((prev) => ({ ...prev!, postalCode: e.target.value }))
                      }
                      placeholder="Postal Code"
                      className="block w-full border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={editingAddress.country}
                      onChange={(e) =>
                        setEditingAddress((prev) => ({ ...prev!, country: e.target.value }))
                      }
                      placeholder="Country"
                      className="block w-full border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone (Optional)
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={editingAddress.phone || ""}
                      onChange={(e) =>
                        setEditingAddress((prev) => ({ ...prev!, phone: e.target.value }))
                      }
                      placeholder="Phone"
                      className="block w-full border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>

                  {/* Address Type */}
                  <div>
                    <label
                      htmlFor="addressType"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address Type
                    </label>
                    <select
                      id="addressType"
                      name="addressType"
                      value={
                        editingAddress.billing && editingAddress.shipping
                          ? "both"
                          : editingAddress.billing
                          ? "billing"
                          : "shipping"
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        setEditingAddress((prev) => ({
                          ...prev!,
                          billing: value === "billing" || value === "both",
                          shipping: value === "shipping" || value === "both",
                        }));
                      }}
                      className="block w-full border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
                    >
                      <option value="billing">Billing</option>
                      <option value="shipping">Shipping</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                  <button
                    type="button"
                    className="text-gray-700"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </ul>
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg"
      >
        <div className="space-y-12">
          <div className="grid grid-cols-1 gap-y-10 gap-x-8 border-b border-gray-300 pb-12 md:grid-cols-3">
            <div className="grid max-w-2xl grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6 md:col-span-2">
              {/* Firstname */}
              <div className="sm:col-span-3">
                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                  Firstname
                </label>
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
              </div>

              {/* Lastname */}
              <div className="sm:col-span-3">
                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                  Lastname
                </label>
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
              </div>

              {/* Country Selector */}
              <div className="sm:col-span-3">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                >
                  <option>France</option>
                  <option>Belgium</option>
                </select>
              </div>

              {/* Street Address */}
              <div className="col-span-full">
                <label htmlFor="address1" className="block text-sm font-medium text-gray-700">
                  Street Address
                </label>
                <input
                  id="address1"
                  name="address1"
                  type="text"
                  value={formData.address1}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
              </div>

              {/* Address Line 2 */}
              <div className="col-span-full">
                <label htmlFor="address2" className="block text-sm font-medium text-gray-700">
                  Address Line 2 (Optional)
                </label>
                <input
                  id="address2"
                  name="address2"
                  type="text"
                  value={formData.address2 || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
              </div>

              {/* City */}
              <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
              </div>

              {/* Postal Code */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="postalCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  ZIP / Postal Code
                </label>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
              </div>

              {/* Phone */}
              <div className="sm:col-span-3">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
              </div>

              {/* Email */}
              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
              </div>

              {/* Billing Checkbox */}
              <div className="sm:col-span-3 flex items-center gap-x-2">
                <input
                  id="billing"
                  name="billing"
                  type="checkbox"
                  checked={formData.billing}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="billing" className="text-sm font-medium text-gray-700">
                  Use as billing address
                </label>
              </div>

              {/* Shipping Checkbox */}
              <div className="sm:col-span-3 flex items-center gap-x-2">
                <input
                  id="shipping"
                  name="shipping"
                  type="checkbox"
                  checked={formData.shipping}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="shipping" className="text-sm font-medium text-gray-700">
                  Use as shipping address
                </label>
              </div>
            </div>
          </div>

          {/* Form Buttons */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="submit"
              className="rounded-md bg-teal-600 px-4 py-2 text-sm text-white hover:bg-teal-500 focus:ring-2 focus:ring-teal-500"
            >
              Add a new address
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
