import { useOrder } from "@/app/context/orderContext";
import { useProductsAndCart } from "@/app/context/productsAndCartContext";

export default function useCleanUpAfterPayment() {
  const { setCart } = useProductsAndCart();
  const { setOrder } = useOrder();

  const handleCleanUpAfterPayment = (callback?: () => void) => {
    setCart({ total: 0, products: [] });
    localStorage.setItem("cart", JSON.stringify({ total: 0, products: [] }));
    setOrder({
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
    if (callback) callback();
  };

  return { handleCleanUpAfterPayment };
}
