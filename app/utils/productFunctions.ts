import {
  Cannabinoids,
  Terpenes,
  Prices,
  categories,
  Image,
} from "@/app/types/productsTypes";

export function findMainImage(images: Image[]) {
  const mainImage = { url: "", alt: "" };
  const _images = images.filter((image) => image.main);
  mainImage.alt = _images[0].alt;
  mainImage.url = _images[0].url;

  return mainImage;
}

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

export function findHighestQuantity(prices: Prices) {
  const highestQuantity = { quantity: 0, price: 0 };

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
      if (price.quantity > highestQuantity.quantity) {
        highestQuantity.quantity = price.quantity;
        highestQuantity.price = price.price;
      }
    }, 0);

  return highestQuantity;
}

export function formatOption(prices: Prices, stock: string) {
  const entries = Object.entries(prices)
    .map(([key, value]) => {
      // This boolean is used to remove the options that are greater than the stock.
      // Those options will not be displayed in the ProductOptions.tsx
      const isOptionIsGreaterThanStock = parseInt(key) > parseInt(stock);
      // In some cases the key can be equal to "per" and the value equal to "g" or "unit"
      // Only the numeric option are needed.
      // Ex: key = 100 and value === 3.50. It reprensents 100g for 3.50€/g
      if (
        !!Number(parseInt(key)) &&
        !!Number(parseFloat(value)) &&
        !isOptionIsGreaterThanStock
      ) {
        return {
          quantity: key,
          price: value,
        };
      } else {
        return null;
      }
    })
    .filter(Boolean);

  return entries;
}

export function doesCategoryExists(categories: categories, category: string) {
  return categories.find((e) => e.url === category);
}

export function findCategory(categories: categories, category: string) {
  return categories.filter((cat) => cat.url === category)[0].category;
}

export function findTitle(categories: categories, category: string) {
  return categories.filter((cat) => cat.url === category)[0].title;
}
