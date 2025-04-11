import { twMerge } from "tailwind-merge";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { buttonClassname } from "@/app/staticData/cartPageClasses";

interface Props {
  text: string;
  isPending?: boolean;
  isDisabled?: boolean;
  className?: string;
  type?: "submit" | "button";
}

export default function SubmitButton({ text, isPending = false, isDisabled = false, className, type = "submit" }: Props) {
  return (
    <button
      type={type}
      className={twMerge(buttonClassname, "w-full flex justify-center", className)}
      disabled={isPending || isDisabled}
      aria-disabled={isPending || isDisabled}
    >
      {isPending ? (
        <>
          <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" aria-hidden="true" />
          Traitement...
        </>
      ) : (
        text
      )}
    </button>
  );
}
