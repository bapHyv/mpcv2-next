import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import { DiscountCode } from "@/app/types/sseTypes";
import { useMemo } from "react";

const useIsDiscountCodeUsable = () => {
  const { cart: c, products, variationTable } = useProductsAndCart();

  const categories: { [categoryId: number]: string } = useMemo(
    () => ({
      26: "Fleurs de CBD",
      27: "Résine de CBD",
      28: "Huiles de CBD",
      37: "Moonrock de CBD",
      38: "Soins au CBD",
      65: "Vaporisateur CBD",
      87: "Infusion au CBD",
    }),
    []
  );

  const generateCategoriesString = (ids: number[]) => {
    const getCategoryName = (id: number) => {
      if (id in categories) return categories[id];
      return null;
    };

    const categoryNames = ids.map((id) => getCategoryName(id)).filter((name): name is string => name !== null && name !== undefined);
    const string = categoryNames.length === 1 ? categoryNames[0] : categoryNames.slice(0, -1).join(", ") + " and " + categoryNames.slice(-1);

    return {
      length: categoryNames.length,
      string,
    };
  };

  const generateProductsString = (ids: string[]) => {
    const getProductName = (id: number) => {
      if (id in products) {
        return products[id].name;
      } else if (variationTable && id in variationTable) {
        return products[variationTable[id]].name;
      }
      return null;
    };

    const productNames = ids.map((id) => getProductName(parseInt(id))).filter((name): name is string => name !== null && name !== undefined);

    const string = productNames.length === 1 ? productNames[0] : productNames.slice(0, -1).join(", ") + " and " + productNames.slice(-1);

    return {
      length: productNames.length,
      string,
    };
  };

  const hasCategories = (ids: number[]) => {
    const set = new Set(ids);
    return c.products.some((p) => set.has(p.categoryId));
  };

  const hasProducts = (ids: string[]) => {
    const set = new Set(ids);
    return c.products.some((p) => set.has(p.id.toString()));
  };

  const hasNoRequiredProductsInCart = (ids: string[]) => {
    const set = new Set(ids);
    return c.products.every((p) => !set.has(p.id.toString()));
  };

  const hasNoRequiredCategoriesProductInCart = (ids: number[]) => {
    const set = new Set(ids);
    return c.products.every((p) => !set.has(p.categoryId));
  };

  const hasOnlyExcludedProductsInCart = (ids: string[]) => {
    const set = new Set(ids);
    return c.products.every((p) => set.has(p.id.toString()));
  };

  const hasOnlyExcludedCategoriesProductInCart = (ids: number[]) => {
    const set = new Set(ids);
    return c.products.every((p) => set.has(p.categoryId));
  };

  const isDiscountCodeUsable = (d: DiscountCode, l: number) => {
    const min = parseInt(d.minCartAmount);
    const max = parseInt(d.maxCartAmount);
    const hasMin = !!min;
    const hasMax = !!max;
    const fcart = d.discountType === "fixed_cart";
    const percOrFprod = d.discountType === "percent" || d.discountType === "fixed_product";
    const hasProductInPromo = c.products.some((product) => product.isPromo);
    const excludesProducts = !!d.excludedProducts.length;
    const excludesCategories = !!d.excludedCategories.length;
    const requiresProducts = !!d.requiredProducts.length;
    const requiresCategories = !!d.requiredCategories.length;

    if (hasMin && c.total < min) {
      return { status: false, message: `To use this discount, the minimum spending is ${min}€` };
    }

    if (hasMax && c.total > max) {
      return { status: false, message: `To use this discount, The maximum spending is ${max}€` };
    }

    if (d.excludePromoProduct && hasProductInPromo) {
      return { status: false, message: "This discount can't be used with on sale products in the cart" };
    }

    if (d.individualUse && Boolean(l)) {
      return { status: false, message: "This discount can't be used concurently with other discount" };
    }

    if (fcart && !d.excludePromoProduct && excludesProducts && hasProducts(d.excludedProducts)) {
      const { length, string } = generateProductsString(d.excludedProducts);
      return {
        status: false,
        message: `The product${length === 1 ? "" : "s"} ${string} ${length === 1 ? "has" : "have"} to be removed from the cart to use this discount`,
      };
    }

    if (fcart && !d.excludePromoProduct && excludesCategories && hasCategories(d.excludedCategories)) {
      const { length, string } = generateCategoriesString(d.excludedCategories);
      return {
        status: false,
        message: `To use this discount, remove all products that belong to the following categor${length === 1 ? "y" : "ies"}: ${string}`,
      };
    }

    if (fcart && !d.excludePromoProduct && requiresProducts && !hasProducts(d.requiredProducts)) {
      const { length, string } = generateProductsString(d.requiredProducts);
      return {
        status: false,
        message: `The product${length === 1 ? "" : "s"} ${string} ${length === 1 ? "has" : "have"} to be added to the cart to use this discount`,
      };
    }

    if (fcart && !d.excludePromoProduct && requiresCategories && !hasCategories(d.requiredCategories)) {
      const { length, string } = generateCategoriesString(d.requiredCategories);
      return {
        status: false,
        message: `To use this discount, you have to add one product of the following categor${length === 1 ? "y" : "ies"}: ${string}`,
      };
    }

    if (percOrFprod && !d.excludePromoProduct && requiresProducts && hasNoRequiredProductsInCart(d.requiredProducts)) {
      const { length, string } = generateProductsString(d.requiredProducts);
      return {
        status: false,
        message: `The product${length === 1 ? "" : "s"} ${string} ${length === 1 ? "has" : "have"} to be added to the cart to use this discount`,
      };
    }

    if (percOrFprod && !d.excludePromoProduct && requiresCategories && hasNoRequiredCategoriesProductInCart(d.requiredCategories)) {
      const { length, string } = generateCategoriesString(d.requiredCategories);
      return {
        status: false,
        message: `To use this discount, you have to add one product of the following categor${length === 1 ? "y" : "ies"}: ${string}`,
      };
    }

    if (percOrFprod && !d.excludePromoProduct && excludesProducts && hasOnlyExcludedProductsInCart(d.excludedProducts)) {
      const { string } = generateProductsString(d.excludedProducts);
      return { status: false, message: `This discount is not applicable on ${string}. Add other products to use this discount.` };
    }

    if (percOrFprod && !d.excludePromoProduct && excludesCategories && hasOnlyExcludedCategoriesProductInCart(d.excludedCategories)) {
      const { string } = generateCategoriesString(d.excludedCategories);
      return {
        status: false,
        message: `This discount is not applicable on products that belong to ${string}. Add other products from different categories to use this discount.`,
      };
    }

    return { status: true, message: "" };
  };

  return isDiscountCodeUsable;
};

export default useIsDiscountCodeUsable;
