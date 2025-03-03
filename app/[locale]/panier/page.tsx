import DisplayComponents from "@/app/components/cartPage/DisplayComponents";
import Title from "@/app/components/Title";

/**
 * TODO:
 *
 * DiscountCode:
 *  [x] Disable discount code button if conditions are not fulfilled
 *  [x] Create function to apply public discount code
 *  [x] in isDiscountCodeUsable, return a message to be used in the tooltip
 *      [x] When required products, use products from context instead of cart
 *      [x] When required categories, display the categories in the message
 *  [x] Rename DiscountCode into DisplayDiscountCodes
 *  [x] Create DiscountCode component to isolate each discount codes
 *  [x] Add a message in isDiscountCodeUsable to be displayed on hover when button disabled.
 *
 * Fidelity:
 *  [x] Create function to use fidelity points
 *  [x] Bug when typing in input (it can go higher than available points)
 *
 * CartSummary:
 *  [x] Add a component applied discountCode with button to remove it (red); (data stored in an array in orderContext)
 *  [x] Create function to compute VAT (https://chat.deepseek.com/a/chat/s/492372ef-be19-4249-af8c-cca65767d30d)
 *
 * orderContext:
 *  [x] Add array appliedDiscountCode
 *  [x] Add order object (structure in productsAndCartContext) (useEffect on cart to add the products in order object)
 *
 * useDiscountCodeUsable:
 *  [x] Create a generateExcludedCategoriesString to display the excluded categories
 *  [x] Update the function generateRequiredProductsString to check in variationTable instead of products[parseInt(id).name]
 *
 * [x] fix error in DisplayComponents
 * [-] How to set up user coupons on SSE update?
 *
 * [-] If no products, no display
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
      <DisplayComponents />
    </>
  );
}
