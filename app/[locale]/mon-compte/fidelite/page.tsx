"use client";

import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";

import { useAuth } from "@/app/context/authContext";
import { useAlerts } from "@/app/context/alertsContext";
import { v4 as uuid } from "uuid";
import Title from "@/app/components/Title";
import { buttonClassname, subtleSectionWrapperClassname } from "@/app/staticData/cartPageClasses";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const PointsSection: React.FC = () => {
  const t = useTranslations("");
  const { userData } = useAuth();
  const { addAlert } = useAlerts();

  const handleCopy = () => {
    if (!userData?.referralToken) return;
    // TODO: Verify referral link structure
    const referralLink = `https://www.monplancbd.fr/mon-compte-mon-plan-cbd/?referral=${userData.referralToken}`;
    navigator.clipboard.writeText(referralLink).then(
      () => {
        addAlert(uuid(), t("alerts.referral.copy.success.text"), t("alerts.referral.copy.success.title"), "emerald");
      },
      () => {
        addAlert(uuid(), t("alerts.referral.copy.error.text"), t("alerts.referral.copy.error.title"), "red");
      }
    );
  };

  const infoBoxClassname = twMerge(
    "border border-gray-200 bg-white rounded-lg p-4 sm:p-6 shadow-sm",
    "flex flex-col items-center justify-center text-center",
    "min-h-[160px] sm:min-h-[180px]"
  );

  if (!userData) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[300px]">
        <LoadingSpinner size="lg" color="green" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Title
        title={t("account.loyaltyPage.mainTitle")}
        type="h1"
        classname={`relative mb-8 text-center uppercase text-xl text-green font-bold tracking-widest`}
        firstLetterClassname="text-4xl"
      />

      <div className="space-y-10 xl:space-y-12">
        <section className={twMerge(subtleSectionWrapperClassname, "text-center")}>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">{t("account.loyaltyPage.balanceTitle")}</h2>
          <p className="font-bold text-4xl text-green mb-1">
            {userData.loyaltyPoints ?? 0}
            <span className="text-2xl font-medium text-gray-600 ml-1">{t(userData.loyaltyPoints === 1 ? "pointsSingular" : "pointsPlural")}</span>
          </p>
          <p className="text-xs text-gray-500">{t("account.loyaltyPage.cartPointsInfo")}</p>
        </section>

        {/* How to Earn Section */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6 text-gray-900">{t("account.loyaltyPage.howToEarnTitle")}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            <div className={infoBoxClassname}>
              <h3 className="text-base font-semibold text-gray-800 mb-2">{t("account.loyaltyPage.boxes.box1.title")}</h3>
              <p className="text-sm text-gray-600">{t("account.loyaltyPage.boxes.box1.description")}</p>
            </div>
            <div className={infoBoxClassname}>
              <h3 className="text-base font-semibold text-gray-800 mb-2">{t("account.loyaltyPage.boxes.box2.title")}</h3>
              <p className="text-sm text-gray-600">{t("account.loyaltyPage.boxes.box2.description")}</p>
            </div>
            <div className={infoBoxClassname}>
              <h3 className="text-base font-semibold text-gray-800 mb-2">{t("account.loyaltyPage.boxes.box3.title")}</h3>
              <p className="text-sm text-gray-600">{t("account.loyaltyPage.boxes.box3.description")}</p>
            </div>
          </div>
        </section>

        {/* Referral Section */}
        {userData.referralToken && (
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6 text-gray-900">{t("account.loyaltyPage.referralTitle")}</h2>
            {/* Referral boxes */}
            <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-2 lg:max-w-3xl lg:mx-auto sm:gap-6">
              <div className={infoBoxClassname}>
                <h3 className="text-base font-semibold text-gray-800 mb-2">{t("account.loyaltyPage.boxes.box4.title")}</h3>
                <p className="text-sm text-gray-600">{t("account.loyaltyPage.boxes.box4.description")}</p>
              </div>
              <div className={infoBoxClassname}>
                <h3 className="text-base font-semibold text-gray-800 mb-2">{t("account.loyaltyPage.boxes.box5.title")}</h3>
                <p className="text-sm text-gray-600">{t("account.loyaltyPage.boxes.box5.description")}</p>
              </div>
            </div>

            {/* Referral Link Display and Copy */}
            <div className={twMerge(subtleSectionWrapperClassname, "text-center")}>
              <p className="text-sm text-gray-700 mb-3">{t("account.loyaltyPage.referralFooterText")}</p>
              <div className="flex justify-center">
                <div className="flex w-full max-w-md border border-gray-300 rounded-md shadow-sm overflow-hidden">
                  <input
                    type="text"
                    readOnly
                    value={`https://www.monplancbd.fr/mon-compte-mon-plan-cbd/?referral=${userData.referralToken}`} // TODO: Verify URL structure
                    className="flex-grow border-0 p-2 text-sm text-gray-600 bg-gray-50 focus:ring-0"
                    aria-label={t("account.loyaltyPage.referralLinkLabel")}
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    title={t("account.loyaltyPage.referralCopyTitle")}
                    className={twMerge(buttonClassname, "rounded-l-none px-3 inline-flex items-center")}
                  >
                    <ClipboardDocumentIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">{t("account.loyaltyPage.referralCopyTitle")}</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default PointsSection;
