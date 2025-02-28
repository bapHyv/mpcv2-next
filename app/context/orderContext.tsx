"use client";
import { createContext, useContext, ReactNode, useState, useEffect, Dispatch, SetStateAction } from "react";

import { Address } from "@/app/types/profileTypes";
import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import { Order, DiscountApplied, OrderProducts } from "@/app/types/orderTypes";
import { computePercentDiscount } from "@/app/utils/orderFunctions";
import { DiscountCode } from "@/app/types/sseTypes";
import { useSse } from "@/app/context/sseContext";
import { useAuth } from "@/app/context/authContext";

interface OrderContext {
  order: Order;
  discountApplied: DiscountApplied[];
  setDiscountApplied: Dispatch<SetStateAction<DiscountApplied[]>>;
  fidelityPointsUsed: number;
  setFidelityPointsUsed: Dispatch<SetStateAction<number>>;
  userDiscountCode: Record<string, DiscountCode>;
}

export const orderContext = createContext({} as OrderContext);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [order, setOrder] = useState<Order>({
    products: {},
    discounts: [],
    shippingMethodId: 0,
    shippingAddress: {} as Address,
    billingAddress: {} as Address,
    total: 0,
    customerIp: "",
    customerUserAgent: "",
    deviceType: "desktop",
  });
  const [discountApplied, setDiscountApplied] = useState<DiscountApplied[]>([]);
  const [fidelityPointsUsed, setFidelityPointsUsed] = useState(0);
  const [userDiscountCode, setUserDiscountCode] = useState<Record<string, DiscountCode>>({});

  const { cart } = useProductsAndCart();
  const { sseData } = useSse();
  const { userData } = useAuth();

  useEffect(() => {
    setOrder((prevState) => {
      const computedDiscounts = discountApplied.reduce((acc, cur) => {
        switch (cur.discountType) {
          case "fixed_cart":
            return acc + parseInt(cur.discountValue);
          case "percent":
            return acc + computePercentDiscount(cur, cart.products);
          default:
            return acc;
        }
      }, 0);

      const computedFidelityPoints = fidelityPointsUsed * 0.1;

      const updatedProducts: OrderProducts = cart.products.reduce((acc, cur) => {
        return {
          ...acc,
          [cur.id]: {
            label: cur.name,
            amount: cur.option,
            quantity: cur.quantity.toString(),
          },
        };
      }, {});

      const computedTotal = cart.total - computedDiscounts - computedFidelityPoints;
      const updatedTotal = computedTotal > 0 ? computedTotal : 0;

      return { ...prevState, total: updatedTotal, products: updatedProducts };
    });
  }, [cart, discountApplied, fidelityPointsUsed]);

  useEffect(() => {
    if (sseData && userData) {
      const userDiscounts = userData.discounts.reduce((acc, val) => {
        if (val in sseData.coupons) {
          acc[val] = JSON.parse(JSON.stringify(sseData.coupons[val]));
          return acc;
        }
        return acc;
      }, {} as Record<string, DiscountCode>);

      setUserDiscountCode(userDiscounts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sseData?.coupons]);

  return (
    <orderContext.Provider value={{ order, discountApplied, setDiscountApplied, fidelityPointsUsed, setFidelityPointsUsed, userDiscountCode }}>
      {children}
    </orderContext.Provider>
  );
};

export function useOrder() {
  return useContext(orderContext);
}

export default orderContext;
