"use client";

import { buttonClassname, inputClassname, sectionClassname, titleClassname } from "@/app/staticData/cartPageClasses";
import { twMerge } from "tailwind-merge";
import Title from "@/app/components/Title";
import { useAuth } from "@/app/context/authContext";
import { useOrder } from "@/app/context/orderContext";
import { ChangeEvent } from "react";

export default function Fidelity() {
  const { userData } = useAuth();
  const { setFidelityPointsUsed, fidelityPointsUsed } = useOrder();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value;

    if (e.target.value === "") {
      return;
    }

    e.target.value = parseInt(e.target.value, 10).toString();

    if (isNaN(parseInt(e.target.value))) {
      e.target.value = "0";
    }

    if (userData && parseInt(e.target.value) > userData.loyaltyPoints) {
      e.target.value = userData.loyaltyPoints.toString();
    }

    if (fidelityPointsUsed === 0 && e.target.value !== "0") {
      e.target.value = e.target.value.toString().replace(/^0+/, "");
    }

    setFidelityPointsUsed(parseInt(e.target.value));
  };

  /**
   * Ne doit jamais être vide
   * Lorsque je commence à écrire, si ça commence par un 0, le 0 doit s'effacer
   * 
   write handleChange function for an input type number.
   set fidelityPointsUsed with e.target.value
   fidelityPointsUsed is type of number
   fidelityPointsUsed cannot be empty
   when e.target.value equal 0 and the user starts typing, the 0 must disappear.
   ex: 0 => user types 4, it must equal 4 and not 04.
   e.target.value cannot exceed userData.loyalityPoints
   */

  return userData ? (
    <section aria-labelledby="fidelity-points" className={twMerge(sectionClassname)}>
      <Title title="Vos points de fidelite" type="h2" classname={twMerge(titleClassname)} firstLetterClassname="text-2xl" id="fidelity-points" />
      <div>
        <div className="flex items-center justify-between">
          <span>Nombres de points:</span>
          <span>{userData.loyaltyPoints}</span>
        </div>
        <div className="flex items-center justify-between">
          <input
            id="fidelity-points"
            name="fidelity-points"
            type="number"
            value={fidelityPointsUsed}
            min={0}
            max={userData.loyaltyPoints}
            className={twMerge(inputClassname)}
            onChange={handleChange}
          />
        </div>
      </div>
      <p className="uppercase text-neutral-600 text-xs">1 point = 0,10 euro de reduction</p>
    </section>
  ) : null;
}
