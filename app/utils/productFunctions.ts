import { Cannabinoids, Terpenes, Prices, categories, Image } from "@/app/types/productsTypes";
import { IProduct } from "@/app/productsContext";

export function findHighest(values: Cannabinoids | Terpenes | undefined) {
  if (!values) return null;

  const entries = Object.entries(values)
    .map(([key, value]) => ({
      name: key,
      value: parseFloat(value || "0"),
    }))
    .filter(Boolean);

  if (!entries.length) return null;

  const highest = entries.reduce((prev, current) =>
    current.value > prev.value ? current : prev
  );

  return highest;
}

export function findHighestOption(prices: Prices) {
  const highestOption = { quantity: 0, price: 0 };

  Object.entries(prices)
    .map(([key, value]) => {
      return {
        quantity: parseInt(key),
        price: parseFloat(value || "0"),
      };
    })
    .filter(Boolean)
    .forEach((price) => {
      if (!price) return null;
      if (price.quantity > highestOption.quantity) {
        highestOption.quantity = price.quantity;
        highestOption.price = price.price;
      }
    }, 0);

  return highestOption;
}

export function formatOptions(prices: Prices, stock: string) {
  let entries = Object.entries(prices)
    .map(([key, value]) => {
      // This boolean is used to remove the options that are greater than the stock.
      // Those options will not be displayed in the ProductOptions.tsx
      const isOptionIsGreaterThanStock = parseInt(key) > parseInt(stock);

      if (!isOptionIsGreaterThanStock) {
        return {
          option: key,
          price: value,
        };
      } else {
        return null;
      }
    })
    .filter(Boolean);

  // This is here to prevent to return an empty array. It is needed because
  // if the array is empty, no price is displayed and no option is selected
  if (!entries.length) {
    entries = Object.entries(prices)
      .slice(0, 1)
      .map(([key, value]) => ({ option: key, price: value }));
  }

  return entries;
}

export function doesCategoryExists(categories: categories, category: string) {
  return categories.find((e) => e.slug === category);
}

export function findCategory(categories: categories, category: string) {
  return categories.filter((cat) => cat.slug === category)[0].category;
}

export function findSlug(categories: categories, category: string) {
  return categories.filter((cat) => cat.slug === category)[0].slug;
}

export function findTitle(categories: categories, category: string) {
  return categories.filter((cat) => cat.slug === category)[0].title;
}

export const updateProductLogic = (
  product: IProduct,
  id: string,
  option: string,
  price: string,
  computedStock: number,
  updateProduct: (productId: string | number, updates: Partial<IProduct>) => void
) => {
  const updatedStock = computedStock <= 0 ? 0 : computedStock;

  const formatedOptions = formatOptions(product.productOptions, updatedStock.toString());
  const l = formatedOptions.length;

  const doesFormatedOptionsHasPrice = formatedOptions.some(
    (formatedOption) => formatedOption?.price === price
  );
  const doesFormatedOptionHasOption = formatedOptions.some(
    (formatedOption) => formatedOption?.option === option
  );

  if (!doesFormatedOptionsHasPrice) {
    price = formatedOptions[l - 1]?.price || "";
  }

  if (!doesFormatedOptionHasOption) {
    option = formatedOptions[l - 1]?.option || "";
  }

  updateProduct(id, { option, price, formatedOptions, stock: updatedStock.toString() });
};
