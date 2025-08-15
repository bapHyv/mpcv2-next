// File: app/components/TrustpilotScore.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { StarIcon } from "@heroicons/react/20/solid";
import { useSse } from "@/app/context/sseContext";
import { useLocale, useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";

// Skeleton component for the loading state
const TrustpilotSkeleton = () => (
  <div className="w-full max-w-sm mx-auto animate-pulse">
    <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200" />
      <div className="flex-grow space-y-2">
        <div className="flex items-center gap-1">
          <div className="h-4 w-4 rounded-full bg-gray-200" />
          <div className="h-4 w-4 rounded-full bg-gray-200" />
          <div className="h-4 w-4 rounded-full bg-gray-200" />
          <div className="h-4 w-4 rounded-full bg-gray-200" />
          <div className="h-4 w-4 rounded-full bg-gray-200" />
        </div>
        <div className="h-3 w-3/4 rounded-md bg-gray-200" />
      </div>
    </div>
  </div>
);

export default function TrustpilotScore() {
  const t = useTranslations("homepage");
  const locale = useLocale();
  const { sseData } = useSse();
  const trustpilotData = sseData?.trustpilot;

  // Show skeleton while data is not yet available
  if (!trustpilotData) {
    return <TrustpilotSkeleton />;
  }

  const score = parseFloat(trustpilotData.score);
  const reviewsCount = parseInt(trustpilotData.reviewsCnt, 10);

  // Handle cases where data might be invalid
  if (isNaN(score) || isNaN(reviewsCount)) {
    return null; // Or return the skeleton
  }

  return (
    <Link
      href="https://fr.trustpilot.com/review/monplancbd.fr?utm_medium=trustbox&utm_source=widget"
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full max-w-sm mx-auto group"
      aria-label={t("trustpilotAriaLabel", { score: score, count: reviewsCount })}
    >
      <div
        className={twMerge(
          "flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm",
          "transition-all duration-150 ease-in-out group-hover:shadow-md group-hover:border-gray-300"
        )}
      >
        <Image src="/trustpilot.png" alt={t("trustpilotAlt")} width={40} height={40} className="flex-shrink-0" />
        <div className="flex-grow">
          <div className="flex items-center">
            {/* Render Stars based on score */}
            {Array.from({ length: 5 }).map((_, index) => (
              <StarIcon
                key={index}
                className={twMerge("h-5 w-5", index < Math.round(score) ? "text-[#00b67a]" : "text-gray-300")}
                aria-hidden="true"
              />
            ))}
          </div>
          <p className="text-sm text-gray-700 mt-1">
            <span className="font-semibold text-gray-900">{t("trustpilotScore")}</span>{" "}
            <span className="text-[#00b67a] font-semibold"> {score.toFixed(1)}</span> {t("trustpilotOutOf")} 5, {t("trustpilotBasedOn")}{" "}
            <span className="font-semibold text-gray-900">
              {new Intl.NumberFormat(locale).format(reviewsCount)} {t("reviews")}
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}
