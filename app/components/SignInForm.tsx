"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { v4 as uuid } from "uuid";
import Link from "next/link";
import { useTranslations } from "next-intl";

import SubmitButton from "@/app/components/SubmitButton";
import { useAuth } from "@/app/context/authContext";
import { useAlerts } from "@/app/context/alertsContext";
import { UserDataAPIResponse } from "@/app/types/profileTypes";
import { inputClassname, labelClassname, linkClassname } from "@/app/staticData/cartPageClasses";

export default function SignInForm() {
  const t = useTranslations("");
  const [inputType, setInputType] = useState<"password" | "text">("password");
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const { setUserData } = useAuth();
  const { addAlert } = useAlerts();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.status === 404) {
        addAlert(uuid(), t("alerts.signIn.info204.text"), t("alerts.signIn.info204.title"), "blue");
        router.push(`/inscription/?email=${encodeURIComponent(formData.username)}`);
        return;
      }

      const responseData = await response.json();

      if (!response.ok) {
        let titleKey = "alerts.signIn.defaultError.title";
        let textKey = responseData.message || "alerts.signIn.defaultError.text";
        let color: "yellow" | "red" = "red";

        if (response.status === 401) {
          titleKey = "alerts.signIn.error401.title";
          textKey = responseData.message || "alerts.signIn.error401.text";
          color = "yellow";
        }
        addAlert(uuid(), textKey.startsWith("alerts.") ? t(textKey) : textKey, t(titleKey), color);
        return;
      }

      const userData = responseData as UserDataAPIResponse;
      if (!Array.isArray(userData.addresses)) {
        userData.addresses = [];
      }
      setUserData(userData);
      addAlert(uuid(), t("alerts.signIn.success200.text"), t("alerts.signIn.success200.title"), "emerald");

      const redirect = searchParams.get("redirect");
      router.push(redirect ? redirect : "/");
      router.refresh();
    } catch (error) {
      console.error("Login request failed:", error);
      addAlert(uuid(), t("alerts.signIn.error500.text"), t("alerts.signIn.error500.title"), "red");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Email Field */}
      <div>
        <label htmlFor="email" className={labelClassname}>
          {t("signInPage.emailLabel")}
        </label>
        <div className="mt-2">
          <input id="email" name="username" type="email" required autoComplete="email" className={inputClassname} onChange={handleChange} />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className={labelClassname}>
            {t("signInPage.passwordLabel")}
          </label>
          <div className="text-sm">
            <Link href="/mot-de-passe-oublie" className={linkClassname}>
              {t("signInPage.forgotPasswordLink")}
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
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setInputType((prev) => (prev === "password" ? "text" : "password"))}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={inputType === "password" ? t("signInPage.showPasswordAriaLabel") : t("signInPage.hidePasswordAriaLabel")}
          >
            {inputType === "password" ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <SubmitButton text={t("signInPage.submitButton")} className="w-full" isPending={isLoading} />
      </div>
    </form>
  );
}
