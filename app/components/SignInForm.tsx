"use client";

import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { v4 as uuid } from "uuid";

import SubmitButton from "@/app/components/SubmitButton";
import { login } from "@/app/actions";
import { useAuth } from "@/app/context/authContext";
import { useAlerts } from "@/app/context/alertsContext";
import { isUserDataAPIResponse } from "@/app/utils/typeGuardsFunctions";

const initialState = {
  email: "",
  password: "",
};

export default function SignInForm() {
  const [inputType, setInputType] = useState<"password" | "text">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // @ts-ignore
  const [state, formAction, isPending] = useFormState(login, initialState);

  const { setUserData } = useAuth();
  const { addAlert } = useAlerts();

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log(isUserDataAPIResponse(state.data));
    // Deal with 200 status
    if (state.isSuccess && isUserDataAPIResponse(state.data) && state.data && state.statusCode === 200) {
      console.log("In here");
      const redirect = searchParams.get("redirect");

      setUserData(state.data);
      localStorage.setItem("accessToken", state.data.accessToken);
      localStorage.setItem("refreshToken", state.data.refreshToken);
      addAlert(uuid(), "You've successfully logged in", "Login successful", "emerald");

      router.push(redirect ? redirect : "/");
      // deal with status 401 (wrong password)
    } else if (!state.isSuccess && !state.data && state.statusCode === 401) {
      addAlert(uuid(), "Wrong email or password", "Error Login", "yellow");
      setPassword("");
      // deal with status 204 (user does not exist)
    } else if (state.isSuccess && state.statusCode === 204) {
      addAlert(uuid(), state.message, "No user found", "blue");
      router.push(`/inscription/?email=${email}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

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
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-light-green sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-100">
            Password
          </label>
          <div className="text-sm">
            <a href="#" className="font-semibold text-light-green">
              Forgot password?
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
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-light-green sm:text-sm sm:leading-6"
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
        <SubmitButton isDisabled={!email || !password} text="Sign in" />
      </div>
    </form>
  );
}
