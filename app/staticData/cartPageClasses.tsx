import clsx from "clsx";

export const buttonClassname = clsx(
  "inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green",
  "hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green",
  "disabled:bg-neutral-400 disabled:opacity-70 disabled:cursor-not-allowed"
);

export const inputClassname = clsx(
  "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm",
  "ring-1 ring-inset ring-gray-300 placeholder:text-gray-400",
  "focus:ring-1 focus:ring-inset focus:ring-green",
  "sm:text-sm sm:leading-6"
);

export const checkRadioClassname = clsx("h-4 w-4 rounded border-gray-300 text-green focus:ring-green");

export const titleClassname = "text-green text-center relative mb-4 uppercase text-md text-black font-bold tracking-widest";

export const sectionWrapperClassname = clsx("bg-white shadow rounded-lg p-4 sm:p-6 my-4 sm:my-6");
export const subtleSectionWrapperClassname = clsx("bg-gray-50 rounded-md p-4 sm:p-6 my-4 sm:my-6");

export const statusBadgeBase = clsx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium");

export const statusBadgePending = clsx(statusBadgeBase, "bg-orange-100 text-orange-800");
export const statusBadgeProcessing = clsx(statusBadgeBase, "bg-blue-100 text-blue-800");
export const statusBadgeOnHold = clsx(statusBadgeBase, "bg-yellow-100 text-yellow-800");
export const statusBadgeCompleted = clsx(statusBadgeBase, "bg-emerald-100 text-emerald-800");
export const statusBadgeCancelled = clsx(statusBadgeBase, "bg-gray-100 text-gray-800");
export const statusBadgeRefunded = clsx(statusBadgeBase, "bg-purple-100 text-purple-800");
export const statusBadgeFailed = clsx(statusBadgeBase, "bg-red-100 text-red-800");

export const labelClassname = clsx("block text-sm font-medium leading-6 text-gray-900");

export const linkClassname = clsx("font-semibold text-green hover:text-opacity-80");
