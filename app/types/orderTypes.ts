import { Address } from "@/app/types/profileTypes";
import { DiscountCode, discountType } from "@/app/types/sseTypes";
import { ParcelPoint } from "@/app/types/mapTypes";

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

export type shippingAddress = Omit<Address, "id" | "billing" | "shipping"> & { province: string; "order-notes": string };
export type billingAddress = Omit<Address, "id" | "billing" | "shipping"> & { province: string };
export interface Order {
  products: OrderProducts;
  discounts: DiscountApplied[];
  fidelity: number;
  shippingMethodId: null | number;
  "shipping-method": "boxtal_connect" | "local_pickup" | "free_shipping" | "flat_rate" | string;
  "parcel-point": null | ParcelPoint;
  shippingAddress: shippingAddress;
  billingAddress: billingAddress;
  password: string;
  "different-billing": boolean;
  "payment-method": "secure-3d-card" | "bank-transfer" | null;
  "sub-total": number; // This is the total after discouts
  shippingCost: number;
  total: number; // This is the total + shippingCost
  customerIp: string;
  customerUserAgent: string;
  deviceType: UAParser.IResult;
}

export interface SipsSuccessResponse {
  redirectionData: string;
  redirectionStatusCode: "00" | "03" | "12" | "30" | "34" | "94" | "99";
  redirectionStatusMessage: string;
  redirectionUrl: string;
  redirectionVersion: string;
  seal: string;
}

export interface SipsFailResponse {
  redirectionStatusCode: "00" | "03" | "12" | "30" | "34" | "94" | "99";
  redirectionVersion: string;
  seal: string;
}

export interface InitPaymentResponse {
  data: {
    orderId: number;
  } & (SipsSuccessResponse | SipsFailResponse);
}
