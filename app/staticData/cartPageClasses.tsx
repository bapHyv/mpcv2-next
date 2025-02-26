import clsx from "clsx";

export const buttonClassname = clsx("px-2 py-0.5 bg-green rounded-md text-white", "disabled:bg-neutral-400 disabled:cursor-not-allowed");
export const sectionClassname = "mt-2 rounded-lg bg-neutral-100 p-3 sm:p-4 lg:col-span-5 lg:mt-4";
export const titleClassname = "relative mb-4 uppercase text-md text-green font-bold tracking-widest";
export const inputClassname = clsx(
  "sm:text-sm sm:leading-6 rounded-md border-0 py-0.5 text-gray-900 shadow-sm",
  "ring-1 ring-inset ring-gray-300 placeholder:text-gray-400",
  "focus:ring-1"
);
