import { Cannabinoids, Terpenes, Prices, categories, Image } from "@/app/types/productsTypes";

export function findHighest(values: Cannabinoids | Terpenes | undefined) {
  if (!values) return null;

  const entries = Object.entries(values)
    .map(([key, value]) => ({
      name: key,
      value: parseFloat(value || "0"),
    }))
    .filter(Boolean);

  if (!entries.length) return null;

  const highest = entries.reduce((prev, current) => (current.value > prev.value ? current : prev));

  return highest;
}

export function findHighestOption(prices: Prices) {
  const highestOption = { quantity: 0, price: 0 };

  Object.entries(prices)
    .map(([key, value]) => {
      return {
        quantity: parseInt(key),
        price: parseFloat(value.price || "0"),
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

export const returnRenamedGrowingMethod = (growingMethod: "Extérieur" | "Sous-serre" | "Intérieur" | undefined) =>
  !growingMethod ? null : growingMethod === "Extérieur" ? "exterieur" : growingMethod === "Intérieur" ? "interieur" : "greenhouse";
