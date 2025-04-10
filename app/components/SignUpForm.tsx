"use client";

import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { v4 as uuid } from "uuid";

import SubmitButton from "@/app/components/SubmitButton";
import { register } from "@/app/actions";
import { useAuth } from "@/app/context/authContext";
import { useAlerts } from "@/app/context/alertsContext";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { isUserDataAPIResponse } from "@/app/utils/typeGuardsFunctions";
import { useTranslations } from "next-intl";
import Star from "@/app/components/Star";
import Link from "next/link";

const initialState = {
  email: "",
  password: "",
  firstname: "",
  lastname: "",
  optInMarketing: false,
};

export default function SignUpForm() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [inputType, setInputType] = useState<"password" | "text">("password");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [doesPasswordsMatch, setDoesPasswordMatch] = useState(true);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [optInMarketing, setOptInMarketing] = useState(false);
  const [optInSell, setOptInSell] = useState(false);

  // @ts-ignore
  const [state, formAction] = useFormState(register, initialState);

  const { setUserData } = useAuth();
  const { addAlert } = useAlerts();

  useEffect(() => {
    if (state.isSuccess && isUserDataAPIResponse(state.data) && state.data && state.statusCode === 200) {
      const redirect = searchParams.get("redirect");

      setUserData(state.data);

      localStorage.setItem("accessToken", state.data.accessToken);
      localStorage.setItem("refreshToken", state.data.refreshToken);

      addAlert(uuid(), "You've successfully signed up", "Sign up successful", "emerald");

      router.push(redirect ? redirect : "/");
    } else if (!state.isSuccess && !state.data) {
      switch (state.statusCode) {
        case 409:
          addAlert(uuid(), "User already exists, you'll get redirected", "User already exists", "blue");
          redirect("/connexion");
        case 500:
          addAlert(uuid(), "Error, try again later", "Error server", "red");
          break;
        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    if ((password === "" && repeatPassword === "") || password === repeatPassword) {
      setDoesPasswordMatch(true);
    } else {
      setDoesPasswordMatch(false);
    }
  }, [password, repeatPassword]);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
          Email address <Star />
        </label>
        <div className="mt-2">
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className={clsx(
              "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1",
              "ring-inset ring-gray-300",
              "placeholder:text-gray-400",
              "focus:ring-2 focus:ring-inset focus:ring-light-green",
              "sm:text-sm sm:leading-6"
            )}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className={twMerge(clsx("block text-sm font-medium leading-6 text-gray-900"))}>
            Password <Star />
          </label>
          <div className="text-sm">
            <span>Already signed up? </span>
            <a href="/connexion" className="underline font-semibold text-light-green hover:text-light-green">
              Click here
            </a>
          </div>
        </div>
        <div className="mt-2 relative">
          <input
            id="password"
            name="password"
            type={inputType}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className={clsx(
              "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm",
              "ring-1 ring-inset ring-gray-300",
              "placeholder:text-gray-400",
              "focus:ring-2 focus:ring-inset focus:ring-light-green",
              "sm:text-sm sm:leading-6"
            )}
          />
          <div className="absolute h-full top-0 right-2 flex items-center">
            {inputType === "password" ? (
              <EyeIcon className="w-6 h-6 text-neutral-700 cursor-pointer" onClick={() => setInputType("text")} />
            ) : (
              <EyeSlashIcon className="w-6 h-6 text-neutral-700 cursor-pointer" onClick={() => setInputType("password")} />
            )}
          </div>
        </div>
      </div>
      <div>
        <label
          htmlFor="repeat-password"
          className={twMerge(clsx("block text-sm font-medium leading-6 text-gray-900", { "text-red-600": !doesPasswordsMatch }))}
        >
          Repeat Password <Star />
        </label>
        <div className="mt-2 relative">
          <input
            id="repeat-password"
            name="repeat-password"
            type={inputType}
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
            autoComplete="current-password"
            className={twMerge(
              clsx(
                "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1",
                "ring-inset ring-gray-300",
                "placeholder:text-gray-400",
                "focus:ring-2 focus:ring-inset focus:ring-light-green",
                "sm:text-sm sm:leading-6",
                { "ring-red-600 focus:ring-red-600": !doesPasswordsMatch }
              )
            )}
          />
          <div className="absolute h-full top-0 right-2 flex items-center">
            {inputType === "password" ? (
              <EyeIcon className="w-6 h-6 text-neutral-700 cursor-pointer" onClick={() => setInputType("text")} />
            ) : (
              <EyeSlashIcon className="w-6 h-6 text-neutral-700 cursor-pointer" onClick={() => setInputType("password")} />
            )}
          </div>
        </div>
        {!doesPasswordsMatch ? (
          <p id="passwords-dont-match" role="alert" aria-live="polite" className="text-red-600 text-xs text-right">
            Password must match
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="firstname" className="block text-sm font-medium leading-6 text-gray-900">
          First name <Star />
        </label>
        <div className="mt-2 relative">
          <input
            id="firstname"
            name="firstname"
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
            className={clsx(
              "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1",
              "ring-inset ring-gray-300",
              "placeholder:text-gray-400",
              "focus:ring-2 focus:ring-inset focus:ring-light-green",
              "sm:text-sm sm:leading-6"
            )}
          />
        </div>
      </div>

      <div>
        <label htmlFor="lastname" className="block text-sm font-medium leading-6 text-gray-900">
          Last name <Star />
        </label>
        <div className="mt-2 relative">
          <input
            id="lastname"
            name="lastname"
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
            className={clsx(
              "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1",
              "ring-inset ring-gray-300",
              "placeholder:text-gray-400",
              "focus:ring-2 focus:ring-inset focus:ring-light-green",
              "sm:text-sm sm:leading-6"
            )}
          />
        </div>
      </div>

      <div>
        <div className="flex items-start">
          <input
            id="optInMarketing"
            name="optInMarketing"
            type="checkbox"
            checked={optInMarketing}
            onChange={(e) => setOptInMarketing(e.target.checked)}
            className={clsx(
              "mr-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1",
              "ring-inset ring-gray-300",
              "placeholder:text-gray-400",
              "focus:ring-2 focus:ring-inset focus:ring-light-green",
              "sm:text-sm sm:leading-6"
            )}
          />
          <label htmlFor="optInMarketing" className="text-sm font-medium leading-6 text-gray-900 cursor-pointer">
            Do you want to receive information about products?
          </label>
        </div>

        <div className="flex items-start">
          <input
            id="condition-generales"
            name="condition-generales"
            type="checkbox"
            checked={optInSell}
            onChange={(e) => setOptInSell(e.target.checked)}
            required
            className={clsx(
              "mr-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1",
              "ring-inset ring-gray-300",
              "placeholder:text-gray-400",
              "focus:ring-2 focus:ring-inset focus:ring-light-green",
              "sm:text-sm sm:leading-6"
            )}
          />
          <label htmlFor="condition-generales" className="text-sm font-medium leading-6 text-gray-900 cursor-pointer">
            J’ai lu et j’accepte les{" "}
            <Link href="/conditions-generales-de-vente" target="_blank" className="text-green underline">
              conditions générales
            </Link>{" "}
            <Star />
          </label>
        </div>
      </div>
      <div>
        <SubmitButton isDisabled={!email || !password || !firstname || !lastname || !optInSell} text="Sign in" />
      </div>
    </form>
  );
}
