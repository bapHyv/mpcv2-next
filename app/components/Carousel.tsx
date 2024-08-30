"use client";

import { useRef } from "react";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/20/solid";

interface Props {
  children: JSX.Element[];
}

export default function Carousel({ children }: Props) {
  const divRef = useRef<HTMLDivElement | null>(null);

  const scrollRight = () => {
    divRef.current?.scrollTo({
      left: divRef.current.scrollLeft + 500,
      behavior: "smooth",
    });
  };

  const scrollLeft = () => {
    divRef.current?.scrollTo({
      left: divRef.current.scrollLeft - 500,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative px-2 sm:px-8 xl:px-16">
      <div
        ref={divRef}
        className={`flex gap-2 p-2 sm:gap-3 sm:p-3 overflow-x-scroll w-full rounded-md no-scrollbar
          shadow-carousel dark:shadow-carousel-dark 
          bg-neutral-200 dark:bg-none
          `}
      >
        {children}
      </div>
      <ArrowLeftCircleIcon
        onClick={scrollLeft}
        className={`hidden sm:flex absolute cursor-pointer sm:items-center sm:justify-center z-10 
             left-2 top-1/2 bg-green text-white h-8 w-8 sm:h-9 sm:w-9 rounded-full -translate-y-1/2`}
      />
      <ArrowRightCircleIcon
        onClick={scrollRight}
        className={`hidden sm:flex absolute cursor-pointer sm:items-center sm:justify-center z-10 
             right-2 top-1/2 bg-green text-white h-8 w-8 sm:h-9 sm:w-9 rounded-full -translate-y-1/2`}
      />
    </div>
  );
}
