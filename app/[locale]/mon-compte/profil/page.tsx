"use client";

import { useState, useEffect, FormEvent } from "react";
import { useFormState } from "react-dom";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuid } from "uuid";

import { useAuth } from "@/app/context/authContext";
import { update } from "@/app/actions";
import SubmitButton from "@/app/components/SubmitButton";
import { useAlerts } from "@/app/context/alertsContext";
import { UserDataAPIResponse } from "@/app/types/profileTypes";
import { isUserDataAPIResponse } from "@/app/utils/typeGuardsFunctions";

const initialState = {
  firstname: "",
  lastname: "",
  displayName: "",
  email: "",
  oldPassword: "",
  newPassword: "",
  optInMarketing: 0,
};

export default function Profile() {
  const [inputType, setInputType] = useState<"password" | "text">("password");
  const [isUpdating, setIsUpdating] = useState(false);
  const [doesPasswordsMatch, setDoesPasswordMatch] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    optInMarketing: 0,
  });

  // @ts-ignore
  const [state, formAction, isPending] = useFormState(update, initialState);
  const t = useTranslations("profile");
  const { userData, setUserData } = useAuth();
  const { addAlert } = useAlerts();
  const router = useRouter();

  useEffect(() => {
    if (userData) {
      setFormData((prevForm) => ({
        ...prevForm,
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.mail,
        optInMarketing: userData.optInMarketing,
      }));
    }
  }, [userData]);

  useEffect(() => {
    if (state.isSuccess && isUserDataAPIResponse(state.data) && state.data && state.statusCode === 200) {
      setIsUpdating(false);
      setUserData(state.data);
      addAlert(uuid(), "You have successfully updated your infos", "Update successful", "emerald");
    } else if (!state.isSuccess && !state.data) {
      switch (state.statusCode) {
        case 400:
          addAlert(uuid(), "One of the infos you've provided is missing", "Warning", "yellow");
          break;
        case 422:
          addAlert(uuid(), "There is a semantic error in the infos you've provided", "Warning", "yellow");
          break;
        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    if ((newPassword === "" && confirmNewPassword === "") || newPassword === confirmNewPassword) {
      setDoesPasswordMatch(true);
    } else {
      setDoesPasswordMatch(false);
    }
  }, [newPassword, confirmNewPassword]);

  const handleChangeForm = (e: FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, type, value, checked } = target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <section className="bg-white py-8 px-5">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        {/* Form */}
        <h2 className="text-green text-xl font-bold mb-4">{t("title")}</h2>
        <form className="" action={formAction} onChange={handleChangeForm}>
          {/* Personal Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label htmlFor="firstname" className="block text-sm font-bold">
                {t("form.firstName")}
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                required
                defaultValue={formData.firstname}
                disabled={!userData || !isUpdating}
                className={twMerge(
                  clsx(
                    "mt-1 block w-full border-0 rounded-md ring-1 ring-inset ring-gray-300",
                    "focus:ring-2 focus:ring-inset focus:ring-light-green",
                    "disabled:bg-neutral-200"
                  )
                )}
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastname" className="block text-sm font-bold">
                {t("form.lastName")}
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                required
                defaultValue={formData.lastname}
                disabled={!userData || !isUpdating}
                className={twMerge(
                  clsx(
                    "mt-1 block w-full border-0 rounded-md ring-1 ring-inset ring-gray-300",
                    "focus:ring-2 focus:ring-inset focus:ring-light-green",
                    "disabled:bg-neutral-200"
                  )
                )}
              />
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-sm font-bold">
                {t("form.email")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                defaultValue={formData.email}
                disabled={!userData || !isUpdating}
                className={twMerge(
                  clsx(
                    "mt-1 block w-full border-0 rounded-md ring-1 ring-inset ring-gray-300",
                    "focus:ring-2 focus:ring-inset focus:ring-light-green",
                    "disabled:bg-neutral-200"
                  )
                )}
              />
            </div>
          </div>

          {/* Passwords Section */}
          <div>
            <h3 className="text-green text-lg font-bold mb-4 mt-8">Password</h3>
            <fieldset className="space-y-6">
              <div className="md:col-span-2">
                <label htmlFor="oldPassword" className="block text-sm font-bold">
                  Current password
                </label>
                <div className="relative">
                  <input
                    type={inputType}
                    id="oldPassword"
                    name="oldPassword"
                    disabled={!userData || !isUpdating}
                    className={twMerge(
                      clsx(
                        "mt-1 block w-full border-0 rounded-md ring-1 ring-inset ring-gray-300",
                        "focus:ring-2 focus:ring-inset focus:ring-light-green",
                        "disabled:bg-neutral-200"
                      )
                    )}
                  />
                  <div className="absolute h-full top-0 right-2 flex items-center">
                    {inputType === "password" ? (
                      <EyeIcon className="w-6 h-6 text-neutral-700 cursor-pointer" onClick={() => setInputType("text")} />
                    ) : (
                      <EyeSlashIcon className="w-6 h-6 text-neutral-700 cursor-pointer" onClick={() => setInputType("password")} />
                    )}
                  </div>
                </div>
                <span className="text-sm italic text-neutral-500">
                  If you want to change your password, fill up the &quot;Current password&quot; field.
                </span>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="newPassword" className="block text-sm font-bold">
                  New password
                </label>
                <div className="relative">
                  <input
                    type={inputType}
                    id="newPassword"
                    name="newPassword"
                    required={!!formData.oldPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={!userData || !isUpdating}
                    className={twMerge(
                      clsx(
                        "mt-1 block w-full border-0 rounded-md ring-1 ring-inset ring-gray-300",
                        "focus:ring-2 focus:ring-inset focus:ring-light-green",
                        "disabled:bg-neutral-200"
                      )
                    )}
                  />
                  <div className="absolute h-full top-0 right-2 flex items-center">
                    {inputType === "password" ? (
                      <EyeIcon className="w-6 h-6 text-neutral-700 cursor-pointer" onClick={() => setInputType("text")} />
                    ) : (
                      <EyeSlashIcon className="w-6 h-6 text-neutral-700 cursor-pointer" onClick={() => setInputType("password")} />
                    )}
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="confirmNewPassword" className={twMerge(clsx("block text-sm font-bold", { "text-red-600": !doesPasswordsMatch }))}>
                  Confirm new password
                </label>
                <div className="relative">
                  <input
                    type={inputType}
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    required={!!formData.oldPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    disabled={!userData || !isUpdating}
                    className={twMerge(
                      clsx(
                        "mt-1 block w-full border-0 rounded-md ring-1 ring-inset ring-gray-300",
                        "focus:ring-2 focus:ring-inset focus:ring-light-green",
                        "disabled:bg-neutral-200",
                        { "ring-red-600 focus:ring-red-600": !doesPasswordsMatch }
                      )
                    )}
                  />
                  <div className="absolute h-full top-0 right-2 flex items-center">
                    {inputType === "password" ? (
                      <EyeIcon className="w-6 h-6 text-neutral-700 cursor-pointer" onClick={() => setInputType("text")} />
                    ) : (
                      <EyeSlashIcon className="w-6 h-6 text-neutral-700 cursor-pointer" onClick={() => setInputType("password")} />
                    )}
                  </div>
                </div>
                {!doesPasswordsMatch ? (
                  <p id="passwords-dont-match" role="alert" aria-live="polite" className="text-red-600 text-xs text-right">
                    Password must match
                  </p>
                ) : null}
              </div>
            </fieldset>
          </div>

          {/* Communication Preferences Section */}
          <div>
            <h3 className="text-green text-lg font-bold mb-4 mt-8">{t("form.communicationPreferences.label")}</h3>
            <fieldset className="space-y-4">
              <label className="flex items-start space-x-3 cursor-pointer w-full md:w-1/2">
                <input
                  type="checkbox"
                  name="optInMarketing"
                  value="optInMarketing"
                  defaultChecked={!!formData.optInMarketing}
                  className="mt-1 focus:ring-green"
                />
                <span>
                  {t("form.communicationPreferences.promotions.label")}
                  <p className="text-sm text-gray-500">{t("form.communicationPreferences.promotions.hint")}</p>
                </span>
              </label>
            </fieldset>
          </div>

          {/* Submit Buttons Section */}
          <div className="md:flex md:justify-end">
            <div className="mt-10 w-full md:w-1/4 flex gap-x-2">
              {isUpdating ? (
                <>
                  <SubmitButton text="Save" isDisabled={!doesPasswordsMatch} />
                  <button
                    onClick={() => setIsUpdating(false)}
                    className={clsx(
                      "flex w-full justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:ring-1",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500",
                      "disabled:bg-neutral-400 disabled:cursor-not-allowed"
                    )}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsUpdating(true)}
                  className={clsx(
                    "flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:ring-1",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
                    "disabled:bg-neutral-400 disabled:cursor-not-allowed"
                  )}
                >
                  Update your infos
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
