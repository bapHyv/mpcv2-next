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
  const [isMessageVisible, setIsMessageVisible] = useState(false);

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

  return (
    <>
      <div className="flex items-center justify-between gap-x-3">
        <span className="text-ellipsis overflow-hidden text-nowrap">{name}</span>
        <span className="text-ellipsis overflow-hidden text-nowrap">
          {d.discountValue}
          {d.discountType === "percent" ? "%" : "€"}
        </span>

        <div className="flex items-center gap-x-2">
          {!!message && (
            <>
              <div className="has-tooltip">
                <QuestionMarkCircleIcon
                  type="button"
                  onClick={() => setIsMessageVisible(!isMessageVisible)}
                  className="w-5 h-5 text-black rounded-full cursor-help"
                />
                <span className="tooltip">{message}</span>
              </div>
            </>
          )}
          <button
            disabled={!status || isIndividualUse || !cart.products.length || !!order.discounts.filter((d) => d.name === name).length}
            className={twMerge(buttonClassname)}
            onClick={() => handleUseDiscountCode(d, name)}
          >
            Utiliser
          </button>
        </div>
      </div>
      <div className="h-[1px] w-full bg-black"></div>
    </>
  );
}
