// SignUpForm.tsx
"use client";

import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, redirect as nextRedirect } from "next/navigation";
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
import { inputClassname, labelClassname, buttonClassname, checkRadioClassname, linkClassname } from "@/app/staticData/cartPageClasses"; // Adjust path

// Initial state for the form hook
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
  const tForm = useTranslations("signUpPage"); // Namespace for form elements
  const tAlerts = useTranslations("alerts.signUp"); // Namespace for alerts
  const router = useRouter();
  const searchParams = useSearchParams();

  // Keep local state for password visibility, matching, and terms agreement
  const [inputType, setInputType] = useState<"password" | "text">("password");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [doesPasswordsMatch, setDoesPasswordMatch] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Read initial email from search params
  const initialEmail = searchParams.get("email") || "";

  // Form state hook
  const [state, formAction] = useFormState(register, { ...initialState, email: initialEmail } as any);

  // Keep context hooks
  const { setUserData } = useAuth();
  const { addAlert } = useAlerts();

  // Keep useEffect for handling action response, using translated alerts
  useEffect(() => {
    if (state.statusCode !== 0) {
      if (state.isSuccess && isUserDataAPIResponse(state.data) && state.statusCode === 200) {
        const redirectPath = searchParams.get("redirect");
        setUserData(state.data);
        localStorage.setItem("accessToken", state.data.accessToken);
        localStorage.setItem("refreshToken", state.data.refreshToken);
        // Use translated success alert
        addAlert(uuid(), tAlerts("success.text"), tAlerts("success.title"), "emerald");
        router.push(redirectPath ? `/${redirectPath}` : "/mon-compte"); // Redirect to account
        router.refresh();
      } else {
        // Handle errors using translated messages
        let titleKey = "defaultError.title";
        let textKey = "defaultError.text";
        let alertType: "yellow" | "red" | "blue" = "red";

        switch (state.statusCode) {
          case 409:
            titleKey = "error409.title";
            textKey = "error409.text";
            alertType = "blue";
            // Pass email back to login page after delay
            setTimeout(() => router.push(`/connexion?email=${encodeURIComponent(state.email || initialEmail)}`), 500);
            break;
          case 400:
            titleKey = "error400.title";
            textKey = "error400.text";
            alertType = "yellow";
            break;
          case 422:
            titleKey = "error422.title";
            textKey = "error422.text";
            alertType = "yellow";
            break;
          case 500:
            titleKey = "error500.title";
            textKey = "error500.text";
            alertType = "red";
            break;
        }
        // Use server message if available, otherwise use translated fallback
        const alertText = state.message || tAlerts(textKey);
        addAlert(uuid(), alertText, tAlerts(titleKey), alertType);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Keep password matching effect
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
        <FormField id="firstname" label={tForm("firstNameLabel")} required>
          <input type="text" name="firstname" required className={inputClassname} />
        </FormField>
        <FormField id="lastname" label={tForm("lastNameLabel")} required>
          <input type="text" name="lastname" required className={inputClassname} />
        </FormField>
      </div>

      {/* Email */}
      <FormField id="email" label={tForm("emailLabel")} required>
        <input
          type="email"
          name="email"
          required
          defaultValue={initialEmail} // Use defaultValue
          className={inputClassname}
          aria-describedby={state?.errors?.email ? "email-error" : undefined}
        />
        {/* Optional: state?.errors?.email */}
      </FormField>

      {/* Password */}
      <FormField id="password" label={tForm("passwordLabel")} required>
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
            // TODO-TRANSLATION: Add translations for aria-label
            aria-label={inputType === "password" ? "Show password" : "Hide password"}
          >
            {inputType === "password" ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
          </button>
        </div>
        {/* Optional: state?.errors?.password */}
      </FormField>

      {/* Repeat Password */}
      <FormField id="repeat-password" label={tForm("confirmPasswordLabel")} required>
        <div className="relative">
          <input
            type={inputType}
            name="repeat-password" // Not sent to server, only for validation
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
            // TODO-TRANSLATION: Add translations for aria-label
            aria-label={inputType === "password" ? "Show password" : "Hide password"}
          >
            {inputType === "password" ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
          </button>
        </div>
        {/* Password Mismatch Error Message */}
        {!doesPasswordsMatch ? (
          <p id="passwords-dont-match" role="alert" className="mt-1 text-xs text-red-600">
            {tForm("passwordMismatchError")} {/* Translated error */}
          </p>
        ) : null}
      </FormField>

      {/* Checkboxes */}
      <fieldset className="space-y-4 pt-2">
        <legend className="sr-only">Préférences et conditions</legend> {/* TODO-TRANSLATION */}
        {/* Marketing Opt-in */}
        <div className="relative flex items-start">
          <div className="flex h-6 items-center">
            <input id="optInMarketing" name="optInMarketing" type="checkbox" className={checkRadioClassname} />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label htmlFor="optInMarketing" className="font-medium text-gray-900 cursor-pointer">
              {tForm("marketingOptInLabel")} {/* Translated label */}
            </label>
          </div>
        </div>
        {/* Terms and Conditions */}
        <div className="relative flex items-start">
          <div className="flex h-6 items-center">
            <input
              id="condition-generales"
              name="condition-generales" // Ensure name matches action if needed
              type="checkbox"
              checked={agreedToTerms} // Controlled state
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              required // Make agreement mandatory
              className={checkRadioClassname}
            />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label htmlFor="condition-generales" className="text-gray-700 cursor-pointer">
              {tForm("termsLabel")} {/* Translated label */}
              <Link href="/conditions-generales-de-vente" target="_blank" className={linkClassname}>
                {tForm("termsLink")} {/* Translated link text */}
              </Link>{" "}
              <Star />
            </label>
          </div>
        </div>
      </fieldset>

      {/* Submit Button */}
      <div>
        <SubmitButton text={tForm("submitButton")} isDisabled={!doesPasswordsMatch || !agreedToTerms} className="w-full mt-4" />
      </div>
    </form>
  );
}
