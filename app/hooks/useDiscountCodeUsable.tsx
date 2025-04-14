"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { useProductsAndCart } from "@/app/context/productsAndCartContext";
import { DiscountCode } from "@/app/types/sseTypes";

const useIsDiscountCodeUsable = () => {
  const t = useTranslations("");
  const { cart: c, products, variationTable } = useProductsAndCart();

  const categories: { [categoryId: number]: string } = useMemo(
    () => ({
      26: t("category.flower"), // fleur
      27: t("category.hash"), // hash
      28: t("category.oil"), // huile
      37: t("category.moonrock"), // moonrock
      38: t("category.health"), // soins
      65: t("category.vaporizer"), // vapo
      87: t("category.herbalTea"), // infu
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const isDiscountCodeUsable = (d: DiscountCode, currentDiscountCount: number) => {
    const defaultSuccess = { status: true, message: "" };

    if (!c || !products) {
      return { status: false, message: t("global.cartDataError") };
    }

    // Safely parse amounts, default to 0 or Infinity if invalid/missing
    const min = d.minCartAmount ? parseFloat(d.minCartAmount) : 0;
    const max = d.maxCartAmount ? parseFloat(d.maxCartAmount) : Infinity;
    const hasMin = min > 0;
    const hasMax = isFinite(max);

    const isFixedCart = d.discountType === "fixed_cart";
    const isPercentOrFixedProduct = d.discountType === "percent" || d.discountType === "fixed_product";
    const hasProductInPromo = c.products.some((product) => product.isPromo);
    const excludesProducts = d.excludedProducts?.length > 0;
    const excludesCategories = d.excludedCategories?.length > 0;
    const requiresProducts = d.requiredProducts?.length > 0;
    const requiresCategories = d.requiredCategories?.length > 0;

    // --- Condition Checks (Return translated message on failure) ---
    if (hasMin && c.total < min) {
      return { status: false, message: t("discountMessages.minAmount", { amount: min.toFixed(2) }) };
    }

    if (hasMax && c.total > max) {
      return { status: false, message: t("discountMessages.maxAmount", { amount: max.toFixed(2) }) };
    }

    if (d.excludePromoProduct && hasProductInPromo) {
      return { status: false, message: t("discountMessages.excludePromo") };
    }

    if (d.individualUse && currentDiscountCount > 0) {
      return { status: false, message: t("discountMessages.individualUse") };
    }

    // --- Fixed Cart Specific Exclusions/Inclusions ---
    if (isFixedCart) {
      if (excludesProducts && hasProducts(d.excludedProducts)) {
        const { string } = generateProductsString(d.excludedProducts);
        return { status: false, message: t("discountMessages.cartExcludeProducts", { products: string }) };
      }
      if (excludesCategories && hasCategories(d.excludedCategories)) {
        const { string } = generateCategoriesString(d.excludedCategories);
        return { status: false, message: t("discountMessages.cartExcludeCategories", { categories: string }) };
      }
      if (requiresProducts && !hasProducts(d.requiredProducts)) {
        const { string } = generateProductsString(d.requiredProducts);
        return { status: false, message: t("discountMessages.cartRequireProducts", { products: string }) };
      }
      if (requiresCategories && !hasCategories(d.requiredCategories)) {
        const { string } = generateCategoriesString(d.requiredCategories);
        return { status: false, message: t("discountMessages.cartRequireCategories", { categories: string }) };
      }
    }

    // --- Percent/Fixed Product Specific Exclusions/Inclusions ---
    // These usually mean the discount *can* be applied, but won't affect certain items,
    // or only applies if *required* items are present. The tooltip should reflect this nuance.
    // The previous logic might have been too strict here, preventing application entirely.
    // Let's refine: the discount *status* is true, but the message explains the limitation.
    // Note: The actual calculation needs to handle these exclusions.

    if (isPercentOrFixedProduct) {
      if (requiresProducts && hasNoRequiredProductsInCart(d.requiredProducts)) {
        const { string } = generateProductsString(d.requiredProducts);
        // Status is false because the required item isn't there *at all*
        return { status: false, message: t("discountMessages.cartRequireProducts", { products: string }) };
      }
      if (requiresCategories && hasNoRequiredCategoriesProductInCart(d.requiredCategories)) {
        const { string } = generateCategoriesString(d.requiredCategories);
        // Status is false because the required category isn't there *at all*
        return { status: false, message: t("discountMessages.cartRequireCategories", { categories: string }) };
      }
      // If ONLY excluded products are in the cart
      if (excludesProducts && hasOnlyExcludedProductsInCart(d.excludedProducts)) {
        const { string } = generateProductsString(d.excludedProducts);
        // Status is false because NO eligible items exist
        return { status: false, message: t("discountMessages.itemExcludeProducts", { products: string }) };
      }
      // If ONLY excluded categories are in the cart
      if (excludesCategories && hasOnlyExcludedCategoriesProductInCart(d.excludedCategories)) {
        const { string } = generateCategoriesString(d.excludedCategories);
        // Status is false because NO eligible items exist
        return { status: false, message: t("discountMessages.itemExcludeCategories", { categories: string }) };
      }
      // If some items are excluded but others are eligible, the code *is* usable (status: true),
      // but the calculation needs to handle it. No specific message needed here,
      // unless you want a warning like "Discount won't apply to {excluded_items}".
    }

    // If all checks pass, the code is usable
    return defaultSuccess;
  };

  return isDiscountCodeUsable; // Return the function
};

export default useIsDiscountCodeUsable;
