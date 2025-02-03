import { useSse } from "@/app/context/sseContext";

import { useProductsAndCart } from "@/app/context/productsAndCartContext";

/**
 * This code updates the available stock of a product based on the quantity already in the cart
 * and the quantity the user wants to add. If the computed stock is insufficient for the selected option,
 * it automatically adjusts the option (quantity) to the closest available value from the product's options.
 * Then, it updates the product's information (stock, option, price) accordingly.
 */

const useProductStockManager = () => {
  const { sseData } = useSse();
  const { products, updateProduct, cart } = useProductsAndCart();

  const handleAddToCart = (id: string, quantityBeingAdded: number) => {
    if (sseData && id in sseData.stocks) {
      const availableStock = sseData.stocks[id];
      const quantityAlreadyInCart = cart.products
        .filter((product) => product.id === id)
        .reduce((acc, val) => acc + val.quantity * parseInt(val.option), 0);
      const computedStock = availableStock - quantityAlreadyInCart - quantityBeingAdded;

      const partialUpdate = {
        stock: computedStock.toString(),
        option: products[id].option,
        price: products[id].price,
      };

      if (computedStock < parseInt(products[id].option)) {
        const options = Object.keys(products[id].productOptions)
          .map((e) => parseInt(e))
          .sort((a, b) => a - b);

        const closestOption = options.reduce((acc, val) => (val <= computedStock ? val : acc), options[0]);
        const price = products[id].productOptions[closestOption];

        partialUpdate.option = closestOption.toString();
        partialUpdate.price = price;
      }

      updateProduct(id, partialUpdate);
    }
  };

  return handleAddToCart;
};

export default useProductStockManager;
