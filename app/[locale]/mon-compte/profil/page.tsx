"use client";

import { useState, useEffect, FormEvent } from "react";
import { useFormState } from "react-dom";
import { useTranslations } from "next-intl";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuid } from "uuid";

import { useAuth } from "@/app/context/authContext";
import SubmitButton from "@/app/components/SubmitButton";
import { useAlerts } from "@/app/context/alertsContext";
import { isUserDataAPIResponse } from "@/app/utils/typeGuardsFunctions";
import { update } from "@/app/actions";

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

  const t = useTranslations();
  // @ts-ignore
  const [state, formAction] = useFormState(update, initialState);
  const { userData, setUserData } = useAuth();
  const { addAlert } = useAlerts();

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
      setUserData((prevState) => {
        if (prevState) {
          return Object.assign(prevState, state.data);
        } else {
          return null;
        }
      });
      addAlert(uuid(), t("alerts.profile.infos.200.text"), t("alerts.profile.infos.200.title"), "emerald");
    } else if (!state.isSuccess && !state.data) {
      switch (state.statusCode) {
        case 400:
          addAlert(uuid(), t("alerts.profile.infos.400.text"), t("alerts.profile.infos.400.title"), "yellow");
          break;
        case 422:
          addAlert(uuid(), t("alerts.profile.infos.422.text"), t("alerts.profile.infos.422.title"), "yellow");
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
    <section>
      <h2 className="text-green text-center font-medium text-2xl my-4">{t("profile.title")}</h2>
      <div className="bg-white px-5">
        {/* Header */}
        <div className="max-w-5xl mx-auto">
          {/* Form */}
          <form className="" action={formAction} onChange={handleChangeForm}>
            {/* Personal Information Section */}
            <fieldset className="space-y-1">
              {/* First Name */}
              <div>
                <label htmlFor="firstname" className="block text-sm font-bold">
                  {t("profile.form.firstName")}
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
                      "block w-full border-0 rounded-md ring-1 ring-inset ring-gray-300",
                      "focus:ring-2 focus:ring-inset focus:ring-light-green",
                      "disabled:bg-neutral-200"
                    )
                  )}
                />
              </div>
              {/* Last Name */}
              <div>
                <label htmlFor="lastname" className="block text-sm font-bold">
                  {t("profile.form.lastName")}
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
                      "block w-full border-0 rounded-md ring-1 ring-inset ring-gray-300",
                      "focus:ring-2 focus:ring-inset focus:ring-light-green",
                      "disabled:bg-neutral-200"
                    )
                  )}
                />
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-bold">
                  {t("profile.form.email")}
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
                      "block w-full border-0 rounded-md ring-1 ring-inset ring-gray-300",
                      "focus:ring-2 focus:ring-inset focus:ring-light-green",
                      "disabled:bg-neutral-200"
                    )
                  )}
                />
              </div>
            </fieldset>

            {/* Passwords Section */}
            <>
              <h2 className="text-green text-lg font-bold mb-2 mt-8">{t("profile.form.password")}</h2>
              <fieldset className="space-y-1">
                <div className="md:col-span-2">
                  <label htmlFor="oldPassword" className="block text-sm font-bold">
                    {t("profile.form.currentPassword")}
                  </label>
                  <div className="relative">
                    <input
                      type={inputType}
                      id="oldPassword"
                      name="oldPassword"
                      disabled={!userData || !isUpdating}
                      className={twMerge(
                        clsx(
                          "block w-full border-0 rounded-md ring-1 ring-inset ring-gray-300",
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
                  <span className="text-xs italic text-neutral-500">{t("profile.form.currentPasswordMessage")}</span>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="newPassword" className="block text-sm font-bold">
                    {t("profile.form.newPassword")}
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
                          "block w-full border-0 rounded-md ring-1 ring-inset ring-gray-300",
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
                    {t("profile.form.confirmNewPassword")}
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
                          "block w-full border-0 rounded-md ring-1 ring-inset ring-gray-300",
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
            </>

            {/* Communication Preferences Section */}
            <div>
              <h3 className="text-green text-lg font-bold mb-4 mt-8">{t("profile.form.communicationPreferences.label")}</h3>
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
                    {t("profile.form.communicationPreferences.promotions.label")}
                    <p className="text-sm text-gray-500">{t("profile.form.communicationPreferences.promotions.hint")}</p>
                  </span>
                </label>
              </fieldset>
            </div>

            {/* Submit Buttons Section */}
            <div className="md:flex md:justify-end">
              <div className="mt-10 w-full md:w-1/4 flex gap-x-2">
                {isUpdating ? (
                  <>
                    <SubmitButton text={t("profile.form.saveButton")} isDisabled={!doesPasswordsMatch} />
                    <button
                      onClick={() => setIsUpdating(false)}
                      className={clsx(
                        "flex w-full justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:ring-1",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500",
                        "disabled:bg-neutral-400 disabled:cursor-not-allowed"
                      )}
                    >
                      {t("profile.form.cancel")}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsUpdating(true);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={clsx(
                      "flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:ring-1",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
                      "disabled:bg-neutral-400 disabled:cursor-not-allowed"
                    )}
                  >
                    {t("profile.form.updateButton")}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
