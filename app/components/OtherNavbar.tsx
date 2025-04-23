import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export default function OtherNavbar({ children, className }: { children: JSX.Element[]; className?: string }) {
  return (
    <div
      className={twMerge(
        clsx(
          "fixed z-[6000] bottom-[56px] bg-black px-5",
          "flex items-center h-12 w-full max-w-[1920px] mx-auto",
          "overflow-x-scroll no-scrollbar",
          "md:top-[80px] md:bottom-auto md:h-14 md:px-5 md:gap-x-6 lg:gap-x-8",
          className
        )
      )}
    >
      {children}
    </div>
  );
}
