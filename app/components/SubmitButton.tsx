"use client";

import clsx from "clsx";
import { useFormStatus } from "react-dom";
import { twMerge } from "tailwind-merge";

interface Params {
  text: string;
  isDisabled: boolean;
  buttonClassName?: string;
}

export default function SubmitButton({ text, isDisabled, buttonClassName }: Params) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || isDisabled}
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
