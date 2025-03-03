"use client";
import { createContext, useContext, ReactNode, useState, useEffect, Dispatch, SetStateAction } from "react";

import { Address } from "@/app/types/profileTypes";
import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import { Order, DiscountApplied, OrderProducts } from "@/app/types/orderTypes";
import { computeFixedProductDiscount, computePercentDiscount } from "@/app/utils/orderFunctions";

interface OrderContext {
  order: Order;
  discountApplied: DiscountApplied[];
  setDiscountApplied: Dispatch<SetStateAction<DiscountApplied[]>>;
  fidelityPointsUsed: number;
  setFidelityPointsUsed: Dispatch<SetStateAction<number>>;
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

  const { cart } = useProductsAndCart();

  useEffect(() => {
    setOrder((prevState) => {
      // Compute the price reduction obtained by applying discount code
      const computedDiscounts = discountApplied.reduce((discountValue, discountCode) => {
        switch (discountCode.discountType) {
          case "fixed_cart":
            return discountValue + parseInt(discountCode.discountValue);
          case "percent":
            return discountValue + computePercentDiscount(discountCode, cart.products);
          case "fixed_product":
            return discountValue + computeFixedProductDiscount(discountCode, cart.products);
          default:
            return discountValue;
        }
      }, 0);

      // Compute the price reduction obtained by using fidelityPoints
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

      const updatedDiscounts: Order["discounts"] = [
        ...JSON.parse(JSON.stringify(discountApplied)),
        { type: "loyaltyPoints", value: fidelityPointsUsed },
      ];

      return { ...prevState, total: updatedTotal, products: updatedProducts, discounts: updatedDiscounts };
    });
  }, [cart, discountApplied, fidelityPointsUsed]);

  return (
    <orderContext.Provider value={{ order, discountApplied, setDiscountApplied, fidelityPointsUsed, setFidelityPointsUsed }}>
      {children}
    </orderContext.Provider>
  );
};

export function useOrder() {
  return useContext(orderContext);
}

export default orderContext;
