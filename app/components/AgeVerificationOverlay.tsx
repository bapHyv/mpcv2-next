"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";

import useCookies from "@/app/hooks/useCookies";
import Image from "next/image";
import { buttonClassname } from "@/app/staticData/cartPageClasses";

const AgeVerificationOverlay = () => {
  const t = useTranslations("ageVerification");
  const [showOverlay, setShowOverlay] = useState(false);
  const { addCookie } = useCookies();

  useEffect(() => {
    const isAgeVerified = document.cookie.includes("age_verified=true") || localStorage.getItem("age_verified") === "true";
    setShowOverlay(!isAgeVerified);
  }, []);

  const verifyAge = (isOfAge: boolean) => {
    if (isOfAge) {
      addCookie({ name: "age_verified", value: "true", options: { "Max-Age": 30 * 24 * 60 * 60 } });
      localStorage.setItem("age_verified", "true");
      setShowOverlay(false);
    } else {
      window.location.href = "https://www.google.com";
    }
  };

  if (!showOverlay) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex justify-center items-center p-4 z-[9999]">
      <div className="text-center bg-white p-6 sm:p-8 rounded-lg shadow-xl text-gray-900 max-w-md w-full">
        <Image alt="Logo monplancbd" width={50} height={50} src={`/canna-vert.png`} className="mx-auto mb-5 h-12 w-auto" />
        <h1 className="text-xl sm:text-2xl font-semibold mb-6">{t("title")}</h1>
        <div className="flex justify-center gap-x-4 sm:gap-x-6">
          <button onClick={() => verifyAge(false)} className={twMerge(buttonClassname, "bg-red-600 hover:bg-red-700 focus:ring-red-500 px-8")}>
            {t("noButton")}
          </button>
          <button onClick={() => verifyAge(true)} className={twMerge(buttonClassname, "px-8")}>
            {t("yesButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationOverlay;
