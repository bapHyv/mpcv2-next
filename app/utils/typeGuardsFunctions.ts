import { UserDataAPIResponse, UserMetadata, Address, Order, Product, Shipping, UpdateAddressResponse } from "@/app/types/profileTypes";
import { BoxtalConnectMethod, FlatRateMethod, FreeShippingMethod, IShippingMethod, LocalPickupMethod } from "@/app/types/sseTypes";
import { InitPaymentResponse, SipsFailResponse, SipsSuccessResponse } from "@/app/types/orderTypes";

export function isId(data: any): data is { id: string } {
  if (!data || typeof data.id !== "string") {
    return false;
  }

  return true;
}

export function isUserDataAPIResponse(data: any): data is UserDataAPIResponse {
  // Check basic properties of UserDataAPIResponse
  if (
    !data ||
    typeof data.ID !== "number" ||
    typeof data.firstname !== "string" ||
    typeof data.lastname !== "string" ||
    typeof data.mail !== "string"
  ) {
    return false;
  }

  // Check metadata
  // if (!isUserMetadata(data.metadata)) {
  //   return false;
  // }

  // Check addresses (if present)
  // if (data.addresses && !Array.isArray(data.addresses)) {
  //   return false;
  // }
  // if (data.addresses && !data.addresses.every((address: any) => isAddress(address))) {
  //   return false;
  // }

  // // Check orders
  // if (!data.orders.every((order: any) => isOrder(order))) {
  //   return false;
  // }

  return true;
}

// Helper function to check if an object is of type UserMetadata
export function isUserMetadata(metadata: any): metadata is UserMetadata {
  return (
    metadata &&
    typeof metadata.nickname === "string" &&
    typeof metadata.first_name === "string" &&
    typeof metadata.last_name === "string" &&
    typeof metadata.description === "string" &&
    typeof metadata.rich_editing === "string" &&
    typeof metadata.syntax_highlighting === "string" &&
    typeof metadata.comment_shortcuts === "string" &&
    typeof metadata.admin_color === "string" &&
    typeof metadata.use_ssl === "string" &&
    typeof metadata.show_admin_bar_front === "string" &&
    typeof metadata.locale === "string" &&
    typeof metadata.wp_capabilities === "string" &&
    typeof metadata.wp_user_level === "string" &&
    typeof metadata.wc_last_active === "string" &&
    typeof metadata.last_update === "string" &&
    typeof metadata.billing_first_name === "string" &&
    typeof metadata.billing_last_name === "string" &&
    typeof metadata.billing_address_1 === "string" &&
    typeof metadata.billing_address_2 === "string" &&
    typeof metadata.billing_city === "string" &&
    typeof metadata.billing_postcode === "string" &&
    typeof metadata.billing_country === "string" &&
    typeof metadata.billing_email === "string" &&
    typeof metadata.billing_phone === "string" &&
    typeof metadata.shipping_first_name === "string" &&
    typeof metadata.shipping_last_name === "string" &&
    typeof metadata.shipping_address_1 === "string" &&
    typeof metadata.shipping_address_2 === "string" &&
    typeof metadata.shipping_city === "string" &&
    typeof metadata.shipping_postcode === "string" &&
    typeof metadata.shipping_country === "string" &&
    typeof metadata.shipping_method === "string" &&
    typeof metadata.shipping_phone === "string" &&
    typeof metadata.twitter === "string" &&
    typeof metadata.facebook === "string" &&
    typeof metadata.paying_customer === "string" &&
    typeof metadata.mailchimp_woocommerce_is_subscribed === "string" &&
    typeof metadata._aw_persistent_language === "string" &&
    typeof metadata.itsec_password_strength === "string"
  );
}

// Helper function to check if an object is of type Address
export function isAddress(address: any): address is Address {
  return (
    address &&
    typeof address.firstname === "string" &&
    typeof address.lastname === "string" &&
    typeof address.address1 === "string" &&
    typeof address.address2 === "string" &&
    typeof address.city === "string" &&
    typeof address.country === "string" &&
    typeof address.phone === "string" &&
    typeof address.email === "string" &&
    typeof address.billing === "boolean" &&
    typeof address.shipping === "boolean" &&
    typeof address.company === "string"
  );
}

export function isUpdateAddressResponse(address: any): address is UpdateAddressResponse {
  return (
    address &&
    typeof address.firstname === "string" &&
    typeof address.lastname === "string" &&
    typeof address.company === "string" &&
    typeof address.country === "string" &&
    typeof address.address1 === "string" &&
    typeof address.address2 === "string" &&
    typeof address.postalCode === "string" &&
    typeof address.city === "string" &&
    typeof address.phone === "string" &&
    typeof address.email === "string" &&
    typeof address.billing === "boolean" &&
    typeof address.shipping === "boolean" &&
    typeof address.id === "string"
  );
}

// Helper function to check if an object is of type Order
export function isOrder(order: any): order is Order {
  return (
    order &&
    typeof order.id === "number" &&
    typeof order.date === "string" &&
    typeof order.status === "string" &&
    typeof order.subTotal === "number" &&
    typeof order.total === "number" &&
    typeof order.totalVAT === "number" &&
    typeof order.currency === "string" &&
    typeof order.discount === "number" &&
    typeof order.paymentMethod === "string" &&
    typeof order.shippingAddress === "object" &&
    typeof order.billingAddress === "object" &&
    Array.isArray(order.products) &&
    order.products.every((product: any) => isProduct(product)) &&
    isShipping(order.shipping)
  );
}

// Helper function to check if an object is of type Product
export function isProduct(product: any): product is Product {
  return product && typeof product.name === "string" && typeof product.price === "string";
}

// Helper function to check if an object is of type Shipping
export function isShipping(shipping: any): shipping is Shipping {
  return shipping && typeof shipping.method === "string" && typeof shipping.cost === "string";
}

export function isBoxtalConnectMethod(method: IShippingMethod): method is BoxtalConnectMethod {
  return method.type === "boxtal_connect" && "rates" in method && "cost" in method;
}

export function isLocalPickupMethod(method: IShippingMethod): method is LocalPickupMethod {
  return method.type === "local_pickup" && "tax_status" in method && "cost" in method;
}

export function isFreeShippingMethod(method: IShippingMethod): method is FreeShippingMethod {
  return method.type === "free_shipping" && "requires" in method && "min_amount" in method && "ignore_discounts" in method;
}

export function isFlatRateMethod(method: IShippingMethod): method is FlatRateMethod {
  return method.type === "flat_rate" && "tax_status" in method && "cost" in method;
}

export function isSipsSuccessResponse(response: any): response is SipsSuccessResponse {
  return (
    typeof response === "object" &&
    typeof response.redirectionData === "string" &&
    ["00", "03", "12", "30", "34", "94", "99"].includes(response.redirectionStatusCode) &&
    typeof response.redirectionStatusMessage === "string" &&
    typeof response.redirectionUrl === "string" &&
    typeof response.redirectionVersion === "string" &&
    typeof response.seal === "string"
  );
}

export function isSipsFailResponse(response: any): response is SipsFailResponse {
  return (
    typeof response === "object" &&
    typeof response.redirectionStatusCode === "string" &&
    typeof response.redirectionVersion === "string" &&
    typeof response.seal === "string" &&
    !isSipsSuccessResponse(response)
  );
}

export function isSuccessResponse(response: InitPaymentResponse["data"]): response is { orderId: number } & SipsSuccessResponse {
  return "redirectionUrl" in response;
}
