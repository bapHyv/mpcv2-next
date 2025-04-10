import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function QuantitySelector() {
  return (
    <div className="relative flex items-center w-4/12 border border-neutral-300 rounded-s-lg rounded-e-lg">
      <span className="sr-only">Decrement quantity button</span>
      <button
        type="button"
        className={clsx(
          "w-1/3 bg-neutral-100 flex items-center justify-center rounded-s-lg p-1 border border-neutral-300",
          "hover:bg-neutral-200",
          "focus:ring-blue-500 focus:border-blue-500 focus:ring-2 focus:outline-none"
        )}
      >
        <MinusIcon className="w-4 h-4 text-neutral-900" />
      </button>
      <span className="sr-only">Product quantity button</span>
      <div
        id="quantity-input"
        aria-describedby="helper-text-explanation"
        className={clsx(
          "w-1/3 flex items-center justify-center text-md h-full border-x-0 border-neutral-300 text-neutral-900",
          "focus:ring-blue-500 focus:border-blue-500"
        )}
      >
        10
      </div>
      <span className="sr-only">Increment quantity button</span>
      <button
        type="button"
        className={clsx(
          "w-1/3 bg-neutral-100 flex items-center justify-center rounded-e-lg p-1",
          "hover:bg-neutral-200 border border-neutral-300",
          "focus:ring-blue-500 focus:border-blue-500 focus:ring-2 focus:outline-none"
        )}
      >
        <PlusIcon className="w-4 h-4 text-neutral-900" />
      </button>
    </div>
  );
}
