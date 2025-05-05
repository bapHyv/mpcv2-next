"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";
import { XMarkIcon } from "@heroicons/react/24/solid";

import { useConsent } from "@/app/context/consentContext";
import { ConsentCategory } from "@/app/utils/consent";
import { buttonClassname } from "@/app/staticData/cartPageClasses";
import { disableBodyScroll, enableBodyScroll } from "@/app/utils/bodyScroll";
import LoadingSpinner from "@/app/components/LoadingSpinner";

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ConsentCategoryDetail {
  key: ConsentCategory;
  titleKey: string;
  descriptionKey: string;
  disabled?: boolean;
}

export default function CookiePreferencesModal() {
  const { consentState, setConsent, isLoadingConsent } = useConsent();
  const t = useTranslations("cookieConsent");

  const [isOpen, setIsOpen] = useState(false);
  const [localPreferences, setLocalPreferences] = useState(consentState);

  useEffect(() => {
    if (!isLoadingConsent) {
      setLocalPreferences(consentState);
    }
  }, [consentState, isLoadingConsent]);

  useEffect(() => {
    if (isOpen) {
      disableBodyScroll();
    } else {
      enableBodyScroll();
    }
    return () => enableBodyScroll();
  }, [isOpen]);

  const handleToggle = (category: ConsentCategory) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSaveChanges = () => {
    (Object.keys(localPreferences) as ConsentCategory[]).forEach((key) => {
      setConsent(key, localPreferences[key]);
    });
    setIsOpen(false);
  };

  const categories: ConsentCategoryDetail[] = [
    // {
    //   key: "necessary",
    //   titleKey: "necessaryTitle",
    //   descriptionKey: "necessaryDescription",
    //   disabled: true,
    // },
    {
      key: "functional",
      titleKey: "functionalTitle",
      descriptionKey: "functionalDescription",
    },
    {
      key: "analytics",
      titleKey: "analyticsTitle",
      descriptionKey: "analyticsDescription",
    },
  ];

  return (
    // Modal backdrop and container
    <>
      <li>
        <button
          type="button"
          className="text-sm leading-6 text-gray-300 hover:text-white underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white rounded"
          onClick={() => setIsOpen(true)}
        >
          {t("cookiePreferencesLink")}
        </button>
      </li>
      {!isOpen ? null : isLoadingConsent ? (
        <div className="fixed inset-0 z-[9995] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-lg mx-auto relative text-center">
            <LoadingSpinner />
          </div>
        </div>
      ) : (
        <div
          className="fixed inset-0 z-[9995] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
          onMouseDown={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-prefs-title"
        >
          <div
            className="bg-white rounded-lg p-6 sm:p-8 shadow-xl w-full max-w-lg mx-auto relative transform transition-all duration-300 ease-in-out overflow-y-auto max-h-[90vh]"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <h2 id="cookie-prefs-title" className="text-xl font-semibold text-gray-900">
                {t("modalTitle")}
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green rounded-md"
                aria-label={t("closeButtonAriaLabel")}
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Consent Categories */}
            <div className="space-y-5">
              {/* General Info Text */}
              <p className="text-sm text-gray-600">{t("modalDescription")}</p>

              {/* Category Toggles */}
              {categories.map((category) => (
                <div key={category.key} className="flex items-start justify-between gap-4">
                  <div className="flex-grow pr-4">
                    <h3 className="font-medium text-gray-800">{t(category.titleKey)}</h3>
                    <p className="text-xs text-gray-500 mt-1">{t(category.descriptionKey)}</p>
                  </div>
                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => !category.disabled && handleToggle(category.key)}
                    disabled={category.disabled}
                    role="switch"
                    aria-checked={category.disabled || localPreferences[category.key]}
                    className={twMerge(
                      "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                      "focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2",
                      category.disabled || localPreferences[category.key] ? "bg-green" : "bg-gray-200",
                      category.disabled ? "cursor-not-allowed opacity-50" : ""
                    )}
                  >
                    <span className="sr-only">{t(category.titleKey)}</span>
                    <span
                      aria-hidden="true"
                      className={twMerge(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        category.disabled || localPreferences[category.key] ? "translate-x-5" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="mt-8 pt-5 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={twMerge(buttonClassname, "order-2 sm:order-1", "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50")}
              >
                {t("cancelButton")}
              </button>
              <button type="button" onClick={handleSaveChanges} className={twMerge(buttonClassname, "order-1 sm:order-2")}>
                {t("saveButton")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
