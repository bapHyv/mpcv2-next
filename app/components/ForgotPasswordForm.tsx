// ForgotPasswordForm.tsx
"use client";

import { useFormState } from "react-dom";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { v4 as uuid } from "uuid";

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
  const [state, formAction] = useFormState(forgottenPassword, initialState as any);

  const { addAlert } = useAlerts();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (state.statusCode !== 0) {
      if (state.isSuccess && state.statusCode === 204) {
        const redirect = searchParams.get("redirect");
        addAlert(uuid(), "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.", "Email envoyé", "emerald");
        router.push(redirect ? `/${redirect}` : "/connexion");
      } else if (!state.isSuccess) {
        let alertTitle = "Erreur";
        let alertText = state.message || "Une erreur est survenue.";
        let alertType: "yellow" | "red" = "red";

        switch (state.statusCode) {
          case 404:
          case 409:
            alertTitle = "Email inconnu";
            alertText = state.message || "Aucun compte n'est associé à cet email.";
            alertType = "yellow";
            break;
          case 500:
            alertTitle = "Erreur Serveur";
            alertText = state.message || "Erreur lors de la demande. Veuillez réessayer.";
            alertType = "red";
            break;
          case 400:
            alertTitle = "Requête invalide";
            alertText = state.message || "Veuillez vérifier l'adresse email.";
            alertType = "yellow";
            break;
        }
        addAlert(uuid(), alertText, alertTitle, alertType);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="email" className={labelClassname}>
          Adresse e-mail
        </label>
        <div className="mt-1">
          <input id="email" name="email" type="email" required autoComplete="email" className={inputClassname} />
        </div>
      </div>

      <div className="mt-6">
        <SubmitButton text="Réinitialiser le mot de passe" className="w-full" />
      </div>
    </form>
  );
}
