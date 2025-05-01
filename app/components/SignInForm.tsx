"use client";

import { FormEvent, useEffect, useState } from "react";
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
import { IActionResponse } from "@/app/types/apiTypes";

export default function SignInForm() {
  const t = useTranslations("");
  const [inputType, setInputType] = useState<"password" | "text">("password");
  const [formData, setFormData] = useState({ username: "", password: "" });

  const [isLoading, setIsLoading] = useState(false);
  const [actionResponse, setActionResponse] = useState<IActionResponse>({
    message: "",
    data: null,
    isSuccess: false,
    statusCode: 0,
  });

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loginFunction = async () => {
      try {
        const stringifiedData = JSON.stringify(formData);
        setIsLoading(true);
        const response = await login(stringifiedData);
        setIsLoading(false);
        setActionResponse(response);
      } catch (error) {
        console.error(error);
      }
    };
    loginFunction();
  };

  useEffect(() => {
    if (actionResponse.statusCode !== 0) {
      if (actionResponse.statusCode === 204) {
        addAlert(uuid(), t("alerts.signIn.info204.text"), t("alerts.signIn.info204.title"), "blue");
        router.push(`/inscription/?email=${encodeURIComponent(actionResponse.data as string)}`);
      } else if (actionResponse.isSuccess && actionResponse.data && actionResponse.statusCode === 200) {
        const redirect = searchParams.get("redirect");
        const userData = actionResponse.data as UserDataAPIResponse;

        setUserData(userData);
        addAlert(uuid(), t("alerts.signIn.success200.text"), t("alerts.signIn.success200.title"), "emerald");

        router.push(redirect ? `/${redirect}` : "/");
        router.refresh();
      } else if (!actionResponse.isSuccess) {
        let titleKey = "alerts.signIn.defaultError.title";
        let textKey = "alerts.signIn.defaultError.text";
        let color: "yellow" | "red" | "blue" = "red";

        switch (actionResponse.statusCode) {
          case 401:
            titleKey = "alerts.signIn.error401.title";
            textKey = "alerts.signIn.error401.text";
            color = "yellow";
            break;
          case 500:
            titleKey = "alerts.signIn.error500.title";
            textKey = "alerts.signIn.error500.text";
            color = "red";
            break;
        }
        const alertText = t(textKey);
        addAlert(uuid(), alertText, t(titleKey), color);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionResponse]);

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
