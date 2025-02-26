"use client";

import { useAuth } from "@/app/context/authContext";
import { useSse } from "@/app/context/sseContext";
import { twMerge } from "tailwind-merge";
import Title from "@/app/components/Title";
import { buttonClassname, inputClassname, sectionClassname, titleClassname } from "@/app/staticData/cartPageClasses";
import { useOrder } from "@/app/context/orderContext";
import { discountType } from "@/app/types/sseTypes";
import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import { isDiscountCodeUsable } from "@/app/utils/orderFunctions";
import { useEffect, useState } from "react";

export default function DiscountCode() {
  const [isIndividualUse, setIsIndividualUse] = useState(false);
  const { userData } = useAuth();
  const { sseData } = useSse();
  const { setDiscountApplied, discountApplied, userDiscountCode } = useOrder();
  const { cart } = useProductsAndCart();

  const handleUseDiscountCode = (type: discountType, value: string, name: string) => {
    setDiscountApplied((prevState) => [...prevState, { type, value, name }]);
  };

  //

  /* individualUse 2 cases:
      -The discount code holding individualUse: true is being used => All discount codes must be disabled
      -One discount code is used => the discount code holding individualUse must be disabled
  */

  useEffect(() => {
    setIsIndividualUse(discountApplied.some((discount) => userDiscountCode[discount.name].individualUse));
  }, [discountApplied, userDiscountCode]);

  return userData && sseData ? (
    <section aria-labelledby="discount-code" className={twMerge(sectionClassname, "flex flex-col gap-y-6")}>
      {/* LINKED DISCOUNT CODE */}
      <div>
        <Title
          title="Codes liés au compte"
          type="h2"
          classname={twMerge(titleClassname, "mb-1")}
          firstLetterClassname="text-2xl"
          id="linked-account-discount-code"
        />
        <label htmlFor="discount-code" className="sr-only">
          discount-code
        </label>
        <div className="flex flex-col gap-y-3">
          {Object.entries(userDiscountCode).map(([name, discount]) => (
            <div className="flex items-center justify-between gap-x-3" key={name}>
              <span className="w-1/3 text-ellipsis overflow-hidden text-nowrap">{name}</span>
              <span className="w-1/3 text-ellipsis overflow-hidden text-nowrap">
                {discount.discountValue}
                {discount.discountType === "percent" ? "%" : "€"}
              </span>
              <button
                disabled={
                  !isDiscountCodeUsable(discount, cart, name) || isIndividualUse || (discount.individualUse && !!discountApplied.length)
                    ? true
                    : false || !cart.products.length || !!discountApplied.filter((d) => d.name === name).length
                }
                className={twMerge(buttonClassname)}
                onClick={() => handleUseDiscountCode(discount.discountType, discount.discountValue, name)}
              >
                Utiliser
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* DISCOUNT CODE */}
      <div>
        <Title title="Codes promo" type="h2" classname={twMerge(titleClassname, "mb-1")} firstLetterClassname="text-2xl" id="discount-code" />
        <div className="flex items-center justify-between gap-x-3">
          <input id="discount-code" name="discount-code" type="text" className={twMerge(inputClassname)} />
          <button className={twMerge(buttonClassname)}>Appliquer</button>
        </div>
      </div>
    </section>
  ) : null;
}
