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

export interface ShippingMethod {
  instanceId: number;
  id: string;
}
