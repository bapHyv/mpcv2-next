// SignInForm.tsx (Updated with i18n)
"use client";

import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { v4 as uuid } from "uuid";
import Link from "next/link";
import { useTranslations } from "next-intl";

import SubmitButton from "@/app/components/SubmitButton";
import { login } from "@/app/actions";
import { useAuth } from "@/app/context/authContext";
import { useAlerts } from "@/app/context/alertsContext";
import { UserDataAPIResponse } from "@/app/types/profileTypes";
import { inputClassname, labelClassname, linkClassname } from "@/app/staticData/cartPageClasses";

const initialState = {
  message: "",
  data: null,
  isSuccess: false,
  statusCode: 0,
  email: "",
  password: "",
};

export default function SignInForm() {
  const tForm = useTranslations("signInPage");
  const tAlerts = useTranslations("alerts.signIn");
  const [inputType, setInputType] = useState<"password" | "text">("password");

  const [state, formAction] = useFormState(login, initialState as any);

  const { setUserData } = useAuth();
  const { addAlert } = useAlerts();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (state.statusCode !== 0) {
      // Action completed
      if (state.isSuccess && state.data && state.statusCode === 200) {
        const redirect = searchParams.get("redirect");
        const userData = state.data as UserDataAPIResponse;

        setUserData(userData);
        localStorage.setItem("accessToken", userData.accessToken);
        localStorage.setItem("refreshToken", userData.refreshToken);
        addAlert(uuid(), tAlerts("success200.text"), tAlerts("success200.title"), "emerald");

        router.push(redirect ? `/${redirect}` : "/");
        router.refresh();
      } else if (!state.isSuccess) {
        let titleKey = "defaultError.title";
        let textKey = "defaultError.text";
        let color: "yellow" | "red" | "blue" = "red";

        switch (state.statusCode) {
          case 401:
            titleKey = "error401.title";
            textKey = "error401.text";
            color = "yellow";
            break;
          case 204:
            titleKey = "info204.title";
            textKey = "info204.text";
            color = "blue";
            break;
          case 500:
            titleKey = "error500.title";
            textKey = "error500.text";
            color = "red";
            break;
          // TODO: Add other potential error codes (400, 422) if applicable
        }
        const alertText = state.message || tAlerts(textKey);
        addAlert(uuid(), alertText, tAlerts(titleKey), color);

        if (state.statusCode === 204 && state.email) {
          router.push(`/inscription/?email=${encodeURIComponent(state.email)}`);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      {/* Email Field */}
      <div>
        <label htmlFor="email" className={labelClassname}>
          {tForm("emailLabel")}
        </label>
        <div className="mt-2">
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClassname}
            aria-describedby={state?.errors?.email ? "email-error" : undefined}
          />
          {/* Optional: Display validation errors */}
          {/* {state?.errors?.email && (<p className="mt-1 text-xs text-red-600" id="email-error">{state.errors.email}</p>)} */}
        </div>
      </div>

      {/* Password Field */}
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className={labelClassname}>
            {tForm("passwordLabel")}
          </label>
          <div className="text-sm">
            <Link href="/mot-de-passe-oublie" className={linkClassname}>
              {tForm("forgotPasswordLink")}
            </Link>
          </div>
        </div>
        <div className="mt-2 relative">
          <input
            id="password"
            name="password"
            type={inputType}
            required
            autoComplete="current-password"
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
        {/* Optional: Display validation errors */}
        {/* {state?.errors?.password && (<p className="mt-1 text-xs text-red-600" id="password-error">{state.errors.password}</p>)} */}
      </div>

      {/* Submit Button */}
      <div>
        <SubmitButton text={tForm("submitButton")} className="w-full" />
      </div>
    </form>
  );
}
