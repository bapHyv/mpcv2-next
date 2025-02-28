import { DiscountCode } from "@/app/types/sseTypes";
import { ProductCart } from "@/app/context/productsAndCartContext";
import { DiscountApplied } from "@/app/types/orderTypes";

/**
 *
 *
 */

export const computePercentDiscount = (d: DiscountApplied, products: ProductCart[]) => {
  const { discountValue, nbItemsLimit, requiredProducts, requiredCategories, excludedProducts, excludedCategories } = d;

  // Convert discountValue to a number
  const discountPercent = parseFloat(discountValue) / 100;

  // Filter products based on requiredProducts, requiredCategories, excludedProducts, and excludedCategories
  let eligibleProducts = products.filter((product) => {
    // Check if the product is excluded
    if (excludedProducts.includes(product.id.toString()) || excludedCategories.includes(product.categoryId)) {
      return false;
    }

    // Check if the product is required
    if (requiredProducts.length > 0 && !requiredProducts.includes(product.id.toString())) {
      return false;
    }

    // Check if the product belongs to a required category
    if (requiredCategories.length > 0 && !requiredCategories.includes(product.categoryId)) {
      return false;
    }

    return true;
  });

  if (!nbItemsLimit) return eligibleProducts.reduce((sum, product) => sum + product.totalPrice * discountPercent, 0);

  // Treat each item as a separate unit
  let expandedProducts: ProductCart[] = [];
  eligibleProducts.forEach((product) => {
    for (let i = 0; i < product.quantity; i++) {
      expandedProducts.push({ ...product, quantity: 1, totalPrice: product.unitPrice });
    }
  });

  // Sort expandedProducts products by unitPrice in descending order
  expandedProducts.sort((a, b) => b.unitPrice - a.unitPrice);

  const limitedProducts = expandedProducts.slice(0, nbItemsLimit);

  return limitedProducts.reduce((sum, product) => sum + product.totalPrice * discountPercent, 0);
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
 *
 *
 *
 * percent:
 *
 * Définitions:
 * produit = une fleur, huile, hash etc...
 * article = 1 quantité d'un produit. Ex: 2 * MIX SMALL BUD 25g. Le produit c'est MIX SMALL BUD 25g et j'ai 2 article de ce produit.
 * quantité = le nombre d'article d'un produit. 2 * MIX SMALL BUD 25g. La quantité est 2.
 *
 * Fonctionnement nbItemsLimit:
 *   -S'applique toujours sur le ou les articles les plus cher.
 *
 * S'il n'y a rien dans requiredProducts, requiredCategories, excludedProducts et excludedCategories, le code s'applique sur:
 *  [x] Si nbItemsLimit = 0 -> Tout le panier
 *  [x] Si nbItemsLimit = X -> Sur X articles (toujours sur les plus cher)
 *
 * S'il y a quelque chose dans requiredProducts: MIX SMALL BUD
 *  [x] Si nbItemsLimit = 0 -> Appliquer sur le ou les articles requiredProducts
 *  [x] Si nbItemsLimit = X -> Appliquer sur X articles requiredProducts (toujours sur les plus cher)
 *      nbItemsLimit: 3;
 *      PANIER ==> MIX SMALL BUD * 5
 *      RÉSULTAT ==> Doit s'appliquer sur les 3 articles les plus cher
 *
 * S'il y a quelque chose dans requiredCategories: fleurs-cbd
 *  [x] Si nbItemsLimit = 0 -> Appliquer sur tous les articles de la ou les catégories; Doit s'appliquer sur toutes les fleurs de CBD
 *  [x] Si nbItemsLimit = X -> Appliquer sur X artcles de la ou les catégories (toujours sur les plus cher);
 *        nbItemsLimit: 3;
 *        PANIER ==> CANNATONIC 1*3g, CANNATONIC 1*5g, CANNATONIC 1*10g, CANNATONIC 1*25g, ROSIN 1*10g, HUILE 1*30%
 *        RÉSULTAT ==> Doit s'appliquer sur les 3 articles fleurs-cbd les plus cher
 *
 * S'il y a quelque chose dans excludedProducts: CANNATONIC
 *  [x] Si nbItemsLimit = 0 -> Appliquer sur tous les articles hormis ceux présent dans excludedProducts
 *      nbItemsLimit: 0;
 *      PANIER ==> CANNATONIC 1*3g, CANNATONIC 1*5g, CANNATONIC 1*10g, CANNATONIC 1*25g, ROSIN 1*10g, HUILE 1*30%
 *      RÉSULTAT ==> Doit s'appliquer sur les articles différent de CANNATONIC
 *  [x] Si nbItemsLimit = X -> Appliquer sur X articles hormis ceux présent dans excludedProducts (toujours sur les plus cher)
 *      nbItemsLimit: 3;
 *      PANIER ==> CANNATONIC 1*3g, CANNATONIC 1*5g, CANNATONIC 1*10g, CANNATONIC 1*25g, ROSIN 1*10g, HUILE 1*30%, MIX SMALL BUD 1*25g
 *      RÉSULTAT ==> Doit s'appliquer sur les 3 articles les plus cher différent de CANNATONIC
 *
 * S'il y a quelque chose dans excludedCategories: fleurs-cbd
 *  [x] Si nbItemsLimit = 0 -> Appliquer sur tous les articles hormis ceux de la ou les excludedCategories
 *      nbItemsLimit: 0;
 *      PANIER ==> CANNATONIC 1*3g, CANNATONIC 1*5g, CANNATONIC 1*10g, CANNATONIC 1*25g, ROSIN 1*10g, HUILE 1*30%, MIX SMALL BUD 1*25g
 *      RÉSULTAT ==> Doit s'appliquer sur les articles qui n'appartiennent pas à la catégorie fleurs-cbd (rosin et huile)
 *  [x] Si nbItemsLimit = X -> Appliquer sur X articles hormis ceux qui appartiennent à la ou les excludedCategories
 *      nbItemsLimit: 3;
 *      PANIER ==> CANNATONIC 1*3g, CANNATONIC 1*5g, CANNATONIC 1*10g, CANNATONIC 1*25g, ROSIN 1*10g, HUILE 1*30%, MIX SMALL BUD 1*25g, DRY SIFT 1*25g, DRY SIFT 1*50g
 *      RÉSULTAT ==> Doit s'appliquer sur les 3 articles les plus cher qui n'appartiennent pas à la catégorie fleurs-cbd (rosin, huile, dry sift 50g)
 *
 * MIX:50
 * MAX:150
 */

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

const d = {
  discountType: "percent",
  discountValue: "10.00",
  nbItemsLimit: 0,
  requiredProducts: ["18601", "327"],
  requiredCategories: [26, 28],
  excludedProducts: ["20460", "8463"],
  excludedCategories: [37, 36],
};

const hasCategories = (ids: number[], products: ProductCart[]) => {
  const set = new Set(ids);
  return products.some((p) => set.has(p.categoryId));
};

const hasProducts = (ids: string[], products: ProductCart[]) => {
  const set = new Set(ids);
  return products.some((p) => set.has(p.id.toString()));
};

export const isDiscountCodeUsable = (d: DiscountCode, c: { total: number; products: ProductCart[] }, l: number) => {
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

  if (d.excludePromoProduct && hasProductInPromo) {
    return false;
  }

  if (d.individualUse && Boolean(l)) {
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
