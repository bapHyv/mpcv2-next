// {
//     products: {
//         ID_PRODUCT: [
//             {label: 'XXXX', amount: '50', quantity: '1'},
//             ...
//         ],
//         ...
//     },
//     discounts: [
//         {type: 'coupon', value: 'toto4000'},
//         {type: 'loyaltyPoints', value: '4000'},
//         ...
//     ],
//     shippingMethodId: SHIPPING_METHOD_ID,
//     shippingAddress: {},
//     billingAddress: {},
//     total: XXXX,
//     customerIp: '',
//     customerUserAgent: '',
//     deviceType: Desktop || Mobile
// }

import { Address } from "@/app/types/profileTypes";
import { DiscountCode, discountType } from "@/app/types/sseTypes";

export interface OrderProduct {
  label: string;
  amount: string;
  quantity: string;
  option: string;
  per: "g" | "unit";
  unitPrice: number;
  totalPrice: number;
}

export interface OrderProducts {
  [ID_PRODUCT: string]: OrderProduct[];
}

export interface FidelityApplied {
  type: "loyaltyPoints";
  value: number;
}

export interface Discount {
  type: string;
  value: string;
}

export interface DiscountApplied extends DiscountCode {
  name: string;
}

export type shippingAddress = Omit<Address, "id" | "billing" | "shipping"> & { province: string; password: string };
export type billingAddress = Omit<Address, "id" | "billing" | "shipping"> & { province: string };
export interface Order {
  products: OrderProducts;
  discounts: (DiscountApplied | FidelityApplied)[];
  shippingMethodId: number;
  shippingAddress: shippingAddress;
  billingAddress: billingAddress;
  total: number; // This is the total after discouts
  shippingCost: number;
  totalOrder: number; // This is the total + shippingCost
  customerIp: string;
  customerUserAgent: string;
  deviceType: UAParser.IResult;
}
