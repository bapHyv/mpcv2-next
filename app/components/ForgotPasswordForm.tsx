"use client";

import { useFormState } from "react-dom";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { v4 as uuid } from "uuid";
import { useTranslations } from "next-intl";

import SubmitButton from "@/app/components/SubmitButton";
import { forgottenPassword } from "@/app/actions";
import { useAlerts } from "@/app/context/alertsContext";
import { inputClassname, labelClassname } from "@/app/staticData/cartPageClasses";

const initialState = {
  message: "",
  data: null,
  isSuccess: false,
  statusCode: 0,
  email: "",
};

export default function ForgotPasswordForm() {
  const t = useTranslations("");

  const [state, formAction] = useFormState(forgottenPassword, initialState as any);

  const { addAlert } = useAlerts();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (state.statusCode !== 0) {
      if (state.isSuccess && state.statusCode === 204) {
        const redirect = searchParams.get("redirect");
        addAlert(uuid(), t("alerts.forgotPassword.success204.text"), t("alerts.forgotPassword.success204.title"), "emerald");
        router.push(redirect ? `/${redirect}` : "/connexion");
      } else if (!state.isSuccess) {
        let titleKey = "alerts.forgotPassword.defaultError.title";
        let textKey = "alerts.forgotPassword.defaultError.text";
        let color: "yellow" | "red" = "red";

        switch (state.statusCode) {
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
          // TODO STATUS: Add other specific cases if needed
        }
        const alertText = state.message || t(textKey);
        addAlert(uuid(), alertText, t(titleKey), color);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction}>
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
            // TODO: aria-describedby={state?.errors?.email ? "email-error" : undefined}
          />
          {/* TODO: Optional: Display validation errors */}
          {/* {state?.errors?.email && (<p className="mt-1 text-xs text-red-600" id="email-error">{state.errors.email}</p>)} */}
        </div>
      </div>

      <div className="mt-6">
        <SubmitButton text={t("forgotPasswordPage.submitButton")} className="w-full" />
      </div>
    </form>
  );
}
