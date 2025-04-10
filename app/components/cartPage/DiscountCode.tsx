import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { twMerge } from "tailwind-merge";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";

import { useAlerts } from "@/app/context/alertsContext";
import { useOrder } from "@/app/context/orderContext";
import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import { useSse } from "@/app/context/sseContext";
import { buttonClassname } from "@/app/staticData/cartPageClasses";
import { DiscountCode as IDiscountCode } from "@/app/types/sseTypes";
import useDiscountCodeUsable from "@/app/hooks/useDiscountCodeUsable";
interface Props {
  name: string;
  d: IDiscountCode;
}

export default function DiscountCode({ name, d }: Props) {
  const [isIndividualUse, setIsIndividualUse] = useState(false);

  const { sseData } = useSse();
  const { order, setOrder } = useOrder();
  const { cart } = useProductsAndCart();
  const { addAlert } = useAlerts();
  const isDiscountCodeUsable = useDiscountCodeUsable();
  const { message, status } = isDiscountCodeUsable(d, order.discounts.length);

  const handleUseDiscountCode = (discount: IDiscountCode, name: string) => {
    setOrder((prevState) => {
      return {
        ...prevState,
        discounts: [...prevState.discounts, { ...discount, name }],
      };
    });
    addAlert(uuid(), `Discount code ${name} has been applied`, "Discount code applied successfully", "emerald");
  };

  useEffect(() => {
    if (sseData) {
      setIsIndividualUse(order.discounts.some((discount) => sseData.coupons[discount.name].individualUse));
    }
  }, [order.discounts, sseData]);

  const isAlreadyApplied = order.discounts.some((discount) => discount.name === name);

  return (
    <>
      <div className="flex items-center">
        <div className="text-ellipsis overflow-hidden text-nowrap w-[60%]">{name}</div>
        <div className="text-ellipsis overflow-hidden text-nowrap w-[10%]">
          {d.discountValue}
          {d.discountType === "percent" ? "%" : "€"}
        </div>

        <div className="flex items-center justify-end gap-x-2 w-[30%]">
          {!!message && (
            <>
              <div className="has-tooltip group">
                <QuestionMarkCircleIcon type="button" tabIndex={0} className="w-5 h-5 text-blue-600 rounded-full tooltip-trigger" />
                <span className="tooltip">{message}</span>
              </div>
            </>
          )}
          <button
            disabled={!status || isIndividualUse || !cart.products.length || isAlreadyApplied}
            className={twMerge(buttonClassname)}
            onClick={() => handleUseDiscountCode(d, name)}
          >
            {isAlreadyApplied ? "Appliqué" : "Utiliser"}
          </button>
        </div>
      </div>
    </>
  );
}
