import { billingAddress, Order, shippingAddress } from "@/app/types/orderTypes";
import { province as provinces } from "@/app/staticData/provinces";

const isAddressComplete = <T extends shippingAddress | billingAddress>(address: T, requiredFields: (keyof T)[]): boolean =>
  !requiredFields.some((field) => !address[field]);

const checkProvince = (country: string, province?: string): boolean => {
  const requiresProvince = Object.keys(provinces).some((key) => key.includes(country) && provinces[key as keyof typeof provinces].required);
  return requiresProvince && !province;
};

const requiredFields: (keyof shippingAddress | keyof billingAddress)[] = [
  "address1",
  "city",
  "country",
  "email",
  "firstname",
  "lastname",
  "phone",
  "postalCode",
];

export function paymentRouteGuard(order: Order): boolean {
  // Check if shipping method info is missing
  if (!order.shippingMethodId || !order["shipping-method"]) return true;

  // Check shipping address fields
  if (!isAddressComplete(order.shippingAddress, requiredFields)) return true;

  // If billing is different, check billing address fields too
  if (order["different-billing"] && !isAddressComplete(order.billingAddress, requiredFields as (keyof billingAddress)[])) return true;

  // Check province if country requires it
  if (checkProvince(order.shippingAddress.country, order.shippingAddress.province)) return true;

  // Check if billing needs province (if different billing)
  if (order["different-billing"] && checkProvince(order.billingAddress.country, order.billingAddress.province)) return true;

  if (order["shipping-method"] === "boxtal_connect" && !order["parcel-point"]) return true;

  return false;
}
