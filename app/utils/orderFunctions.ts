import { DiscountCode } from "@/app/types/sseTypes";
import { ProductCart } from "@/app/context/productsAndCartContext";

export const computePercent = (tot: number, percent: number) => {
  return tot - tot * (1 - percent / 100);
};

/**
 * individualUse:
 *
 * Make a loop that goes through the discountApplied to check if one of them has individualUse: true
 *
 * excludePromoProduct:
 *
 *
 *
 * in commande page:
 * Check in discountApplied if freeShipping is true
 *
 *
 * fixed_cart:
 * S'il n'y a rien dans requiredProducts, requiredCategories, excludedProducts et excludedCategories la remise s'applique sur tout le panier.
 * S'il y a quelque chose dans requiredProducts, le code est applicable s'il y a ce ou ces produits dans le panier.
 * S'il y a quelque chose dans requiredCategories, ce code est applicable s'il y a cette ou ces categories dans le panier.
 * S'il y a quelque chose dans excludedProducts, ce code n'est PAS applicable s'il y a ce ou ces produits dans le panier.
 * S'il y a quelque chose dans excludedCategories, ce code n'est PAS applicable s'il y a un produit qui appartient a ce ou ces catégories.
 * PRENDRE EN COMPTE excludePromoProduct.
 *
 *
 * Faire un code fixed_cart:
 *
 *  Sans rien:
 *    [x] Tester sans condition => Doit être utilisable
 *
 *  Avec individualUse:
 *    [-] Utiliser => Tous les codes ne doivent pas etre utilisable
 *    [-] Si un autre est utisé => Celui là doit être désactivé
 *
 *  Avec excludePromo:
 *    [x] Tester avec un produit en promo => Ne doit pas être utilisable
 *    [x] Tester un produit hors promo => Doit être utilisable
 *    [x] Tester avec un produit en promo et un produit hors promo => Ne doit pas etre utilisable
 *
 *  Avec un requiredProduct: MIX SMALL BUDS 25g
 *    [x] Tester sans le requiredProduct => Ne doit PAS être utilisable
 *    [-] Tester avec le requiredProduct => Doit être utilisable
 *    [-] Tester avec le requiredProduct et d'autre produits => Doit être utilisable
 *
 *  Avec un requiredCategories: fleurs-cbd
 *    [x] Tester sans un produit de requiredCategories => Ne doit PAS être utilisable
 *    [x] Tester avec un produit de requiredCategories => Doit être utilisable
 *    [x] Tester avec un produit de requiredCategories et un produit pas dans la categorie => Doit être utilisable
 *
 *  Avec un excludedProduct: MIX SMALL BUDS 25g
 *    [x] Tester sans le excludedProduct => Doit être utilisable
 *    [-] Tester avec le excludedProduct => Ne doit PAS être utilisable
 *    [-] Tester avec le excludedProduct et d'autre produit => Ne doit PAS être utilisable
 *
 *  Avec un excludedCategories: fleurs-cbd
 *    [-] Tester sans un produit de excludedCategories => Doit être utilisable
 *    [x] Tester avec un produit de excludedCategories => Ne doit PAS être utilisable
 *    [x] Tester avec un produit de excludedCategories et d'autres produits de différentes catégories => Ne doit PAS être utilisable
 *
 *
 */

const hasCategories = (ids: number[], products: ProductCart[]) => {
  const set = new Set(ids);
  return products.some((p) => set.has(p.categoryId));
};

const hasProducts = (ids: string[], products: ProductCart[]) => {
  const set = new Set(ids);
  return products.some((p) => set.has(p.id.toString()));
};

export const isDiscountCodeUsable = (d: DiscountCode, c: { total: number; products: ProductCart[] }, name: string) => {
  const min = parseInt(d.minCartAmount);
  const max = parseInt(d.maxCartAmount);
  const hasMin = !!min;
  const hasMax = !!max;
  const fcart = d.discountType === "fixed_cart";
  const percent = d.discountType === "percent";
  const fprod = d.discountType === "fixed_product";
  const hasProductInPromo = c.products.some((product) => product.isPromo);
  const excludesProducts = !!d.excludedProducts.length;
  const excludesCategories = !!d.excludedCategories.length;
  const requiresProducts = !!d.requiredProducts.length;
  const requiresCategories = !!d.requiredCategories.length;

  if (hasMin && c.total < min) {
    return false;
  }

  if (hasMax && c.total > max) {
    return false;
  }

  if (fcart && d.excludePromoProduct && hasProductInPromo) {
    return false;
  }

  if (fcart && !d.excludePromoProduct && excludesProducts && hasProducts(d.excludedProducts, c.products)) {
    return false;
  }

  if (fcart && !d.excludePromoProduct && excludesCategories && hasCategories(d.excludedCategories, c.products)) {
    return false;
  }

  if (fcart && !d.excludePromoProduct && requiresProducts && !hasProducts(d.requiredProducts, c.products)) {
    return false;
  }

  if (fcart && !d.excludePromoProduct && requiresCategories && !hasCategories(d.requiredCategories, c.products)) {
    return false;
  }

  return true;
};

const disc = {
  linkedToUser: false,
  individualUse: true,
  discountType: "fixed_cart",
  discountValue: "10.00",
  freeShipping: false,
  minCartAmount: "20.00",
  maxCartAmount: "150.00",
  excludePromoProduct: true,
  maxUsage: 1,
  maxUsageByUser: 1,
  nbItemsLimit: 0,
  requiredProducts: ["18601", "327"],
  requiredCategories: [26, 28],
  excludedProducts: ["20460", "8463"],
  excludedCategories: [37, 36],
  totalUsage: 0,
};
