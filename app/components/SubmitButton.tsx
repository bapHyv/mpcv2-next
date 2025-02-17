"use client";

import clsx from "clsx";
import { useEffect } from "react";
import { useFormStatus } from "react-dom";
import { twMerge } from "tailwind-merge";

export default function SubmitButton({ text, buttonClassName }: { text: string; buttonClassName?: string }) {
  const { pending, data } = useFormStatus();

  useEffect(() => {
    if (data && data.get("password") && data.get("repeat-password")) {
      console.log(data.get("password"));
      console.log(data.get("repeat-password"));
    }
  }, [data]);

  return (
    <button
      type="submit"
      disabled={pending}
      className={twMerge(
        clsx(
          "flex w-full justify-center rounded-md bg-light-green px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:ring-1",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green",
          "disabled:bg-neutral-400 disabled:cursor-not-allowed",
          buttonClassName
        )
      )}
    >
      {text}
    </button>
  );
}
