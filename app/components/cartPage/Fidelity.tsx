"use client";

import { buttonClassname, inputClassname, sectionClassname, titleClassname } from "@/app/staticData/cartPageClasses";
import { twMerge } from "tailwind-merge";
import Title from "@/app/components/Title";
import { useAuth } from "@/app/context/authContext";
import { useOrder } from "@/app/context/orderContext";

export default function Fidelity() {
  const { userData } = useAuth();
  const { setFidelityPointsUsed, fidelityPointsUsed } = useOrder();

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
            onChange={(e) => (e.target.value ? setFidelityPointsUsed(parseInt(e.target.value)) : setFidelityPointsUsed(0))}
          />
        </div>
      </div>
      <p className="uppercase text-neutral-600 text-xs">1 point = 0,10 euro de reduction</p>
    </section>
  ) : null;
}
