"use client";

import { useState, useEffect, FormEvent } from "react";
import { useTranslations } from "next-intl";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuid } from "uuid";

import SubmitButton from "@/app/components/SubmitButton";
import Title from "@/app/components/Title";
import Star from "@/app/components/Star";

import { useAuth } from "@/app/context/authContext";
import { useAlerts } from "@/app/context/alertsContext";
import { isUserDataAPIResponse } from "@/app/utils/typeGuardsFunctions";
import { update } from "@/app/actions";
import {
  sectionWrapperClassname,
  inputClassname,
  buttonClassname,
  checkRadioClassname,
  titleClassname as baseTitleClassname,
} from "@/app/staticData/cartPageClasses";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { IActionResponse } from "@/app/types/apiTypes";

const FormField = ({
  id,
  label,
  required,
  children,
  helpText,
  className,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
  helpText?: string;
  className?: string;
}) => (
  <div className={twMerge("mb-4", className)}>
    <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900 mb-1">
      {label} {required && <Star />}
    </label>
    {children}
    {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
  </div>
);

export default function Profile() {
  const [inputType, setInputType] = useState<"password" | "text">("password");
  const [isUpdating, setIsUpdating] = useState(false);

  const [doesPasswordsMatch, setDoesPasswordMatch] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [actionResponse, setActionResponse] = useState<IActionResponse>({
    message: "",
    data: null,
    isSuccess: false,
    statusCode: 0,
  });

  const [localFormData, setLocalFormData] = useState({
    firstname: "",
    lastname: "",
    mail: "",
    oldPassword: "",
    newPassword: "",
    optInMarketing: false,
  });

  const t = useTranslations();
  const { userData, setUserData } = useAuth();
  const { addAlert } = useAlerts();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetActionResponse = () => {
    setActionResponse({
      message: "",
      data: null,
      isSuccess: false,
      statusCode: 0,
    });
  };

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setLocalFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "newPassword") setNewPassword(value);
    if (name === "confirmNewPassword") setConfirmNewPassword(value);
  };

  const handleCancel = () => {
    setIsUpdating(false);
    setIsLoading(false);
    if (userData) {
      setLocalFormData({
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        mail: userData.mail || "",
        oldPassword: "",
        newPassword: "",
        optInMarketing: !!userData.optInMarketing,
      });
    }
    setNewPassword("");
    setConfirmNewPassword("");
    setDoesPasswordMatch(true);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updateUser = async () => {
      try {
        const stringifiedData = JSON.stringify(localFormData);
        setIsLoading(true);
        const response = await update(stringifiedData);
        setIsLoading(false);
        setActionResponse(response);
      } catch (error) {
        console.error(error);
      }
    };
    updateUser();
  };

  useEffect(() => {
    if (userData) {
      setLocalFormData({
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        mail: userData.mail || "",
        oldPassword: "",
        newPassword: "",
        optInMarketing: !!userData.optInMarketing,
      });
      setIsUpdating(false);
    }
  }, [userData]);

  useEffect(() => {
    if (actionResponse.statusCode !== 0) {
      setIsUpdating(false);
      setIsLoading(false);
      if (actionResponse.isSuccess && isUserDataAPIResponse(actionResponse.data) && actionResponse.statusCode === 200) {
        if (!Array.isArray(actionResponse.data.addresses)) {
          actionResponse.data.addresses = [];
        }

        setUserData((prevState) => {
          if (prevState) {
            return { ...prevState, ...actionResponse.data };
          }
          return null;
        });
        setLocalFormData((prev) => ({ ...prev, oldPassword: "", newPassword: "" }));
        setNewPassword("");
        setConfirmNewPassword("");
        setTimeout(() => handleResetActionResponse(), 1000);
        addAlert(uuid(), t("alerts.profile.infos.200.text"), t("alerts.profile.infos.200.title"), "emerald");
        scrollToTop();
      } else {
        let alertTitle = t("alerts.genericError.title");
        let alertText = actionResponse.message || t("alerts.genericError.text");
        let alertType: "yellow" | "red" = "red";

        switch (actionResponse.statusCode) {
          case 400: // e.g., Bad input data
            alertTitle = t("alerts.profile.infos.400.title");
            alertText = actionResponse.message || t("alerts.profile.infos.400.text");
            alertType = "yellow";
            break;
          case 401: // e.g., Incorrect old password
            alertTitle = t("alerts.profile.infos.401.title");
            alertText = actionResponse.message || t("alerts.profile.infos.401.text");
            alertType = "yellow";
            setLocalFormData((prev) => ({ ...prev, oldPassword: "" }));
            break;
          case 409: // e.g., Email already exists (if allowing email change)
            alertTitle = t("alerts.profile.infos.409.title");
            alertText = actionResponse.message || t("alerts.profile.infos.409.text");
            alertType = "yellow";
            break;
          case 422: // Validation error (server-side)
            alertTitle = t("alerts.profile.infos.422.title");
            alertText = actionResponse.message || t("alerts.profile.infos.422.text");
            alertType = "yellow";
          case 500:
            alertTitle = "Error";
            alertText = "Server side error. Please, try again later";
            alertType = "red";
            break;
        }
        setTimeout(() => handleResetActionResponse(), 1000);
        addAlert(uuid(), alertText, alertTitle, alertType);
        scrollToTop();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionResponse]);

  useEffect(() => {
    setDoesPasswordMatch(newPassword === confirmNewPassword);
  }, [newPassword, confirmNewPassword]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Title title={t("profile.title")} type="h1" classname={twMerge(baseTitleClassname, "md:mt-14 text-green")} firstLetterClassname="text-xl" />

      {!userData ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <LoadingSpinner size="lg" color="green" />
        </div>
      ) : (
        <div className={twMerge(sectionWrapperClassname, "relative")}>
          {isLoading && (
            <>
              <div className="absolute inset-0 bg-white opacity-60" />

              <div className="absolute inset-0 flex items-center justify-center z-50">
                <LoadingSpinner />
              </div>
            </>
          )}
          {/* @ts-ignore */}
          <form onChange={isUpdating ? handleLocalChange : undefined} onSubmit={handleSubmit}>
            {/* --- Personal Information Section --- */}
            <fieldset className="mb-6 border-b border-gray-200 pb-6">
              <legend className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</legend>
              <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
                <FormField id="firstname" label={t("profile.form.firstName")} required>
                  <input
                    type="text"
                    name="firstname"
                    required
                    value={localFormData.firstname}
                    onChange={handleLocalChange}
                    disabled={!isUpdating}
                    className={twMerge(inputClassname, !isUpdating && "bg-gray-100 cursor-not-allowed")}
                  />
                </FormField>
                <FormField id="lastname" label={t("profile.form.lastName")} required>
                  <input
                    type="text"
                    name="lastname"
                    required
                    value={localFormData.lastname}
                    onChange={handleLocalChange}
                    disabled={!isUpdating}
                    className={twMerge(inputClassname, !isUpdating && "bg-gray-100 cursor-not-allowed")}
                  />
                </FormField>
                <FormField id="mail" label={t("profile.form.email")} required className="sm:col-span-2">
                  <input
                    type="email"
                    name="mail"
                    required
                    value={localFormData.mail}
                    onChange={handleLocalChange}
                    disabled={!isUpdating}
                    className={twMerge(inputClassname, !isUpdating && "bg-gray-100 cursor-not-allowed")}
                  />
                </FormField>
              </div>
            </fieldset>

            {/* --- Passwords Section --- */}
            <fieldset className="mb-6 border-b border-gray-200 pb-6">
              <legend className="text-lg font-semibold text-gray-900 mb-4">{t("profile.form.password")}</legend>
              <div className="space-y-5">
                {/* Current Password */}
                <FormField id="oldPassword" label={t("profile.form.currentPassword")} helpText={t("profile.form.currentPasswordMessage")}>
                  <div className="relative">
                    <input
                      type={inputType}
                      name="oldPassword"
                      value={localFormData.oldPassword}
                      onChange={handleLocalChange}
                      disabled={!isUpdating}
                      className={twMerge(inputClassname, !isUpdating && "bg-gray-100 cursor-not-allowed")}
                    />
                    {/* Eye icon toggle */}
                    {isUpdating && (
                      <button
                        type="button"
                        onClick={() => setInputType((prev) => (prev === "password" ? "text" : "password"))}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {inputType === "password" ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                      </button>
                    )}
                  </div>
                </FormField>
                {/* New Password */}
                <FormField id="newPassword" label={t("profile.form.newPassword")} required={!!localFormData.oldPassword}>
                  <div className="relative">
                    <input
                      type={inputType}
                      name="newPassword"
                      value={newPassword}
                      onChange={handleLocalChange}
                      required={!!localFormData.oldPassword}
                      disabled={!isUpdating}
                      className={twMerge(inputClassname, !isUpdating && "bg-gray-100 cursor-not-allowed")}
                    />
                    {isUpdating && (
                      <button
                        type="button"
                        onClick={() => setInputType((prev) => (prev === "password" ? "text" : "password"))}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {inputType === "password" ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                      </button>
                    )}
                  </div>
                </FormField>
                {/* Confirm New Password */}
                <FormField id="confirmNewPassword" label={t("profile.form.confirmNewPassword")} required={!!localFormData.oldPassword}>
                  <div className="relative">
                    <input
                      type={inputType}
                      name="confirmNewPassword"
                      value={confirmNewPassword}
                      onChange={handleLocalChange}
                      required={!!localFormData.oldPassword}
                      disabled={!isUpdating}
                      className={twMerge(
                        inputClassname,
                        !isUpdating && "bg-gray-100 cursor-not-allowed",
                        !doesPasswordsMatch && isUpdating && "ring-red-500 focus:ring-red-500 border-red-500"
                      )}
                      aria-invalid={!doesPasswordsMatch && isUpdating}
                      aria-describedby={!doesPasswordsMatch && isUpdating ? "passwords-dont-match" : undefined}
                    />
                    {isUpdating && (
                      <button
                        type="button"
                        onClick={() => setInputType((prev) => (prev === "password" ? "text" : "password"))}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {inputType === "password" ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                      </button>
                    )}
                  </div>
                  {/* Password Mismatch Error Message */}
                  {!doesPasswordsMatch && isUpdating ? (
                    <p id="passwords-dont-match" role="alert" className="mt-1 text-xs text-red-600">
                      {t("profile.form.passwordMismatch")}
                    </p>
                  ) : null}
                </FormField>
              </div>
            </fieldset>

            {/* --- Communication Preferences Section --- */}
            <fieldset>
              <legend className="text-lg font-semibold text-gray-900 mb-4">{t("profile.form.communicationPreferences.label")}</legend>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id="optInMarketing"
                    name="optInMarketing"
                    type="checkbox"
                    checked={localFormData.optInMarketing}
                    onChange={handleLocalChange}
                    disabled={!isUpdating}
                    className={checkRadioClassname}
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label
                    htmlFor="optInMarketing"
                    className={clsx("font-medium text-gray-900", !isUpdating ? "cursor-not-allowed text-gray-500" : "cursor-pointer")}
                  >
                    {t("profile.form.communicationPreferences.promotions.label")}
                  </label>
                  <p className={clsx("text-xs", !isUpdating ? "text-gray-400" : "text-gray-500")}>
                    {t("profile.form.communicationPreferences.promotions.hint")}
                  </p>
                </div>
              </div>
            </fieldset>

            {/* --- Buttons Section --- */}
            <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end gap-x-3">
              {isUpdating ? (
                <>
                  {/* Cancel Button */}
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className={twMerge(buttonClassname, "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 w-auto px-4 py-2")}
                  >
                    {t("profile.form.cancel")}
                  </button>
                  <SubmitButton text={t("profile.form.saveButton")} isDisabled={!doesPasswordsMatch || isLoading} className="w-auto px-6 py-2" />
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsUpdating(true);
                    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={twMerge(buttonClassname, "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 w-auto px-6 py-2")}
                >
                  {t("profile.form.updateButton")}
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
