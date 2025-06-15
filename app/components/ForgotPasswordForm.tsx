"use client";

import { useFormState } from "react-dom";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { v4 as uuid } from "uuid";
import { useTranslations } from "next-intl";

import SubmitButton from "@/app/components/SubmitButton";
import { useAlerts } from "@/app/context/alertsContext";
import { inputClassname, labelClassname } from "@/app/staticData/cartPageClasses";
import { IActionResponse } from "../types/apiTypes";

export default function ForgotPasswordForm() {
  const [actionResponse, setActionResponse] = useState<IActionResponse>({ message: "", data: null, isSuccess: false, statusCode: 0 });
  const t = useTranslations("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { addAlert } = useAlerts();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mail: email }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setActionResponse({
          message: responseData.message || "An error occurred",
          isSuccess: false,
          statusCode: response.status as any,
          data: null,
        });
        return;
      }

      setActionResponse({
        message: "Success",
        isSuccess: true,
        statusCode: 200, // We now expect a 200 from our API route
        data: null,
      });
    } catch (error) {
      console.error("Forgot password request failed:", error);
      setActionResponse({
        message: t("alerts.genericError.text"),
        isSuccess: false,
        statusCode: 500,
        data: null,
      });
    }
  };

  useEffect(() => {
    if (actionResponse.statusCode !== 0) {
      if (actionResponse.isSuccess && actionResponse.statusCode === 204) {
        const redirect = searchParams.get("redirect");
        addAlert(uuid(), t("alerts.forgotPassword.success204.text"), t("alerts.forgotPassword.success204.title"), "emerald");
        router.push(redirect ? `/${redirect}` : "/connexion");
      } else if (!actionResponse.isSuccess) {
        let titleKey = "alerts.forgotPassword.defaultError.title";
        let textKey = "alerts.forgotPassword.defaultError.text";
        let color: "yellow" | "red" = "red";

        switch (actionResponse.statusCode) {
          case 404:
          case 409:
            titleKey = "alerts.forgotPassword.error40x.title";
            textKey = "alerts.forgotPassword.error40x.text";
            color = "yellow";
            break;
          case 500:
            titleKey = "alerts.forgotPassword.error500.title";
            textKey = "alerts.forgotPassword.error500.text";
            color = "red";
            break;
          case 400:
            titleKey = "alerts.forgotPassword.error400.title";
            textKey = "alerts.forgotPassword.error400.text";
            color = "yellow";
            break;
        }
        const alertText = actionResponse.message || t(textKey);
        addAlert(uuid(), alertText, t(titleKey), color);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionResponse]);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className={labelClassname}>
          {t("forgotPasswordPage.emailLabel")}
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClassname}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6">
        <SubmitButton text={t("forgotPasswordPage.submitButton")} className="w-full" isPending={isLoading} />
      </div>
    </form>
  );
}
