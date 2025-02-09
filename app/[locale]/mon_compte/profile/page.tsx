"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/authContext";
import { UpdatedUserData, UserData } from "@/app/types/profileTypes";
import { useTranslations } from "next-intl";




export default function Profile() {
  const t = useTranslations("profile");

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
    <section className="bg-white py-10 px-5">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-bold mb-6 text-green">{t("title")}</h2>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Personal Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <fieldset className="col-span-1 md:col-span-2">
              <legend className="text-sm font-bold mb-4 text-green">
                {t("form.titleSection.label")}
              </legend>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="title"
                    value="Madame"
                    className="text-green focus:ring-green"
                  />
                  <span>{t("form.titleSection.options.madame")}</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="title"
                    value="Monsieur"
                    className="text-green focus:ring-green"
                  />
                  <span>{t("form.titleSection.options.monsieur")}</span>
                </label>
              </div>
            </fieldset>
  
            {/* First Name */}
            <div>
              <label htmlFor="firstname" className="block text-sm font-bold text-green">
                {t("form.firstName")}
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                onChange={handleChange}
                value={formData.firstname}
                className="mt-1 block w-full border border-grey-200 rounded-md shadow-sm focus:ring-green focus:border-green"
              />
            </div>
  
            {/* Last Name */}
            <div>
              <label htmlFor="lastname" className="block text-sm font-bold text-green">
                {t("form.lastName")}
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="mt-1 block w-full border border-grey-200 rounded-md shadow-sm focus:ring-green focus:border-green"
              />
            </div>
  
            {/* Display Name */}
            <div className="md:col-span-2">
              <label htmlFor="displayName" className="block text-sm font-bold text-green">
                {t("form.displayName")}
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.display_name}
                onChange={handleChange}
                className="mt-1 block w-full border border-grey-200 rounded-md shadow-sm focus:ring-green focus:border-green"
              />
              <p className="mt-1 text-sm text-gray-500">
                {t("form.displayNameHint")}
              </p>
            </div>
  
            {/* Email */}
            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-sm font-bold text-green">
                {t("form.email")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.mail}
                onChange={handleChange}
                className="mt-1 block w-full border border-grey-200 rounded-md shadow-sm focus:ring-green focus:border-green"
              />
            </div>
          </div>
  
          {/* Communication Preferences */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-green">
              {t("form.communicationPreferences.label")}
            </h3>
            <fieldset className="space-y-4">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="preferences"
                  value="promotions"
                  className="mt-1 text-green focus:ring-green"
                />
                <span>
                  {t("form.communicationPreferences.promotions.label")}
                  <p className="text-sm text-gray-500">
                    {t("form.communicationPreferences.promotions.hint")}
                  </p>
                </span>
              </label>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="preferences"
                  value="orders"
                  className="mt-1 text-green focus:ring-green"
                />
                <span>
                  {t("form.communicationPreferences.orders.label")}
                  <p className="text-sm text-gray-500">
                    {t("form.communicationPreferences.orders.hint")}
                  </p>
                </span>
              </label>
            </fieldset>
          </div>
  
          {/* Submit Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-green text-white px-6 py-3 rounded-lg hover:bg-teal-700"
            >
              {t("form.saveButton")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
