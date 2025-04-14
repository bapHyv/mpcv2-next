"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";
import { disableBodyScroll, enableBodyScroll } from "@/app/utils/bodyScroll";
import { useTranslations } from "next-intl";

interface Props {
  removedProducts: React.ReactElement[];
  relatedProducts: React.ReactElement[];
  handleCloseModale: () => void;
}

export default function Modale({ removedProducts, relatedProducts, handleCloseModale }: Props) {
  const t = useTranslations("outOfStockModal");

  useEffect(() => {
    disableBodyScroll();
    return () => enableBodyScroll();
  }, []);

  return (
    <div className="fixed inset-0 z-[7000] flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg pt-4 pb-6 sm:p-6 shadow-xl w-full max-w-xl lg:max-w-2xl mx-auto relative flex flex-col max-h-[90vh]">
        <div className="absolute top-2 right-2">
          <button
            type="button"
            onClick={handleCloseModale}
            className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green rounded-md"
          >
            <span className="sr-only">{t("closeButtonSR")}</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-center text-red-600 mb-4 px-6">{t("title")}</h2>
        <div className="px-4 sm:px-0 overflow-y-auto flex-grow space-y-5">
          <p className="text-sm sm:text-base text-center text-gray-700 px-2">{t("mainMessage")}</p>
          <div>
            <h3 className="text-sm font-medium text-red-600 mb-1">{t("removedItemsHeader")}</h3>
            <div className="bg-gray-100 border border-gray-200 p-2 rounded-md overflow-y-auto max-h-32">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">{removedProducts}</div>
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-center text-green mb-3">{t("similarProductsTitle")}</h3>
            <p className="text-sm text-gray-600 mb-2 text-center sm:text-left" dangerouslySetInnerHTML={{ __html: t("similarProductsMessage") }} />
            <div className="bg-gray-100 border border-gray-200 p-2 rounded-md overflow-x-auto overflow-y-hidden">
              <div className="flex space-x-3 w-max">{relatedProducts}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
