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
    if (order.discounts.some((applied) => applied.name === name)) return;

    setOrder((prevState) => ({
      ...prevState,
      discounts: [...prevState.discounts, { ...discount, name }],
    }));
    addAlert(uuid(), `Code promo ${name} appliqué`, "Code promo appliqué", "emerald");
  };

  useEffect(() => {
    if (sseData && order.discounts.some((discount) => sseData.coupons[discount.name]?.individualUse)) {
      setIsIndividualUse(true);
    } else {
      setIsIndividualUse(false);
    }
  }, [order.discounts, sseData]);

  const isAlreadyApplied = order.discounts.some((discount) => discount.name === name);

  const isDisabledByIndividualUse = isIndividualUse && !isAlreadyApplied;

  return (
    <div className="flex items-center justify-between py-2">
      {" "}
      <div className="flex items-baseline flex-grow min-w-0 mr-2 space-x-2">
        <span className="font-medium text-sm truncate" title={name}>
          {name}
        </span>
        <span className="text-xs text-gray-500 whitespace-nowrap">
          ({d.discountValue}
          {d.discountType === "percent" ? "%" : "€"})
        </span>
      </div>
      <div className="flex items-center justify-end flex-shrink-0 space-x-2">
        {!!message && (
          <div className="has-tooltip group relative">
            {" "}
            <QuestionMarkCircleIcon tabIndex={0} className="w-5 h-5 text-blue-600 rounded-full tooltip-trigger cursor-help" />
            <span className="tooltip">{message}</span>
          </div>
        )}
        <button
          disabled={!status || isDisabledByIndividualUse || !cart.products.length || isAlreadyApplied}
          className={twMerge(buttonClassname, "px-3 py-1 text-xs")}
          onClick={() => handleUseDiscountCode(d, name)}
        >
          {isAlreadyApplied ? "Appliqué" : "Utiliser"}
        </button>
      </div>
    </div>
  );
}
