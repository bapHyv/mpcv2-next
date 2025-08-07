"use client";

import clsx from "clsx";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { twMerge } from "tailwind-merge";

import { buttonClassname } from "@/app/staticData/cartPageClasses";

interface Props {
  scrollLeft: () => void;
  scrollRight: () => void;
}

export default function CarrouselButtons({ scrollLeft, scrollRight }: Props) {
  return (
    <div className={clsx("relative mx-auto mt-3 h-10", "w-[336px]")}>
      {/* Left Arrow */}
      <button
        type="button"
        onClick={scrollLeft}
        aria-label="Previous slide"
        className={twMerge(
          buttonClassname,
          "absolute left-0 top-1/2 -translate-y-1/2 rounded-full !p-1",
          "bg-white/80 backdrop-blur-sm border border-gray-300 !text-gray-700 hover:!bg-white hover:!text-green focus:!ring-green"
        )}
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      {/* Right Arrow */}
      <button
        type="button"
        onClick={scrollRight}
        aria-label="Next slide"
        className={twMerge(
          buttonClassname,
          "absolute right-0 top-1/2 -translate-y-1/2 rounded-full !p-1",
          "bg-white/80 backdrop-blur-sm border border-gray-300 !text-gray-700 hover:!bg-white hover:!text-green focus:!ring-green"
        )}
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
