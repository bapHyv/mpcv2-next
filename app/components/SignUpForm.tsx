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
  const t = useTranslations();
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
        console.log(state.data);
        localStorage.setItem("accessToken", state.data.accessToken);
        localStorage.setItem("refreshToken", state.data.refreshToken);
        addAlert(uuid(), t("alerts.signUp.success.text"), t("alerts.signUp.success.title"), "emerald");
        router.push(redirectPath ? `/${redirectPath}` : "/");
        router.refresh();
      } else {
        let alertTitle = t("alerts.genericError.title");
        let alertText = state.message || t("alerts.genericError.text");
        let alertType: "yellow" | "red" | "blue" = "red";

        switch (state.statusCode) {
          case 409:
            alertTitle = t("alerts.signUp.409.title");
            alertText = state.message || t("alerts.signUp.409.text");
            alertType = "blue";
            setTimeout(() => router.push(`/connexion?email=${encodeURIComponent((state.data as string) || initialEmail)}`), 500);
            break;
          case 400: // Bad Request / Invalid input
            alertTitle = t("alerts.signUp.400.title");
            alertText = state.message || t("alerts.signUp.400.text");
            alertType = "yellow";
            break;
          case 422: // Server-side validation error
            alertTitle = t("alerts.signUp.422.title");
            alertText = state.message || t("alerts.signUp.422.text");
            alertType = "yellow";
            break;
          case 500: // Server Error
            alertTitle = t("alerts.signUp.500.title");
            alertText = state.message || t("alerts.signUp.500.text");
            alertType = "red";
            break;
        }
        addAlert(uuid(), alertText, alertTitle, alertType);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <FormField id="firstname" label="Prénom" required>
          <input type="text" name="firstname" required className={inputClassname} />
        </FormField>
        <FormField id="lastname" label="Nom" required>
          <input type="text" name="lastname" required className={inputClassname} />
        </FormField>
      </div>
      <FormField id="email" label="Adresse e-mail" required>
        <input type="email" name="email" required defaultValue={initialEmail} className={inputClassname} />
      </FormField>
      <FormField id="password" label="Mot de passe" required>
        <div className="relative">
          <input
            type={inputType}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className={inputClassname}
          />
          <button
            type="button"
            onClick={() => setInputType((prev) => (prev === "password" ? "text" : "password"))}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={inputType === "password" ? "Show password" : "Hide password"}
          >
            {inputType === "password" ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
          </button>
        </div>
      </FormField>
      <FormField id="repeat-password" label="Confirmer le mot de passe" required>
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
            aria-label={inputType === "password" ? "Show password" : "Hide password"}
          >
            {inputType === "password" ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
          </button>
        </div>
        {/* Password Mismatch Error Message */}
        {!doesPasswordsMatch ? (
          <p id="passwords-dont-match" role="alert" className="mt-1 text-xs text-red-600">
            Les mots de passe doivent correspondre.
          </p>
        ) : null}
      </FormField>
      <fieldset className="space-y-4 pt-2">
        <legend className="sr-only">Préférences et conditions</legend>
        <div className="relative flex items-start">
          <div className="flex h-6 items-center">
            <input id="optInMarketing" name="optInMarketing" type="checkbox" className={checkRadioClassname} />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label htmlFor="optInMarketing" className="font-medium text-gray-900 cursor-pointer">
              Je souhaite recevoir les actualités produits et promotions.
            </label>
          </div>
        </div>
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
              J&apos;ai lu et j&apos;accepte les{" "}
              <Link href="/conditions-generales-de-vente" target="_blank" className={linkClassname}>
                conditions générales
              </Link>{" "}
              <Star />
            </label>
          </div>
        </div>
      </fieldset>
      <div>
        <SubmitButton text="Créer mon compte" isDisabled={!doesPasswordsMatch || !agreedToTerms} className="w-full mt-4" />
      </div>
    </form>
  );
}
