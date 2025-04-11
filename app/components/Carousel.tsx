"use client";

import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

import Separator from "@/app/components/Separator"; // Keep separator import
import { buttonClassname } from "@/app/staticData/cartPageClasses";

interface Props {
  children: React.ReactElement[];
  length: number;
}

export default function Carousel({ children, length }: Props) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    const checkIsPhone = () => {
      if (typeof window !== "undefined") {
        setIsPhone(window.innerWidth < 640);
      }
    };
    checkIsPhone();
    window.addEventListener("resize", checkIsPhone);
    return () => window.removeEventListener("resize", checkIsPhone);
  }, []);

  const calculateCardWidthWithGap = (): number => {
    if (divRef.current?.firstElementChild) {
      // Check firstElementChild instead of childNodes
      const cardElement = divRef.current.firstElementChild as HTMLElement;
      const styles = window.getComputedStyle(divRef.current); // Styles of the container
      const gap = parseFloat(styles.gap) || 0; // Get gap value, default 0 if undefined/invalid
      return cardElement.offsetWidth + gap;
    }
    return 336 + 16;
  };

  const scrollRight = () => {
    if (divRef.current) {
      const container = divRef.current;
      const scrL = container.scrollLeft;
      const cardWidthWithGap = calculateCardWidthWithGap();
      if (cardWidthWithGap <= 0) return; // Exit if calculation failed

      // Calculate the target scroll position to align with the next card edge
      const targetScrollLeft = Math.ceil((scrL + 1) / cardWidthWithGap) * cardWidthWithGap;

      container.scrollTo({
        left: Math.min(targetScrollLeft, container.scrollWidth - container.clientWidth),
        behavior: "smooth",
      });
    }
  };

  const scrollLeft = () => {
    if (divRef.current) {
      const container = divRef.current;
      const scrL = container.scrollLeft;
      const cardWidthWithGap = calculateCardWidthWithGap();
      if (cardWidthWithGap <= 0) return; // Exit if calculation failed

      // Calculate the target scroll position to align with the previous card edge
      const targetScrollLeft = Math.floor((scrL - 1) / cardWidthWithGap) * cardWidthWithGap;

      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full max-w-full overflow-hidden">
      <div className={clsx("mx-auto", "w-[344px]", "sm:w-[624px]", "lg:w-[812px]", "xl:w-[1216px]", "3xl:w-[1620px] snap-start")}>
        <div
          ref={divRef}
          className={clsx("flex bg-gray-50 gap-1 p-1 rounded-lg overflow-x-scroll no-scrollbar", "scroll-smooth snap-x snap-mandatory")}
        >
          {/* Ensure each child has snap-align-start */}
          {React.Children.map(children, (child) => React.cloneElement(child as React.ReactElement, { className: twMerge(child.props.className) }))}
        </div>
      </div>
      {/* --- Navigation Controls --- */}
      {length > 1 && // Only show controls if more than one item
        (isPhone ? (
          // Phone Arrows (Positioned below)
          <div
            className={clsx(
              "relative mx-auto mt-3 h-10", // Height container for arrows
              "w-[336px]" // Match smallest card width for alignment
              // Adjust width to match the scroll container's mobile width if needed: "w-[344px]"
            )}
          >
            {/* Left Arrow */}
            <button
              type="button"
              onClick={scrollLeft}
              aria-label="Previous slide"
              className={twMerge(
                buttonClassname, // Base button styles
                "absolute left-0 top-1/2 -translate-y-1/2 rounded-full !p-1", // Override padding, ensure round
                "bg-white/80 backdrop-blur-sm border border-gray-300 !text-gray-700 hover:!bg-white hover:!text-green focus:!ring-green" // Custom styling
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
                "absolute right-0 top-1/2 -translate-y-1/2 rounded-full !p-1", // Override padding, ensure round
                "bg-white/80 backdrop-blur-sm border border-gray-300 !text-gray-700 hover:!bg-white hover:!text-green focus:!ring-green" // Custom styling
              )}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        ) : (
          // Desktop Bullets
          <Bullets length={length} divRef={divRef} />
        ))}
      {/* Separator remains outside the main logic */}
      {/* <Separator /> */} {/* Consider if separator is needed here or outside carousel component usage */}
    </div>
  );
}

// --- Bullets Component (Styled) ---
interface PropsBullets {
  length: number;
  divRef: MutableRefObject<HTMLDivElement | null>;
}

function Bullets({ length, divRef }: PropsBullets) {
  const [bullets, setBullets] = useState(0);
  const [index, setIndex] = useState(0); // Current page index
  const [cardsPerPage, setCardsPerPage] = useState(3); // Default (adjust based on breakpoints)
  // Removed isClient state

  // --- Effect for calculating bullets and pages ---
  useEffect(() => {
    const calculateLayout = () => {
      if (typeof window !== "undefined" && divRef.current?.firstElementChild) {
        const containerWidth = divRef.current.clientWidth;
        const cardElement = divRef.current.firstElementChild as HTMLElement;
        const styles = window.getComputedStyle(divRef.current);
        const gap = parseFloat(styles.gap) || 0;
        const cardWidthWithGap = cardElement.offsetWidth + gap;

        // Calculate how many cards fit - account for potential fractional visibility
        const calculatedCardsPerPage = Math.max(1, Math.floor(containerWidth / cardWidthWithGap));
        setCardsPerPage(calculatedCardsPerPage);
        setBullets(Math.ceil(length / calculatedCardsPerPage));

        // Update current index based on scroll position
        const currentScroll = divRef.current.scrollLeft;
        const calculatedIndex = Math.round(currentScroll / (cardWidthWithGap * calculatedCardsPerPage));
        setIndex(calculatedIndex);
      }
    };

    calculateLayout(); // Initial calculation
    window.addEventListener("resize", calculateLayout);

    // Add scroll listener to update active bullet
    const scrollContainer = divRef.current;
    const handleScroll = () => {
      if (scrollContainer?.firstElementChild) {
        const cardElement = scrollContainer.firstElementChild as HTMLElement;
        const styles = window.getComputedStyle(scrollContainer);
        const gap = parseFloat(styles.gap) || 0;
        const cardWidthWithGap = cardElement.offsetWidth + gap;
        const calculatedCardsPerPage = Math.max(1, Math.floor(scrollContainer.clientWidth / cardWidthWithGap)); // Recalculate just in case
        const currentScroll = scrollContainer.scrollLeft;
        const calculatedIndex = Math.round(currentScroll / (cardWidthWithGap * calculatedCardsPerPage));
        setIndex(calculatedIndex);
      }
    };
    scrollContainer?.addEventListener("scroll", handleScroll, { passive: true });

    // Initial scroll reset (optional, might interfere with linking to specific items)
    // setIndex(0);
    // divRef.current?.scrollTo({ left: 0, behavior: "auto" });

    return () => {
      window.removeEventListener("resize", calculateLayout);
      scrollContainer?.removeEventListener("scroll", handleScroll);
    };
  }, [length, divRef]); // Rerun if length or ref changes

  // --- Click Handler for Bullets ---
  const handleClick = (bulletIndex: number) => {
    if (divRef.current?.firstElementChild) {
      const cardElement = divRef.current.firstElementChild as HTMLElement;
      const styles = window.getComputedStyle(divRef.current);
      const gap = parseFloat(styles.gap) || 0;
      const cardWidthWithGap = cardElement.offsetWidth + gap;

      // Calculate scroll amount based on target page index and cards per page
      const scrollAmount = cardWidthWithGap * cardsPerPage * bulletIndex;

      // Update index state immediately for visual feedback
      setIndex(bulletIndex);

      divRef.current?.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Don't render if only one page/bullet needed
  if (bullets <= 1) {
    return null;
  }

  // --- Render Bullets ---
  return (
    // Consistent vertical margin, centered horizontally
    <div className="my-6 flex justify-center">
      {/* Use flex with gap for spacing */}
      <div className="flex items-center justify-center gap-2.5">
        {" "}
        {/* Adjusted gap */}
        {new Array(bullets).fill(0).map((_, i) => (
          <button // Use button for accessibility
            key={`${i}-bullet`}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index ? "true" : "false"}
            className={twMerge(
              "h-2.5 w-2.5 rounded-full transition-colors duration-150 ease-in-out", // Base size, shape, transition
              i === index ? "bg-green scale-110" : "bg-gray-300 hover:bg-gray-400", // Active vs Inactive/Hover
              "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green" // Focus style
            )}
            onClick={() => handleClick(i)}
          />
        ))}
      </div>
    </div>
  );
}
