import { useOrder, initialOrderState, initialShippingAddressState, initialBillingAddressState } from "@/app/context/orderContext";
import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import { useSse } from "@/app/context/sseContext";
import { shippingAddress as ShippingAddressType, billingAddress as BillingAddressType } from "@/app/types/orderTypes";
import { useAuth } from "@/app/context/authContext";

export default function useCleanUpAfterPayment() {
  const { setCart } = useProductsAndCart();
  const { setOrder, order: currentOrderDetails } = useOrder();
  const { sseData } = useSse();
  const { userData } = useAuth();

  const handleCleanUpAfterPayment = (callback?: () => void) => {
    setCart({ total: 0, products: [] });
    localStorage.setItem("cart", JSON.stringify({ total: 0, products: [] }));

    let finalShippingAddress: ShippingAddressType;
    let finalBillingAddress: BillingAddressType;

    if (userData) {
      const userSavedShipping = userData.addresses.find((addr) => addr.shipping);
      const userSavedBilling = userData.addresses.find((addr) => addr.billing);

      finalShippingAddress = {
        ...initialShippingAddressState,
        ...(userSavedShipping && {
          firstname: userSavedShipping.firstname || "",
          lastname: userSavedShipping.lastname || "",
          company: userSavedShipping.company || "",
          address1: userSavedShipping.address1 || "",
          address2: userSavedShipping.address2 || "",
          city: userSavedShipping.city || "",
          postalCode: userSavedShipping.postalCode || "",
          country: userSavedShipping.country || "",
          email: userSavedShipping.email || "",
          phone: userSavedShipping.phone || "",
        }),
      };

      if (userSavedBilling && (!userSavedShipping || JSON.stringify(userSavedBilling) !== JSON.stringify(userSavedShipping))) {
        finalBillingAddress = {
          ...initialBillingAddressState,
          ...(userSavedBilling && {
            firstname: userSavedBilling.firstname || "",
            lastname: userSavedBilling.lastname || "",
            company: userSavedBilling.company || "",
            address1: userSavedBilling.address1 || "",
            address2: userSavedBilling.address2 || "",
            city: userSavedBilling.city || "",
            postalCode: userSavedBilling.postalCode || "",
            country: userSavedBilling.country || "",
            email: userSavedBilling.email || "",
            phone: userSavedBilling.phone || "",
          }),
        };
      } else {
        finalBillingAddress = { ...finalShippingAddress };
      }
    } else {
      finalShippingAddress = {
        ...initialShippingAddressState,
      };
      finalBillingAddress = {
        ...initialBillingAddressState,
      };
    }

    setOrder({
      ...initialOrderState,
      shippingAddress: finalShippingAddress,
      billingAddress: finalBillingAddress,
      customerIp: currentOrderDetails.customerIp,
      customerUserAgent: currentOrderDetails.customerUserAgent,
      deviceType: currentOrderDetails.deviceType,
    });

    if (callback) callback();
  };

  return { handleCleanUpAfterPayment };
}
