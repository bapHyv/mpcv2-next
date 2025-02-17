import { Dispatch, SetStateAction } from "react";

export interface User {
  username: string;
  password: string;
}

export interface UserData {
  display_name?: string;
  firstname: string;
  lastname: string;
  mail: string;
  nickname?: string;
  addresses?: Address[];
  optInMarketing?: boolean;
  oldPassword?: string;
  newPassword?: string;
}

export interface UpdatedUserData {
  mail: string;
  firstname: string;
  lastname: string;
  optInMarketing?: boolean;
  nickname?: string;
  display_name?: string;
  oldPassword?: string;
  addresses: Address[];
}

export interface Address {
  address1: string;
  address2: string;
  billing: boolean;
  city: string;
  company: string;
  country: string;
  email: string;
  firstname: string;
  id: number;
  lastname: string;
  phone: string;
  postalCode: number;
  shipping: boolean;
}

export interface AuthContextType {
  userData: UserDataAPIResponse | null;
  setUserData: Dispatch<SetStateAction<UserDataAPIResponse | null>>;
  cleanUpLocalStorageUserRelated: () => void;
  logout: () => void;
}

interface UserMetadata {
  nickname: string;
  first_name: string;
  last_name: string;
  description: string;
  rich_editing: string;
  syntax_highlighting: string;
  comment_shortcuts: string;
  admin_color: string;
  use_ssl: string;
  show_admin_bar_front: string;
  locale: string;
  wp_capabilities: string;
  wp_user_level: string;
  wc_last_active: string;
  last_update: string;
  billing_first_name: string;
  billing_last_name: string;
  billing_address_1: string;
  billing_address_2: string;
  billing_city: string;
  billing_postcode: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_address_1: string;
  shipping_address_2: string;
  shipping_city: string;
  shipping_postcode: string;
  shipping_country: string;
  shipping_method: string;
  shipping_phone: string;
  twitter: string;
  facebook: string;
  paying_customer: string;
  mailchimp_woocommerce_is_subscribed: string;
  _aw_persistent_language: string;
  itsec_password_strength: string;
}

interface Product {
  name: string;
  price: string;
}

interface Shipping {
  method: string;
  cost: string;
}

interface Order {
  id: number;
  date: string;
  status: string;
  subTotal: number;
  total: number;
  totalVAT: number;
  currency: string;
  discount: number;
  paymentMethod: string;
  shippingAddress: Record<string, unknown>;
  billingAddress: Record<string, unknown>;
  products: Product[];
  shipping: Shipping;
}

export interface UserDataAPIResponse {
  ID: number;
  user_login: string;
  user_nicename: string;
  user_email: string;
  user_url: string;
  user_registered: string;
  user_activation_key: string;
  user_status: number;
  display_name: string;
  accessToken: string;
  refreshToken: string;
  umeta_id: number;
  user_id: number;
  meta_key: string;
  meta_value: string;
  mail: string;
  metadata: UserMetadata;
  firstname: string;
  lastname: string;
  nickname: string;
  loyaltyPoints: number;
  referralToken: string;
  optInMarketing: number;
  discounts: string[];
  orders: Order[];
  addresses?: Address[];
}
