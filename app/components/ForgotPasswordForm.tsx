"use client";

import { useFormState } from "react-dom";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { v4 as uuid } from "uuid";
import { useTranslations } from "next-intl";

import SubmitButton from "@/app/components/SubmitButton";
import { forgottenPassword } from "@/app/actions";
import { useAlerts } from "@/app/context/alertsContext";
import { inputClassname, labelClassname } from "@/app/staticData/cartPageClasses";
import { IActionResponse } from "../types/apiTypes";

const initialState = {
  message: "",
  data: null,
  isSuccess: false,
  statusCode: 0,
  email: "",
};

export default function ForgotPasswordForm() {
  const t = useTranslations("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const forgotPasswordFunction = async () => {
      try {
        const stringifiedData = JSON.stringify({ mail: email });
        setIsLoading(true);
        const response = await forgottenPassword(stringifiedData);
        setIsLoading(false);
        setActionResponse(response);
      } catch (error) {
        console.error(error);
      }
    };
    forgotPasswordFunction();
  };

  const [isLoading, setIsLoading] = useState(false);
  const [actionResponse, setActionResponse] = useState<IActionResponse>({
    message: "",
    data: null,
    isSuccess: false,
    statusCode: 0,
  });

  const { addAlert } = useAlerts();
  const router = useRouter();
  const searchParams = useSearchParams();

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
