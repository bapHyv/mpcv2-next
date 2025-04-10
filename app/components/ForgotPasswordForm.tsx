"use client";

import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { v4 as uuid } from "uuid";

import SubmitButton from "@/app/components/SubmitButton";
import { forgottenPassword } from "@/app/actions";
import { useAlerts } from "@/app/context/alertsContext";
import { isUserDataAPIResponse } from "@/app/utils/typeGuardsFunctions";

const initialState = {
  email: "",
};

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");

  // @ts-ignore
  const [state, formAction, isPending] = useFormState(forgottenPassword, initialState);

  const { addAlert } = useAlerts();

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Deal with 200 status
    if (state.isSuccess && state.statusCode === 204) {
      const redirect = searchParams.get("redirect");

      addAlert(uuid(), "If your account exists, you have received an email with your new password.", "Email sent succcessfully", "emerald");

      router.push(redirect ? redirect : "/");
    } else if (!state.isSuccess && !state.data) {
      switch (state.statusCode) {
        // deal with status 401 (wrong password)
        case 409:
          addAlert(uuid(), "Wrong email. The user does not exist", "Warning", "yellow");
          break;
        case 500:
          addAlert(uuid(), "Error while trying to recover your password. Please try again later", "Error server", "red");
          break;
        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
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
      <div className="mt-6">
        <SubmitButton isDisabled={!email} text="Recevoir un email" />
      </div>
    </form>
  );
}
