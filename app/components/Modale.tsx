"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { Dispatch, ReactNode, SetStateAction } from "react";

interface Props {
  removedProducts: JSX.Element[];
  relatedProducts: JSX.Element[];
  handleCloseModale: () => void;
}

export default function Modale({ removedProducts, relatedProducts, handleCloseModale }: Props) {
  return (
    <>
      <div className="fixed bg-black bg-opacity-80 h-full w-full z-[9000] flex items-center justify-center">
        <div className="w-[95dvw] xl:w-[50dvw] bg-neutral-100 h-fit p-2 rounded-md">
          <div className="flex justify-end">
            <XMarkIcon onClick={handleCloseModale} className="w-6 h-6 text-neutral-700 rounded-full" />
          </div>
          <div className="h-6 text-red-500">
            Manque de stock <span className="text-black">-</span> Produits retirés du panier:
          </div>
          <div className="overflow-y-scroll overflow-x-hidden max-h-[calc((95vh-80px)*1/3.5)] w-[calc(95dvw-16px)] xl:w-[calc(50dvw-16px)] px-1">
            <div className="w-full p-2 grid grid-cols-6 gap-2">{removedProducts}</div>
          </div>
          <div className="h-6 text-green">Produits similaires:</div>
          <div className="overflow-y-scroll overflow-x-scroll max-h-[calc((95vh-80px)*2/3)] w-[calc(95dvw-16px)] xl:w-[calc(50dvw-16px)]">
            <div className="w-fit flex gap-1 md:gap-2 px-1 py-0.5 flex-nowrap items-start bg-neutral-100">{relatedProducts}</div>
          </div>
        </div>
      </div>
    </>
  );
}
