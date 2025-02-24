"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/app/context/authContext";

const PointsSection: React.FC = () => {
  const t = useTranslations("loyalty");

  const { userData } = useAuth();
  const [inputValue, setInputValue] = useState(`https://www.monplancbd.fr/mon-compte-mon-plan-cbd/?referral=${userData?.referralToken}`);

  const handleCopy = () => {
    navigator.clipboard.writeText(inputValue).then(
      () => {
        alert("Copied to clipboard!"); // Optional feedback for the user
      },
      () => {
        alert("Failed to copy!");
      }
    );
  };

  return (
    <>
      {/* Loyalty Points Section */}
      <section className="bg-light-green text-white py-10 px-5 text-center">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl mb-2">
            {t("title")}{" "}
            <span className="font-bold text-3xl">
              {userData?.loyaltyPoints} {t("points")}
            </span>
          </h2>
          <h3 className="text-xl">{t("howToEarn")}</h3>
        </div>

        {/* Boxes */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-center align-center">
          {/* Box 1 */}
          <div className="border-white border-2 rounded-lg w-72 h-64 flex flex-col justify-center items-center p-5">
            <h4 className="text-lg text-center mb-3">{t("boxes.box1.title")}</h4>
            <p className="text-sm text-center">
              <strong>{t("boxes.box1.description")}</strong>
            </p>
          </div>

          {/* Box 2 */}
          <div className="border-white border-2 rounded-lg w-72 h-64 flex flex-col justify-center items-center p-5">
            <h4 className="text-lg text-center mb-9">{t("boxes.box2.title")}</h4>
            <p className="text-sm text-center">
              <strong>{t("boxes.box2.description")}</strong>
            </p>
          </div>

          {/* Box 3 */}
          <div className="border-white border-2 rounded-lg w-72 h-64 flex flex-col justify-center items-center p-5">
            <h4 className="text-lg text-center mb-16">{t("boxes.box3.title")}</h4>
            <p className="text-sm text-center">
              <strong>{t("boxes.box3.description")}</strong>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-sm">
          <strong>{t("cartPoints")}</strong>
        </p>
      </section>

      {/* Referral Section */}
      <section className="bg-white text-teal-600 py-10 px-5 text-center">
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-2">{t("referral.title")}</h3>
          <p className="text-sm">{t("referral.description")}</p>
        </div>

        {/* Referral Link */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          {/* Input Box */}
          <input
            type="text"
            readOnly
            value={`https://www.monplancbd.fr/mon-compte-mon-plan-cbd/?referral=${userData?.referralToken}`}
            className="w-full md:w-2/3 border border-teal-600 rounded-lg p-3 text-sm text-teal-600 focus:outline-none focus:ring focus:ring-teal-300"
          />

          {/* Copy Button */}
          <button onClick={handleCopy} className="bg-light-green text-white px-6 py-3 rounded-lg hover:bg-teal-700">
            {t("referral.copyButton")}
          </button>
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-sm text-teal-700">{t("referral.footerText")}</p>

        {/* Additional Boxes */}
        <div className="flex flex-col md:flex-row justify-center items-start gap-6 m-5">
          {/* Box 4 */}
          <div className="border-light-green border-2 rounded-lg w-72 h-64 flex flex-col justify-center items-center p-4">
            <h4 className="text-lg text-center mb-3">{t("boxes.box4.title")}</h4>
            <p className="text-sm text-center">
              <strong>{t("boxes.box4.description")}</strong>
            </p>
          </div>

          {/* Box 5 */}
          <div className="border-light-green border-2 rounded-lg w-72 h-64 flex flex-col justify-center items-center p-4">
            <h4 className="text-lg text-center mb-10">{t("boxes.box5.title")}</h4>
            <p className="text-sm text-center">
              <strong>{t("boxes.box5.description")}</strong>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default PointsSection;
