"use client";
import { createContext, useContext, ReactNode, useState, useEffect, Dispatch, SetStateAction, useMemo } from "react";
import { UAParser } from "ua-parser-js";

import { useDebounce } from "@/app/hooks/useDebounce";
import { useFetchWrapper } from "@/app/hooks/useFetchWrapper";

import { Order, OrderProducts, shippingAddress, billingAddress } from "@/app/types/orderTypes";
import { computeFixedProductDiscount, computePercentDiscount } from "@/app/utils/orderFunctions";
import useDiscountCodeUsable from "@/app/hooks/useDiscountCodeUsable";
import { useAuth } from "@/app/context/authContext";
import { useConsent } from "@/app/context/consentContext";
import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import { useSse } from "@/app/context/sseContext";

export const initialShippingAddressState: shippingAddress = {
  address1: "",
  address2: "",
  city: "",
  company: "",
  country: "",
  email: "",
  firstname: "",
  lastname: "",
  phone: "",
  postalCode: "",
  province: "",
  "order-notes": "",
};

export const initialBillingAddressState: billingAddress = {
  address1: "",
  address2: "",
  city: "",
  company: "",
  country: "",
  email: "",
  firstname: "",
  lastname: "",
  phone: "",
  postalCode: "",
  province: "",
};

export const initialOrderState: Order = {
  products: {},
  discounts: [],
  fidelity: 0,
  shippingMethodId: null,
  "shipping-method": "",
  "parcel-point": null,
  shippingAddress: { ...initialShippingAddressState },
  billingAddress: { ...initialBillingAddressState },
  password: "",
  "different-billing": false,
  "payment-method": null,
  "sub-total": 0,
  shippingCost: 0,
  total: 0,
  customerIp: "",
  customerUserAgent: "",
  deviceType: {} as UAParser.IResult,
};

interface OrderContext {
  order: Order;
  setOrder: Dispatch<SetStateAction<Order>>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    shipping?: {
      shippingCost: number;
      shippingMethod: string;
    }
  ) => void;
}

export const orderContext = createContext({} as OrderContext);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [order, setOrder] = useState<Order>(() => {
    return { ...initialOrderState };
  });

  const { sseData } = useSse();
  const { cart } = useProductsAndCart();
  const { userData } = useAuth();
  const isDiscountCodeUsable = useDiscountCodeUsable();
  const { consentState, isLoadingConsent } = useConsent();
  const { fetchWrapper } = useFetchWrapper();

  const stateToBackup = useMemo(() => ({ cart, order }), [cart, order]);
  const debouncedState = useDebounce(stateToBackup, 2000);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    shipping?: {
      shippingCost: number;
      shippingMethod: string;
    }
  ) => {
    const { name, value, type, id, checked } = e.target as HTMLInputElement;

    const isAddressType = type === "text" || type === "select-one" || type === "textarea" || type === "email" || type === "tel";

    if (type === "password" || id === "password") {
      setOrder((prevState) => {
        return {
          ...prevState,
          password: value,
        };
      });
    } else if (isAddressType && id.startsWith("shipping-")) {
      setOrder((prevState) => {
        return {
          ...prevState,
          shippingAddress: {
            ...prevState.shippingAddress,
            [name]: value,
          },
        };
      });
    } else if (isAddressType && id.startsWith("billing-")) {
      setOrder((prevState) => {
        return {
          ...prevState,
          billingAddress: {
            ...prevState.billingAddress,
            [name]: value,
          },
        };
      });
    } else if (type === "checkbox" && id.startsWith("different-")) {
      setOrder((prevState) => {
        return {
          ...prevState,
          [name]: checked,
        };
      });
    } else if (type === "radio" && id.startsWith("shipping-method-")) {
      setOrder((prevState) => {
        return {
          ...prevState,
          shippingMethodId: parseInt(value),
          shippingCost: shipping?.shippingCost ?? 0,
          "shipping-method": shipping?.shippingMethod as string,
        };
      });
    } else if (type === "radio" && id.startsWith("payment-method-")) {
      setOrder((prevState) => {
        return {
          ...prevState,
          "payment-method": value as "secure-3d-card" | "bank-transfer",
        };
      });
    }
  };

  useEffect(() => {
    setOrder((prevState) => {
      const computedDiscounts = prevState.discounts.reduce((discountValue, discountCode) => {
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

      const computedFidelityPoints = prevState.fidelity * 0.1;

      const computedTotal = cart.total - computedDiscounts - computedFidelityPoints;
      const updatedTotal = computedTotal > 0 ? computedTotal : 0;
      const updatedOrderTotal = updatedTotal + prevState.shippingCost;

      return {
        ...prevState,
        ["sub-total"]: updatedTotal,
        total: updatedOrderTotal,
        products: updatedProducts,
      };
    });
  }, [cart, order.discounts, order.fidelity, order.shippingMethodId, sseData]);

  /**
   * Has to reset shippingMethodId and shippingCost when changing country.
   * It prevents the shippingCost and the instanceId from staying set to the previous country.
   * Example:
   * FRANCE = shippingMethodId: A, shippingCost: B
   * GUADELOUPE = shippingMethodId: C, shippingCost: D
   * The user set country to FRANCE, selects shpping method flat_rate (shippingMethodId: A, shippingCost: B)
   * user then set country to GUADELOUPE. The shippingMethodId and the shippingCost are still respectively set to A and B instead of C and D
   * This use effect prevents this behavior.
   * It also reset when the cart and discounts change since those parameters can have an impact on
   * the price and shipping method.
   */
  useEffect(() => {
    setOrder((prevState) => {
      return {
        ...prevState,
        shippingMethodId: null,
        shippingCost: 0,
      };
    });
  }, [order.shippingAddress.country, cart.products, cart.total, order.discounts]);

  /**
   * Remove all the discounts when the user log out
   * Remove the value of the password input when the user is connected
   */
  useEffect(() => {
    if (!userData) {
      setOrder((prevState) => {
        return {
          ...prevState,
          discounts: [],
          fidelity: 0,
          shippingAddress: { ...initialShippingAddressState },
          billingAddress: { ...initialShippingAddressState },
        };
      });
    } else if (userData) {
      setOrder((prevState) => {
        return {
          ...prevState,
          password: "",
        };
      });
    }
  }, [userData]);

  /**
   * Filter out the discounts that don't match the requirements when the user remove products from cart
   */
  useEffect(() => {
    setOrder((prevState) => {
      return {
        ...prevState,
        discounts: prevState.discounts.filter((d) => isDiscountCodeUsable(d, prevState.discounts.length).status),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.products]);

  /**
   * Get the client data for analysis purpose
   */
  useEffect(() => {
    if (isLoadingConsent) {
      return;
    }

    if (consentState.analytics) {
      const getClientInfo = async () => {
        try {
          const response = await fetch("https://api.ipify.org/?format=json");
          if (!response.ok) throw new Error("Failed to fetch IP");
          const data: { ip: string } = await response.json();

          const parser = UAParser();

          setOrder((prevState) => ({
            ...prevState,
            customerIp: data.ip,
            customerUserAgent: parser.ua,
            deviceType: parser,
          }));
        } catch (error) {
          console.error("Failed to get client info:", error);
          setOrder((prevState) => ({
            ...prevState,
            customerIp: "",
            customerUserAgent: "",
            deviceType: {} as UAParser.IResult,
          }));
        }
      };

      getClientInfo();
    } else {
      setOrder((prevState) => {
        if (prevState.customerIp !== "" || prevState.customerUserAgent !== "") {
          return {
            ...prevState,
            customerIp: "",
            customerUserAgent: "",
            deviceType: {} as UAParser.IResult,
          };
        }
        return prevState;
      });
    }
  }, [consentState.analytics, isLoadingConsent]);

  useEffect(() => {
    if (order) {
      localStorage.setItem("order", JSON.stringify(order));
    }
  }, [order]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, cart]);

  useEffect(() => {
    if (!userData || !debouncedState.cart.products.length) {
      return;
    }
    // TODO: remove orderBkp here
    const backupData = async () => {
      console.log("Debounced effect triggered: Backing up cart and order...");
      try {
        await fetchWrapper("/api/user/backup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartBkp: JSON.stringify(debouncedState.cart),
            orderBkp: JSON.stringify(debouncedState.order),
          }),
        });
        console.log("Backup successful.");
      } catch (error) {
        console.error("Failed to back up user data:", error);
      }
    };

    backupData();
  }, [debouncedState, userData, fetchWrapper]);

  return <orderContext.Provider value={{ order, setOrder, handleChange }}>{children}</orderContext.Provider>;
};

export function useOrder() {
  return useContext(orderContext);
}

export default orderContext;
