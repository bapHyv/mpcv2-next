import {
  CurrentCategory,
  Flower,
  Hash,
  Moonrock,
  Oil,
  Products,
} from "../types/productsTypes";

export interface FilterValues {
  propName: string;
  name: string;
  values: string[];
}

export interface FilterRateValues {
  propName: string;
  name: string;
  values: Rate;
}

export interface FilterGrowingMethodValues {
  propName: string;
  name: string;
  values: GrowingMethod;
}

type Rate = ["faible"?, "moyen"?, "fort"?];
type GrowingMethod = ["Sous serre"?, "interieur"?, "exterieur"?];

export type RateValue = "faible" | "moyen" | "fort";
export type GrowingMethodValue = "Sous serre" | "interieur" | "exterieur";

export interface IFilterClass {
  products: Products;
  currentCategory: CurrentCategory;

  cannabinoids: FilterValues;
  rate: FilterRateValues;
  terpenes: FilterValues;
  growingMethod: FilterGrowingMethodValues;

  addCannabinoidValue(value: string): void;
  addRate(value: RateValue): void;
  addTerpeneValue(value: string): void;
  addGrowingMethod(value: GrowingMethodValue): void;
  generateFilter(): void;
}

export class Filter implements IFilterClass {
  products = {} as any;
  currentCategory: CurrentCategory = "" as CurrentCategory;
  cannabinoids: FilterValues = {
    propName: "cannabinoids",
    name: "cannabinoids",
    values: [],
  };
  rate: FilterRateValues = {
    propName: "rate",
    name: "rate",
    values: [],
  };
  terpenes: FilterValues = {
    propName: "terpenes",
    name: "terpenes",
    values: [],
  };
  growingMethod: FilterGrowingMethodValues = {
    propName: "growingMethod",
    name: "Growing Method",
    values: [],
  };

  constructor(products: Products, currentCategory: CurrentCategory) {
    this.products = products;
    this.currentCategory = currentCategory;
  }

  addCannabinoidValue(value: string) {
    this.cannabinoids.values.push(value);
  }

  addRate(value: "faible" | "moyen" | "fort") {
    this.rate.values.push(value);
  }

  addTerpeneValue(value: string) {
    this.terpenes.values.push(value);
  }

  addGrowingMethod(value: "Sous serre" | "interieur" | "exterieur") {
    this.growingMethod.values.push(value);
  }

  generateFilter(): void {
    this.products[this.currentCategory].forEach(
      (product: Oil | Hash | Moonrock | Flower) => {
        Object.entries(product.cannabinoids).forEach(([key, value]) => {
          // ADD THE CANNABINOIDS IN THE FILTERS
          if (!this.cannabinoids.values.includes(key)) {
            this.addCannabinoidValue(key);
          }
          // ADD THE RATES IN THE FILTERS
          if (parseInt(value) < 10 && !this.rate.values.includes("faible")) {
            this.addRate("faible");
          } else if (
            parseInt(value) < 20 &&
            !this.rate.values.includes("moyen")
          ) {
            this.addRate("moyen");
          } else if (
            parseInt(value) >= 20 &&
            !this.rate.values.includes("fort")
          ) {
            this.addRate("fort");
          }

          // ADD THE TERPENES WHEN CATEGORY IS hashs, moonrocks or flowers
          if (
            this.currentCategory === "hashs" ||
            this.currentCategory === "moonrocks" ||
            this.currentCategory === "fleurs"
          ) {
            Object.entries(
              (product as Hash | Moonrock | Flower).terpenes
            ).forEach(([key]) => {
              if (!this.terpenes.values.includes(key)) {
                this.addTerpeneValue(key);
              }
            });
          }

          // ADD THE GROWING METHOD WHEN CATEGORY IS flowers
          if (this.currentCategory === "fleurs") {
            if (
              !this.growingMethod.values.includes(
                (product as Flower).growingMethod as GrowingMethodValue
              )
            ) {
              this.addGrowingMethod(
                (product as Flower).growingMethod as GrowingMethodValue
              );
            }
          }
        });
      }
    );
  }
}
