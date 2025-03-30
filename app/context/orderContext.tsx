"use client";
import { createContext, useContext, ReactNode, useState, useEffect, Dispatch, SetStateAction, useMemo } from "react";

import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import { Order, OrderProducts, shippingAddress, billingAddress } from "@/app/types/orderTypes";
import { computeFixedProductDiscount, computePercentDiscount } from "@/app/utils/orderFunctions";
import { useAuth } from "./authContext";
import { UAParser } from "ua-parser-js";
import useDiscountCodeUsable from "@/app/hooks/useDiscountCodeUsable";
import { ParcelPoint } from "@/app/types/mapTypes";
import { useSse } from "./sseContext";

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
  const [order, setOrder] = useState<Order>({
    products: {},
    discounts: [],
    fidelity: 0,
    shippingMethodId: null,
    "shipping-method": "",
    "parcel-point": null,
    shippingAddress: {
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
    },
    billingAddress: {
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
    },
    password: "",
    "different-billing": false,
    "payment-method": null,
    "sub-total": 0,
    shippingCost: 0,
    total: 0,
    customerIp: "",
    customerUserAgent: "",
    deviceType: {} as UAParser.IResult,
  });

  const { sseData } = useSse();
  const { cart } = useProductsAndCart();
  const { userData } = useAuth();
  const isDiscountCodeUsable = useDiscountCodeUsable();

  const userShippingAddress = useMemo(() => {
    if (userData) return userData.addresses.find((address) => address.shipping);
    return undefined;
  }, [userData]);

  const userBillingAddress = useMemo(() => {
    if (userData) return userData.addresses.find((address) => address.billing);
    return undefined;
  }, [userData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    shipping?: {
      shippingCost: number;
      shippingMethod: string;
    }
  ) => {
    const { name, value, type, id, checked } = e.target as HTMLInputElement;

    const isAddressType = type === "text" || type === "select-one" || type === "textarea" || type === "email" || type === "tel";

    if (type === "password") {
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

      //
      // sseData ? Object.keys(sseData?.shippingMethods.byShippingZones)[0] : ""
      const shippingAddress: shippingAddress = {
        address1: prevState.shippingAddress.address1 ? prevState.shippingAddress.address1 : userShippingAddress?.address1 || "",
        address2: prevState.shippingAddress.address2 ? prevState.shippingAddress.address2 : userShippingAddress?.address2 || "",
        city: prevState.shippingAddress.city ? prevState.shippingAddress.city : userShippingAddress?.city || "",
        company: prevState.shippingAddress.company ? prevState.shippingAddress.company : userShippingAddress?.company || "",
        country: prevState.shippingAddress.country
          ? prevState.shippingAddress.country
          : userShippingAddress
          ? userShippingAddress.country
          : sseData
          ? Object.keys(sseData?.shippingMethods.byShippingZones)[0]
          : "",
        email: prevState.shippingAddress.email ? prevState.shippingAddress.email : userShippingAddress?.email || "",
        firstname: prevState.shippingAddress.firstname ? prevState.shippingAddress.firstname : userShippingAddress?.firstname || "",
        lastname: prevState.shippingAddress.lastname ? prevState.shippingAddress.lastname : userShippingAddress?.lastname || "",
        phone: prevState.shippingAddress.phone ? prevState.shippingAddress.phone : userShippingAddress?.phone || "",
        postalCode: prevState.shippingAddress.postalCode ? prevState.shippingAddress.postalCode : userShippingAddress?.postalCode || "",
        province: prevState.shippingAddress.province ? prevState.shippingAddress.province : "",
        "order-notes": prevState.shippingAddress["order-notes"] ? prevState.shippingAddress["order-notes"] : "",
      };

      const billingAddress: billingAddress = {
        address1: prevState.billingAddress.address1 ? prevState.billingAddress.address1 : userBillingAddress?.address1 || "",
        address2: prevState.billingAddress.address2 ? prevState.billingAddress.address2 : userBillingAddress?.address2 || "",
        city: prevState.billingAddress.city ? prevState.billingAddress.city : userBillingAddress?.city || "",
        company: prevState.billingAddress.company ? prevState.billingAddress.company : userBillingAddress?.company || "",
        country: prevState.billingAddress.country
          ? prevState.billingAddress.country
          : userBillingAddress
          ? userBillingAddress.country
          : sseData
          ? Object.keys(sseData?.shippingMethods.byShippingZones)[0]
          : "",
        email: prevState.billingAddress.email ? prevState.billingAddress.email : userBillingAddress?.email || "",
        firstname: prevState.billingAddress.firstname ? prevState.billingAddress.firstname : userBillingAddress?.firstname || "",
        lastname: prevState.billingAddress.lastname ? prevState.billingAddress.lastname : userBillingAddress?.lastname || "",
        phone: prevState.billingAddress.phone ? prevState.billingAddress.phone : userBillingAddress?.phone || "",
        postalCode: prevState.billingAddress.postalCode ? prevState.billingAddress.postalCode : userBillingAddress?.postalCode || "",
        province: prevState.billingAddress.province ? prevState.billingAddress.province : "",
      };

      return {
        ...prevState,
        ["sub-total"]: updatedTotal,
        total: updatedOrderTotal,
        products: updatedProducts,
        shippingAddress,
        billingAddress,
      };
    });
  }, [cart, order.discounts, order.fidelity, userShippingAddress, userBillingAddress, order.shippingMethodId, sseData]);

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

  return <orderContext.Provider value={{ order, setOrder, handleChange }}>{children}</orderContext.Provider>;
};

export function useOrder() {
  return useContext(orderContext);
}

export default orderContext;
