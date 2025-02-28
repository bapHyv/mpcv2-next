import DisplayProductsCartPage from "@/app/components/cart/DisplayProductsCartPage";
import AreYouCustomer from "@/app/components/cartPage/AreYouCustomer";
import CartSummary from "@/app/components/cartPage/CartSummary";
import DiscountCode from "@/app/components/cartPage/DiscountCode";
import Fidelity from "@/app/components/cartPage/Fidelity";
import Title from "@/app/components/Title";

/**
 * TODO:
 * [-] How to set up user coupons on SSE update?
 *
 * [-] If no products, no display
 *
 * DiscountCode:
 *  [x] Disable discount code button if conditions are not fulfilled
 *  [-] Create function to apply public discount code
 *  [-] in isDiscountCodeUsable, return a message to be used in the tooltip
 *  [-] Rename DiscountCode into DisplayDiscountCodes
 *  [-] Create DiscountCode component to isolate each discount codes
 *  [-] Add a message in isDiscountCodeUsable to be displayed on hover when button disabled.
 *
 * Fidelity:
 *  [x] Create function to use fidelity points
 *  [-] Bug when typing in input (it can go higher than available points)
 *
 * CartSummary:
 *  [x] Add a component applied discountCode with button to remove it (red); (data stored in an array in orderContext)
 *  [-] Create function to compute VAT (https://chat.deepseek.com/a/chat/s/492372ef-be19-4249-af8c-cca65767d30d)
 *
 * orderContext:
 *  [x] Add array appliedDiscountCode
 *  [x] Add order object (structure in productsAndCartContext) (useEffect on cart to add the products in order object)
 *
 */

export default async function Page() {
  return (
    <>
      <Title
        title="Panier"
        type="h1"
        classname={`relative mt-4 sm:mt-8 2xl:pl-2 uppercase text-xl text-green font-bold tracking-widest`}
        firstLetterClassname="text-4xl"
      />
      {/* <DisplayUserData /> */}
      {/* WRAP ALL */}
      <div className="flex flex-col md:flex-row gap-x-5 p-2">
        {/* WRAP CONNECTED AND PRODUCTS */}
        <div className="w-full md:w-1/2">
          {/* IS CONNECTED */}
          <AreYouCustomer />
          {/* PRODUCTS */}
          <DisplayProductsCartPage />
        </div>

        {/* WRAP REST */}
        <div className="w-full md:w-1/2">
          {/* DISCOUNT CODE */}
          <DiscountCode />
          {/* FIDELITY POINTS */}
          <Fidelity />
          {/* CART SUMMARY */}
          <CartSummary />
        </div>
      </div>
    </>
  );
}
