"use client";

import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { v4 as uuid } from "uuid";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

import SubmitButton from "@/app/components/SubmitButton";
import { register } from "@/app/actions";
import { useAuth } from "@/app/context/authContext";
import { useAlerts } from "@/app/context/alertsContext";
import { isUserDataAPIResponse } from "@/app/utils/typeGuardsFunctions";
import { useTranslations } from "next-intl";
import Star from "@/app/components/Star";
import { inputClassname, labelClassname, checkRadioClassname, linkClassname } from "@/app/staticData/cartPageClasses";

const initialState = {
  message: "",
  data: null,
  isSuccess: false,
  statusCode: 0,
};

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
    <label htmlFor={id} className={labelClassname}>
      {label} {required && <Star />}
    </label>
    <div className="mt-1">{children}</div>
    {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
  </div>
);

export default function SignUpForm() {
  const t = useTranslations("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [inputType, setInputType] = useState<"password" | "text">("password");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [doesPasswordsMatch, setDoesPasswordMatch] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const initialEmail = searchParams.get("email") || "";

  const [state, formAction] = useFormState(register, { ...initialState, email: initialEmail } as any);

  const { setUserData } = useAuth();
  const { addAlert } = useAlerts();

  useEffect(() => {
    if (state.statusCode !== 0) {
      if (state.isSuccess && isUserDataAPIResponse(state.data) && state.statusCode === 200) {
        const redirectPath = searchParams.get("redirect");
        setUserData(state.data);
        localStorage.setItem("accessToken", state.data.accessToken);
        localStorage.setItem("refreshToken", state.data.refreshToken);
        addAlert(uuid(), t("alerts.signUp.success.text"), t("alerts.signUp.success.title"), "emerald");
        router.push(redirectPath ? `/${redirectPath}` : "/"); // Redirect to account
        router.refresh();
      } else {
        let titleKey = "alerts.signUp.defaultError.title";
        let textKey = "alerts.signUp.defaultError.text";
        let alertType: "yellow" | "red" | "blue" = "red";

        switch (state.statusCode) {
          case 409:
            titleKey = "alerts.signUp.error409.title";
            textKey = "alerts.signUp.error409.text";
            alertType = "blue";
            setTimeout(() => router.push(`/connexion?email=${encodeURIComponent(state.email || initialEmail)}`), 500);
            break;
          case 400:
            titleKey = "alerts.signUp.error400.title";
            textKey = "alerts.signUp.error400.text";
            alertType = "yellow";
            break;
          case 422:
            titleKey = "alerts.signUp.error422.title";
            textKey = "alerts.signUp.error422.text";
            alertType = "yellow";
            break;
          case 500:
            titleKey = "alerts.signUp.error500.title";
            textKey = "alerts.signUp.error500.text";
            alertType = "red";
            break;
        }
        const alertText = state.message || t(textKey);
        addAlert(uuid(), alertText, t(titleKey), alertType);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    if (repeatPassword) {
      setDoesPasswordMatch(password === repeatPassword);
    } else {
      setDoesPasswordMatch(true);
    }
  }, [password, repeatPassword]);

  return (
    <form action={formAction} className="space-y-5">
      {/* First/Last Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <FormField id="firstname" label={t("signUpPage.firstNameLabel")} required>
          <input type="text" name="firstname" required className={inputClassname} />
        </FormField>
        <FormField id="lastname" label={t("signUpPage.lastNameLabel")} required>
          <input type="text" name="lastname" required className={inputClassname} />
        </FormField>
      </div>

      {/* Email */}
      <FormField id="email" label={t("signUpPage.emailLabel")} required>
        <input
          type="email"
          name="email"
          required
          defaultValue={initialEmail}
          className={inputClassname}
          aria-describedby={state?.errors?.email ? "email-error" : undefined}
        />
        {/* TODO Optional: state?.errors?.email */}
      </FormField>

      {/* Password */}
      <FormField id="password" label={t("signUpPage.passwordLabel")} required>
        <div className="relative">
          <input
            type={inputType}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className={inputClassname}
            aria-describedby={state?.errors?.password ? "password-error" : undefined}
          />
          <button
            type="button"
            onClick={() => setInputType((prev) => (prev === "password" ? "text" : "password"))}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={inputType === "password" ? t("signUpPage.showPasswordAriaLabel") : t("signUpPage.hidePasswordAriaLabel")}
          >
            {inputType === "password" ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
          </button>
        </div>
        {/* Optional: state?.errors?.password */}
      </FormField>

      {/* Repeat Password */}
      <FormField id="repeat-password" label={t("signUpPage.confirmPasswordLabel")} required>
        <div className="relative">
          <input
            type={inputType}
            name="repeat-password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
            autoComplete="new-password"
            className={twMerge(inputClassname, !doesPasswordsMatch && "ring-red-500 focus:ring-red-500 border-red-500")}
            aria-invalid={!doesPasswordsMatch}
            aria-describedby={!doesPasswordsMatch ? "passwords-dont-match" : undefined}
          />
          <button
            type="button"
            onClick={() => setInputType((prev) => (prev === "password" ? "text" : "password"))}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={inputType === "password" ? t("signUpPage.showPasswordAriaLabel") : t("signUpPage.hidePasswordAriaLabel")}
          >
            {inputType === "password" ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
          </button>
        </div>
        {/* Password Mismatch Error Message */}
        {!doesPasswordsMatch ? (
          <p id="passwords-dont-match" role="alert" className="mt-1 text-xs text-red-600">
            {t("signUpPage.passwordMismatchError")}
          </p>
        ) : null}
      </FormField>

      {/* Checkboxes */}
      <fieldset className="space-y-4 pt-2">
        <legend className="sr-only">{t("signUpPage.prefsAndConditionsLegendSR")}</legend>
        {/* Marketing Opt-in */}
        <div className="relative flex items-start">
          <div className="flex h-6 items-center">
            <input id="optInMarketing" name="optInMarketing" type="checkbox" className={checkRadioClassname} />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label htmlFor="optInMarketing" className="font-medium text-gray-900 cursor-pointer">
              {t("signUpPage.marketingOptInLabel")}
            </label>
          </div>
        </div>
        {/* Terms and Conditions */}
        <div className="relative flex items-start">
          <div className="flex h-6 items-center">
            <input
              id="condition-generales"
              name="condition-generales"
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              required
              className={checkRadioClassname}
            />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label htmlFor="condition-generales" className="text-gray-700 cursor-pointer">
              {t("signUpPage.termsLabel")}{" "}
              <Link href="/conditions-generales-de-vente" target="_blank" className={linkClassname}>
                {t("signUpPage.termsLink")}
              </Link>{" "}
              <Star />
            </label>
          </div>
        </div>
      </fieldset>

      {/* Submit Button */}
      <div>
        <SubmitButton text={t("signUpPage.submitButton")} isDisabled={!doesPasswordsMatch || !agreedToTerms} className="w-full mt-4" />
      </div>
    </form>
  );
}
