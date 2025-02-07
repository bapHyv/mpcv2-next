"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  handleClose: () => void;
}

export default function Modale({ children, handleClose }: Props) {
  return (
    <>
      <div className="fixed bg-black bg-opacity-80 h-full w-full z-[9000] flex items-center justify-center">
        <div className="w-[95dvw] bg-white h-[95dvh] p-1">
          <div className="flex justify-end bg-teal-200">
            <XMarkIcon onClick={handleClose} className="w-6 h-6 text-white bg-red-500 rounded-full" />
          </div>
          <div className="bg-orange-300 h-6">Produits retirés du panier:</div>
          <div className="overflow-y-scroll overflow-x-hidden h-[calc((95vh-80px)/2)] w-[calc(95dvw-8px)] bg-blue-500 px-1">
            <div className="w-full p-2 flex flex-col gap-2">
              <div className="h-20 w-full bg-purple-400"></div>
              <div className="h-20 w-full bg-purple-400"></div>
              <div className="h-20 w-full bg-purple-400"></div>
              <div className="h-20 w-full bg-purple-400"></div>
              <div className="h-20 w-full bg-purple-400"></div>
              <div className="h-20 w-full bg-purple-400"></div>
              <div className="h-20 w-full bg-purple-400"></div>
              <div className="h-20 w-full bg-purple-400"></div>
              <div className="h-20 w-full bg-purple-400"></div>
            </div>
          </div>
          <div className="bg-slate-400 h-6">Produits similaires:</div>
          <div className="overflow-y-hidden overflow-x-scroll h-[calc((95vh-80px)/2)] w-[calc(95dvw-8px)] bg-blue-500 px-1">
            <div className="w-fit p-2 flex gap-2 flex-nowrap">
              <div className="h-96 w-56 bg-purple-400"></div>
              <div className="h-96 w-56 bg-purple-400"></div>
              <div className="h-96 w-56 bg-purple-400"></div>
              <div className="h-96 w-56 bg-purple-400"></div>
              <div className="h-96 w-56 bg-purple-400"></div>
              <div className="h-96 w-56 bg-purple-400"></div>
              <div className="h-96 w-56 bg-purple-400"></div>
              <div className="h-96 w-56 bg-purple-400"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
