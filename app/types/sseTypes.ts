export interface SSEDataAPIResponse {
  stocks: Record<string, string | null>;
  coupons: Record<string, DiscountCode>;
  shippingMethods: ShippingMethods;
}

export interface SSEData {
  stocks: Record<string, number>;
  coupons: Record<string, DiscountCode>;
  shippingMethods: ShippingMethods;
}

export type discountType = "percent" | "fixed_cart" | "fixed_product";

export interface DiscountCode {
  linkedToUser: boolean;
  individualUse: boolean;
  discountType: discountType;
  discountValue: string;
  freeShipping: boolean;
  minCartAmount: string; // x
  maxCartAmount: string; // x if "0": don't use
  excludePromoProduct: boolean; //
  maxUsage: number;
  maxUsageByUser: number;
  nbItemsLimit: number;
  requiredProducts: string[];
  requiredCategories: number[];
  excludedProducts: string[];
  excludedCategories: number[];
  totalUsage: number;
}

export interface ShippingMethods {
  byShippingZones: Record<string, ShippingZone>;
  byId: Record<string, ShippingMethod>;
}

export interface ShippingZone {
  zone_id: number;
  name: string;
  methods: ShippingMethod[];
}

export interface IShippingMethod {
  instanceId: number;
  type: string;
  title: string;
}

// Extended interfaces with specific fields
export interface BoxtalConnectMethod extends IShippingMethod {
  type: "boxtal_connect";
  rates: string; // Specific to Boxtal Connect
  priceThreshold: number;
  cost: number;
}

export interface LocalPickupMethod extends IShippingMethod {
  type: "local_pickup";
  tax_status: string; // Specific to Local Pickup
  cost: string; // Specific to Local Pickup
}

export interface FreeShippingMethod extends IShippingMethod {
  type: "free_shipping";
  requires: string; // Specific to Free Shipping
  min_amount: string; // Specific to Free Shipping
  ignore_discounts: "yes" | "no"; // Specific to Free Shipping
  bw_parcel_point_networks?: string; // Optional, specific to Free Shipping
}

export interface FlatRateMethod extends IShippingMethod {
  type: "flat_rate";
  tax_status: string; // Specific to Flat Rate
  cost: string; // Specific to Flat Rate
  bw_parcel_point_networks?: string; // Optional, specific to Flat Rate
}

export type ShippingMethod = BoxtalConnectMethod | LocalPickupMethod | FreeShippingMethod | FlatRateMethod;
