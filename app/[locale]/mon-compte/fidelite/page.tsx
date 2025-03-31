"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/app/context/authContext";
import { useAlerts } from "@/app/context/alertsContext";
import { v4 as uuid } from "uuid";

const PointsSection: React.FC = () => {
  const t = useTranslations("loyalty");

  const { userData } = useAuth();
  const { addAlert } = useAlerts();
  const handleCopy = () => {
    navigator.clipboard.writeText(`https://www.monplancbd.fr/mon-compte-mon-plan-cbd/?referral=${userData?.referralToken}`).then(
      () => {
        addAlert(
          uuid(),
          `https://www.monplancbd.fr/mon-compte-mon-plan-cbd/?referral=${userData?.referralToken} a été copié dans le presse papier`,
          "Lien de parrainage copier",
          "emerald"
        );
      },
      () => {
        addAlert(uuid(), `Quelque chose c'est mal passé`, "Erreur", "red");
      }
    );
  };

  return (
    <section>
      <h2 className="text-green text-center font-medium text-2xl my-4">Mon programme fidélité</h2>
      <div className="flex flex-col gap-y-10 xl:gap-y-16">
        {/* Loyalty Points Section */}
        <section>
          {/* Header */}
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl md:text-3xl font-medium text-center">{t("title")}</h2>
            <span className="font-bold text-3xl text-green">
              {userData?.loyaltyPoints} {t("points")}
            </span>
            <span className="text-xs md:text-sm italic text-neutral-500 text-center">
              <strong> ({t("cartPoints")})</strong>
            </span>
          </div>
        </section>

        <section className="flex flex-col gap-y-3">
          {/* Boxes */}
          <h2 className="text-2xl md:text-3xl font-medium text-center">{t("howToEarn")}</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-3 text-center align-center">
            {/* Box 1 */}
            <div className="border border-neutral-500 rounded-md w-72 h-40 flex flex-col justify-center items-center gap-y-3 p-2 shadow-md">
              <h4 className="text-lg text-center">{t("boxes.box1.title")}</h4>
              <p className="text-sm text-center">
                <strong className="text-green">{t("boxes.box1.description")}</strong>
              </p>
            </div>

            {/* Box 2 */}
            <div className="border border-neutral-500 rounded-md w-72 h-40 flex flex-col justify-center items-center gap-y-3 p-2 shadow-md">
              <h4 className="text-lg text-center">{t("boxes.box2.title")}</h4>
              <p className="text-sm text-center">
                <strong className="text-green">{t("boxes.box2.description")}</strong>
              </p>
            </div>

            {/* Box 3 */}
            <div className="border border-neutral-500 rounded-md w-72 h-40 flex flex-col justify-center items-center gap-y-3 p-2 shadow-md">
              <h4 className="text-lg text-center">{t("boxes.box3.title")}</h4>
              <p className="text-sm text-center">
                <strong className="text-green">{t("boxes.box3.description")}</strong>
              </p>
            </div>
          </div>
        </section>

        {/* Referral Section */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl md:text-3xl font-medium text-center">{t("referral.footerText")}</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-3">
            {/* Box 4 */}
            <div className="border border-neutral-500 rounded-md w-72 h-40 flex flex-col justify-center items-center gap-y-3 p-2 shadow-md">
              <h4 className="text-lg text-center">{t("boxes.box4.title")}</h4>
              <p className="text-sm text-center">
                <strong className="text-green">{t("boxes.box4.description")}</strong>
              </p>
            </div>

            {/* Box 5 */}
            <div className="border border-neutral-500 rounded-md w-72 h-40 flex flex-col justify-center items-center gap-y-3 p-2 shadow-md">
              <h4 className="text-lg text-center">{t("boxes.box5.title")}</h4>
              <p className="text-sm text-center">
                <strong className="text-green">{t("boxes.box5.description")}</strong>
              </p>
            </div>
          </div>
          <div>
            <div className="flex gap-x-3 items-center justify-center">
              <h2 onClick={handleCopy} className="text-xl mt-6 text-center py-2 px-3 rounded-md shadow-md bg-green text-white cursor-pointer">
                {t("referral.title")}
              </h2>
              {/* Copy Button */}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default PointsSection;
