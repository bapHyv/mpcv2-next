"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { twMerge } from "tailwind-merge";

import { hasConsentBeenSet, setAllConsent } from "@/app/utils/consent";
import { buttonClassname, linkClassname } from "@/app/staticData/cartPageClasses";

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const t = useTranslations("cookieConsent");
  const locale = useLocale();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!hasConsentBeenSet()) {
        setShowBanner(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    setAllConsent(true);
    setShowBanner(false);
    // Optional: Reload or trigger state update if components need immediate reaction
    // window.location.reload(); // Could be too disruptive
    // Or dispatch a custom event if using event listener approach
  };

  const handleRejectAll = () => {
    setAllConsent(false);
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t("bannerAriaLabel")}
      aria-describedby="cookie-consent-description"
      className={twMerge("fixed bottom-0 left-0 right-0 z-[11000]", "bg-black text-white", "p-4 md:p-5", "shadow-lg border-t border-gray-700")}
    >
      <div className="container mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Text Content */}
        <div className="text-sm md:flex-grow md:mr-6">
          <p id="cookie-consent-description">
            {/* Use dangerouslySetInnerHTML if your translation includes the link directly */}
            {t("description")}{" "}
            <Link href="/politique-cookies" className={linkClassname}>
              {t("link")}
            </Link>
            .
          </p>
        </div>

        {/* Buttons */}
        <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3 md:gap-4 items-center">
          <button
            type="button"
            onClick={handleRejectAll}
            className={twMerge(buttonClassname, "w-full sm:w-auto", "bg-gray-600 hover:bg-gray-500 focus:ring-gray-500")}
          >
            {t("rejectAllButton")}
          </button>
          <button type="button" onClick={handleAcceptAll} className={twMerge(buttonClassname, "w-full sm:w-auto")}>
            {t("acceptAllButton")}
          </button>
          {/* Optional Customize Button - Placeholder for now */}
          {/* <button
            type="button"
            // onClick={openPreferencesModal} // Add this later
            className={twMerge(
              buttonClassname,
              "w-full sm:w-auto",
              "bg-transparent border border-gray-400 text-gray-300 hover:bg-gray-700"
            )}
          >
            {t("customizeButton")}
          </button> */}
        </div>
      </div>
    </div>
  );
}
