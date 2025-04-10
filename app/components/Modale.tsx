"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";
import { disableBodyScroll, enableBodyScroll } from "@/app/utils/bodyScroll";

interface Props {
  removedProducts: JSX.Element[];
  relatedProducts: JSX.Element[];
  handleCloseModale: () => void;
}

export default function Modale({ removedProducts, relatedProducts, handleCloseModale }: Props) {
  useEffect(() => {
    disableBodyScroll();
    return () => enableBodyScroll();
  }, []);

  return (
    <>
      <div className="fixed bg-black bg-opacity-80 h-full w-full z-[9000] flex items-center justify-center">
        <div className="w-[95dvw] xl:w-[50dvw] bg-white h-[90dvh] md:h-[70dvh] lg:h-[90dvh] p-2 rounded-md overflow-y-scroll">
          <div className="flex justify-end">
            <XMarkIcon onClick={handleCloseModale} className="w-6 h-6 text-neutral-700 rounded-full" />
          </div>
          <div className="text-red-500 text-center text-xl font-semibold">Manque de stock</div>
          <div className="mt-3 text-red-500 text-center md:text-left">
            Nous avons le regret de vous annoncer que certain produit que vous aviez dans le panier ne sont plus disponible.
            <br />
            Produit{removedProducts.length > 1 ? "s" : ""} retiré{removedProducts.length > 1 ? "s" : ""} du panier:
          </div>
          <div className="bg-neutral-200 p-1 rounded-md overflow-y-scroll overflow-x-hidden max-h-[calc((95vh-80px)*1/3.5)] w-[calc(95dvw-16px)] xl:w-[calc(50dvw-16px)]">
            <div className="w-full grid grid-cols-6 gap-1">{removedProducts}</div>
          </div>
          <div className="mt-5 text-green text-center text-xl font-semibold">Produit similaire</div>
          <div className="my-3 text-green">
            Nous sommes sincèrement désolé pour ce désagrément. <br /> Voici une liste des produits similaire qui sont susceptible de vous intéresser:
          </div>

          <div className="p-1 bg-neutral-200 rounded-md overflow-y-scroll overflow-x-scroll w-[calc(95dvw-16px)] xl:w-[calc(50dvw-16px)]">
            <div className="w-fit flex gap-1 flex-nowrap items-start">{relatedProducts}</div>
          </div>
        </div>
      </div>
    </>
  );
}
