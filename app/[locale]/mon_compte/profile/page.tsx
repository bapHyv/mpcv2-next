"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/authContext";
import { UpdatedUserData, UserData } from "@/app/types/profileTypes";

export default function Profile() {
  const { userData, updateUser, loading } = useAuth();
  const [formData, setFormData] = useState<UserData>({
    mail: "",
    firstname: "",
    lastname: "",
    optInMarketing: false,
    oldPassword: "",
    newPassword: "",
  });

  // Update formData when userData is available
  useEffect(() => {
    if (userData) {
      setFormData({
        mail: userData.mail || "",
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        display_name: userData.display_name || "",
        optInMarketing: userData.optInMarketing || false,
        oldPassword: "",
        newPassword: "",
      });
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const isChecked = target.checked; // Handle checkbox
    const { name, value, type } = target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? isChecked : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: UserData = { ...formData };
    if (!payload.oldPassword) delete payload.oldPassword;
    if (!payload.newPassword) delete payload.newPassword;
    await updateUser(payload);
  };

  if (loading) {
    return <div className="text-center py-10 text-lg font-semibold">Loading...</div>;
  }

  return (
    // <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 space-y-8">
    //   <div className="space-y-6">
    //     <div className="flex justify-between items-center">
    //       <h2 className="text-2xl font-semibold text-gray-900">Edit Profile</h2>
    //       <p className="text-sm text-gray-500">Manage your personal information</p>
    //     </div>

    //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    //       <div>
    //         <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">First Name</label>
    //         <input
    //           id="firstname"
    //           name="firstname"
    //           type="text"
    //           value={formData.firstname}
    //           onChange={handleChange}
    //           className="mt-2 block w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    //         />
    //       </div>

    //       <div>
    //         <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Last Name</label>
    //         <input
    //           id="lastname"
    //           name="lastname"
    //           type="text"
    //           value={formData.lastname}
    //           onChange={handleChange}
    //           className="mt-2 block w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    //         />
    //       </div>
    //     </div>

    //     <div>
    //       <label htmlFor="mail" className="block text-sm font-medium text-gray-700">Email Address</label>
    //       <input
    //         id="mail"
    //         name="mail"
    //         type="email"
    //         value={formData.mail}
    //         onChange={handleChange}
    //         className="mt-2 block w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    //       />
    //     </div>

    //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    //       <div>
    //         <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
    //         <input
    //           id="oldPassword"
    //           name="oldPassword"
    //           type="password"
    //           value={formData.oldPassword}
    //           onChange={handleChange}
    //           className="mt-2 block w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    //         />
    //       </div>

    //       <div>
    //         <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
    //         <input
    //           id="newPassword"
    //           name="newPassword"
    //           type="password"
    //           value={formData.newPassword}
    //           onChange={handleChange}
    //           className="mt-2 block w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    //         />
    //       </div>
    //     </div>

    //     <div className="flex justify-end items-center">
    //       <button
    //         type="submit"
    //         className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
    //       >
    //         Save Changes
    //       </button>
    //     </div>
    //   </div>
    // </form>
    <section className="bg-white py-10 px-5">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-bold mb-6 text-teal-600">Informations personnelles</h2>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-10">
          {/*  Personal Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <fieldset className="col-span-1 md:col-span-2">
              <legend className="text-sm font-bold mb-4 text-teal-600">Titre</legend>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 ">
                  <input
                    type="radio"
                    name="title"
                    value="Madame"
                    className="text-teal-600 focus:ring-teal-600"
                  />
                  <span>Madame</span>
                </label>
                <label className="flex items-center space-x-2 ">
                  <input
                    type="radio"
                    name="title"
                    value="Monsieur"
                    className="text-teal-600 focus:ring-teal-600"
                  />
                  <span>Monsieur</span>
                </label>
              </div>
            </fieldset>

            {/* First Name */}
            <div>
              <label htmlFor="firstname" className="block text-sm font-bold text-teal-600">
                Prénom
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                onChange={handleChange}
                value={formData.firstname}
                className="mt-1 block w-full border border-grey-200 rounded-md shadow-sm focus:ring-teal-600 focus:border-teal-600"
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastname" className="block text-sm font-bold text-teal-600">
                Nom
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="mt-1 block w-full border border-grey-200 rounded-md shadow-sm focus:ring-teal-600 focus:border-teal-600"
              />
            </div>

            {/* Display Name */}
            <div className="md:col-span-2">
              <label htmlFor="displayName" className="block text-sm font-bold text-teal-600">
                Nom affiché
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.display_name}
                onChange={handleChange}
                className="mt-1 block w-full border border-grey-200 rounded-md shadow-sm focus:ring-teal-600 focus:border-teal-600"
              />
              <p className="mt-1 text-sm text-gray-500">
                Indique comment votre nom apparaîtra dans la section relative au compte et dans
                les avis
              </p>
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-sm font-bold text-teal-600">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.mail}
                onChange={handleChange}
                className="mt-1 block w-full border border-grey-200 rounded-md shadow-sm focus:ring-teal-600 focus:border-teal-600"
              />
            </div>
          </div>

          {/* Password Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-teal-600">Mon mot de passe</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Password */}
              <div className="md:col-span-2">
                <label htmlFor="currentPassword" className="block text-sm font-bold text-teal-600">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-grey-200 rounded-md shadow-sm focus:ring-teal-600 focus:border-teal-600 bg-white"
                />
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-bold text-teal-600">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-grey-200 rounded-md shadow-sm focus:ring-teal-600 focus:border-teal-600"
                />
              </div>

              {/* Confirm New Password */}
              {/* <div>
                <label htmlFor="confirmPassword" className="block text-sm font-bold">Confirmer le mot de passe</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="mt-1 block w-full border border-grey-200 rounded-md shadow-sm focus:ring-teal-600 focus:border-teal-600"
                />
              </div> */}
            </div>
          </div>

          {/* Communication Preferences */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-teal-600">Mes options</h3>
            <fieldset className="space-y-4">
              <label className="flex items-start space-x-3">
                <input
                  type="radio"
                  name="preferences"
                  value="promotions"
                  className="mt-1 text-teal-600 focus:ring-teal-600"
                />
                <span>
                  Mises à jour sur les produits et les promotions
                  <p className="text-sm text-gray-500">
                    Recevez des communications marketing qui, selon nous, vous intéresseront.
                  </p>
                </span>
              </label>
              <label className="flex items-start space-x-3">
                <input
                  type="radio"
                  name="preferences"
                  value="orders"
                  className="mt-1 text-teal-600 focus:ring-teal-600"
                />
                <span>
                  Informations sur le compte et les commandes
                  <p className="text-sm text-gray-500">
                    Recevez des informations importantes au sujet de vos commandes et de votre
                    compte.
                  </p>
                </span>
              </label>
            </fieldset>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
