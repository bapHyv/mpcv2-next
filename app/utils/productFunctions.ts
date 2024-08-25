import {
  Cannabinoids,
  Terpenes,
  Prices,
  categories,
} from "@/app/types/productsTypes";

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
      if (Number(parseInt(key) && Number(parseFloat(value)))) {
        return {
          quantity: parseInt(key),
          price: parseFloat(value || "0"),
        };
      } else {
        return null;
      }
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

export function formatOption(prices: Prices) {
  const entries = Object.entries(prices)
    .map(([key, value]) => {
      if (Number(parseInt(key) && Number(parseFloat(value)))) {
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
