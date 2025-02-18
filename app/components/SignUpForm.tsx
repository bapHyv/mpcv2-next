"use client";

import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { v4 as uuid } from "uuid";

import SubmitButton from "@/app/components/SubmitButton";
import { register } from "@/app/actions";
import { useAuth } from "@/app/context/authContext";
import { useAlerts } from "@/app/context/alertsContext";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const initialState = {
  email: "",
  password: "",
  firstname: "",
  lastname: "",
  optInMarketing: false,
};

export default function SignUpForm() {
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

  // @ts-ignore
  const [state, formAction] = useFormState(register, initialState);

  const { setUserData } = useAuth();
  const { addAlert } = useAlerts();

  useEffect(() => {
    if (state.isSuccess && state.data) {
      const redirect = searchParams.get("redirect");

      setUserData(state.data);

      localStorage.setItem("accessToken", state.data.accessToken);
      localStorage.setItem("refreshToken", state.data.refreshToken);
      localStorage.setItem("userData", JSON.stringify(state.data));

      addAlert(uuid(), "You've successfully signed up", "Sign up successful", "emerald");

      router.push(redirect ? redirect : "/");
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
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-100">
          Email address
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
          <label htmlFor="password" className={twMerge(clsx("block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-100"))}>
            Password
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
          className={twMerge(
            clsx("block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-100", { "text-red-600": !doesPasswordsMatch })
          )}
        >
          Repeat Password
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
        <label htmlFor="firstname" className="block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-100">
          First name
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
        <label htmlFor="lastname" className="block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-100">
          Last name
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
        <label htmlFor="optInMarketing" className="text-sm font-medium leading-6 text-gray-900 dark:text-neutral-100 flex cursor-pointer">
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
          Do you want to receive information about products?
        </label>
      </div>
      <div>
        <SubmitButton isDisabled={!email || !password || !firstname || !lastname} text="Sign in" />
      </div>
    </form>
  );
}
