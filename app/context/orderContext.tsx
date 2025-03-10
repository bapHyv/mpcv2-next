"use client";
import { createContext, useContext, ReactNode, useState, useEffect, Dispatch, SetStateAction } from "react";

import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import { Order, DiscountApplied, OrderProducts, shippingAddress, billingAddress } from "@/app/types/orderTypes";
import { computeFixedProductDiscount, computePercentDiscount } from "@/app/utils/orderFunctions";
import { useAuth } from "./authContext";
import { UAParser } from "ua-parser-js";
import useDiscountCodeUsable from "@/app/hooks/useDiscountCodeUsable";

interface OrderContext {
  order: Order;
  setOrder: Dispatch<SetStateAction<Order>>;
  discountApplied: DiscountApplied[];
  setDiscountApplied: Dispatch<SetStateAction<DiscountApplied[]>>;
  fidelityPointsUsed: number;
  setFidelityPointsUsed: Dispatch<SetStateAction<number>>;
}

export const orderContext = createContext({} as OrderContext);

/**
 *
 * Mettre un useEffect avec cart.products en dépendance.
 * À chaque fois que product change, il faut faire un filter sur discoutApplied pour vérifier que chaque discount est toujours applicable.
 */

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [order, setOrder] = useState<Order>({
    products: {},
    discounts: [],
    shippingMethodId: 0,
    shippingAddress: {} as shippingAddress,
    billingAddress: {} as billingAddress,
    total: 0,
    shippingCost: 0,
    totalOrder: 0,
    customerIp: "",
    customerUserAgent: "",
    deviceType: {} as UAParser.IResult,
  });
  const [discountApplied, setDiscountApplied] = useState<DiscountApplied[]>([]);
  const [fidelityPointsUsed, setFidelityPointsUsed] = useState(0);

  const { cart } = useProductsAndCart();
  const { userData } = useAuth();
  const isDiscountCodeUsable = useDiscountCodeUsable();

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
        return cur.id in acc
          ? {
              ...acc,
              [cur.id]: [
                ...acc[cur.id],
                {
                  label: cur.name,
                  amount: cur.option,
                  quantity: cur.quantity.toString(),
                  option: cur.option,
                  per: cur.per,
                  unitPrice: cur.unitPrice,
                  totalPrice: cur.totalPrice,
                },
              ],
            }
          : {
              ...acc,
              [cur.id]: [
                {
                  label: cur.name,
                  amount: cur.option,
                  quantity: cur.quantity.toString(),
                  option: cur.option,
                  per: cur.per,
                  unitPrice: cur.unitPrice,
                  totalPrice: cur.totalPrice,
                },
              ],
            };
      }, {} as OrderProducts);

      const computedTotal = cart.total - computedDiscounts - computedFidelityPoints;
      const updatedTotal = computedTotal > 0 ? computedTotal : 0;
      const updatedOrderTotal = updatedTotal + prevState.shippingCost;

      const updatedDiscounts: Order["discounts"] = [
        ...JSON.parse(JSON.stringify(discountApplied)),
        { type: "loyaltyPoints", value: fidelityPointsUsed },
      ];

      return { ...prevState, total: updatedTotal, totalOrder: updatedOrderTotal, products: updatedProducts, discounts: updatedDiscounts };
    });
  }, [cart, discountApplied, fidelityPointsUsed]);

  useEffect(() => {
    if (!userData) {
      setDiscountApplied([]);
    }
  }, [userData]);

  useEffect(() => {
    setDiscountApplied((prevState) => {
      const filteredDiscounts = prevState.filter((d) => isDiscountCodeUsable(d, prevState.length).status);
      return filteredDiscounts;
    });
  }, [cart.products]);

  useEffect(() => {
    const getClientInfo = async () => {
      const response = await fetch("https://api.ipify.org/?format=json");
      const data: { ip: string } = await response.json();
      const parser = UAParser();

      setOrder((prevState) => ({
        ...prevState,
        customerIp: data.ip,
        customerUserAgent: parser.ua,
        deviceType: parser,
      }));
    };

    getClientInfo();
  }, []);

  return (
    <orderContext.Provider value={{ order, setOrder, discountApplied, setDiscountApplied, fidelityPointsUsed, setFidelityPointsUsed }}>
      {children}
    </orderContext.Provider>
  );
};

export function useOrder() {
  return useContext(orderContext);
}

export default orderContext;
