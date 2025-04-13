// ForgotPasswordForm.tsx (Updated with i18n)
"use client";

import { useFormState } from "react-dom";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { v4 as uuid } from "uuid";
import { useTranslations } from "next-intl"; // Import useTranslations

import SubmitButton from "@/app/components/SubmitButton";
import { forgottenPassword } from "@/app/actions";
import { useAlerts } from "@/app/context/alertsContext";
// Import styling classes
import { inputClassname, labelClassname } from "@/app/staticData/cartPageClasses"; // Adjust path if needed

// Initial state (can be simplified if action doesn't need initial data)
const initialState = {
  message: "",
  data: null,
  isSuccess: false,
  statusCode: 0,
  email: "",
};

export default function ForgotPasswordForm() {
  // Translations hooks
  const tForm = useTranslations("forgotPasswordPage");
  const tAlerts = useTranslations("alerts.forgotPassword");

  // Form state hook
  const [state, formAction] = useFormState(forgottenPassword, initialState as any);

  // Other hooks
  const { addAlert } = useAlerts();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Effect to handle action response
  useEffect(() => {
    if (state.statusCode !== 0) {
      // Action completed
      if (state.isSuccess && state.statusCode === 204) {
        const redirect = searchParams.get("redirect");
        // Use translated success alert
        addAlert(uuid(), tAlerts("success204.text"), tAlerts("success204.title"), "emerald");
        router.push(redirect ? `/${redirect}` : "/connexion");
      } else if (!state.isSuccess) {
        // Handle errors using translated messages
        let titleKey = "defaultError.title";
        let textKey = "defaultError.text";
        let color: "yellow" | "red" = "red"; // Default to red

        switch (state.statusCode) {
          case 404:
          case 409: // Grouping 404 and 409 as "Unknown Email"
            titleKey = "error40x.title";
            textKey = "error40x.text";
            color = "yellow";
            break;
          case 500:
            titleKey = "error500.title";
            textKey = "error500.text";
            color = "red";
            break;
          case 400:
            titleKey = "error400.title";
            textKey = "error400.text";
            color = "yellow";
            break;
          // Add other specific cases if needed
        }
        // Use server message if available, otherwise use translated fallback
        const alertText = state.message || tAlerts(textKey);
        addAlert(uuid(), alertText, tAlerts(titleKey), color);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]); // Run only when state changes

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="email" className={labelClassname}>
          {tForm("emailLabel")} {/* Use translated label */}
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email" // Name is crucial for formAction
            type="email"
            required
            autoComplete="email"
            className={inputClassname} // Apply consistent style
            // Optionally add placeholder
            placeholder={tForm("emailPlaceholder", { default: "you@example.com" })} // Example with default
            aria-describedby={state?.errors?.email ? "email-error" : undefined}
          />
          {/* Optional: Display validation errors */}
          {/* {state?.errors?.email && (<p className="mt-1 text-xs text-red-600" id="email-error">{state.errors.email}</p>)} */}
        </div>
      </div>

      <div className="mt-6">
        <SubmitButton
          text={tForm("submitButton")}
          className="w-full" // Make button full width
        />
      </div>
    </form>
  );
}
