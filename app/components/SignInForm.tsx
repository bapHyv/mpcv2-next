// SignInForm.tsx
"use client";

import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { v4 as uuid } from "uuid";
import Link from "next/link";

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
  const [inputType, setInputType] = useState<"password" | "text">("password");

  const [state, formAction] = useFormState(login, initialState as any);

  const { setUserData } = useAuth();
  const { addAlert } = useAlerts();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (state.statusCode !== 0) {
      if (state.isSuccess && state.data && state.statusCode === 200) {
        const redirect = searchParams.get("redirect");
        const userData = state.data as UserDataAPIResponse;

        setUserData(userData);
        localStorage.setItem("accessToken", userData.accessToken);
        localStorage.setItem("refreshToken", userData.refreshToken);
        addAlert(uuid(), "Connexion réussie!", "Succès", "emerald");

        router.push(redirect ? `/${redirect}` : "/");
        router.refresh();
      } else {
        let alertTitle = "Erreur";
        let alertText = state.message || "Une erreur est survenue.";
        let alertType: "yellow" | "red" | "blue" = "red";

        switch (state.statusCode) {
          case 401:
            alertTitle = "Erreur Connexion";
            alertText = "Email ou mot de passe incorrect.";
            alertType = "yellow";
            break;
          case 204:
            alertTitle = "Compte non trouvé";
            alertText = state.message || "Aucun compte trouvé avec cet email.";
            alertType = "blue";
            break;
          case 500:
            alertTitle = "Erreur Serveur";
            alertText = "Problème technique, veuillez réessayer plus tard.";
            alertType = "red";
            break;
        }
        addAlert(uuid(), alertText, alertTitle, alertType);

        if (state.statusCode === 204 && state.data) {
          router.push(`/inscription/?email=${encodeURIComponent(state.data as string)}`);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="email" className={labelClassname}>
          Adresse e-mail
        </label>
        <div className="mt-2">
          <input id="email" name="email" type="email" required autoComplete="email" className={inputClassname} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className={labelClassname}>
            Mot de passe
          </label>
          <div className="text-sm">
            <Link href="/mot-de-passe-oublie" className={linkClassname}>
              Mot de passe oublié?
            </Link>
          </div>
        </div>
        <div className="mt-2 relative">
          <input id="password" name="password" type={inputType} required autoComplete="current-password" className={inputClassname} />
          <button
            type="button"
            onClick={() => setInputType((prev) => (prev === "password" ? "text" : "password"))}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={inputType === "password" ? "Show password" : "Hide password"}
          >
            {inputType === "password" ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div>
        <SubmitButton text="Se connecter" className="w-full" />
      </div>
    </form>
  );
}
