import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { APIResponse, categories, Product } from "@/app/types/productsTypes";
import Title from "@/app/components/Title";
import clsx from "clsx";

import { doesCategoryExists, findSlug, findTitle } from "@/app/utils/productFunctions";
import ProductCard from "@/app/components/products/ProductCard";
import ProductCardSkeleton from "@/app/components/products/ProductCardSkeleton";
import Link from "next/link";
import OtherNavbar from "@/app/components/OtherNavbar";
import { twMerge } from "tailwind-merge";
import { titleClassname } from "@/app/staticData/cartPageClasses";

interface Params {
  params: {
    locale: string;
    category: string;
  };
}

export default async function Page({ params: { locale, category } }: Params) {
  const t = await getTranslations({ locale, namespace: "category" });

  const categories: categories = [
    {
      url: "fleurs%20de%20cbd",
      urlTitle: `🌿 ${t("flower")}`,
      category: "fleurs",
      title: t("flower"),
      slug: "fleurs-cbd",
    },
    {
      url: "hash%20de%20cbd",
      urlTitle: `🍫 ${t("hash")}`,
      category: "hashs",
      title: t("hash"),
      slug: "pollens-resines-hash-cbd",
    },
    {
      url: "moonrocks",
      urlTitle: `🌠 ${t("moonrock")}`,
      category: "moonrocks",
      title: t("moonrock"),
      slug: "moonrocks-cbd",
    },
    { url: "huiles", urlTitle: `💧 ${t("oil")}`, category: "huiles", title: t("oil"), slug: "huiles-cbd" },
    {
      url: "infusions",
      urlTitle: `🌱 ${t("herbalTea")}`,
      category: "infusions",
      title: t("herbalTea"),
      slug: "infusions-cbd",
    },
    { url: "soins", urlTitle: `🧴 ${t("health")}`, category: "soins", title: t("health"), slug: "soins-cbd" },
    {
      url: "vaporisateurs",
      urlTitle: `💨 ${t("vaporizer")}`,
      category: "vaporisateurs",
      title: t("vaporizer"),
      slug: "vaporisateur",
    },
  ];

  if (!doesCategoryExists(categories, category)) notFound();

  const currentTitle = findTitle(categories, category);

  const currentSlug = findSlug(categories, category);

  const response = await fetch(`${process.env.API_HOST}/products/${currentSlug}`);
  const data: APIResponse<Product> = await response.json();
  const formatedProducts: Product[] = Object.values(data.products);

  return (
    <div>
      <p>Merci, votre commande à bien été reçue</p>
      <table>
        <caption className="caption-bottom">Résumé de votre commande</caption>
        <thead className="bg-green border border-black text-white">
          <tr className="uppercase">
            <th className="border border-black py-2 px-4">numéro de commande</th>
            <th className="border border-black py-2 px-4">date</th>
            <th className="border border-black py-2 px-4">e-mail</th>
            <th className="border border-black py-2 px-4">total</th>
            <th className="border border-black py-2 px-4">moyen de paiement</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black py-2 px-4">22305</td>
            <td className="border border-black py-2 px-4">14/03/2025</td>
            <td className="border border-black py-2 px-4">dbalzary@gmail.com</td>
            <td className="border border-black py-2 px-4">156,94€</td>
            <td className="border border-black py-2 px-4">Virement bancaire</td>
          </tr>
        </tbody>
      </table>

      <Title
        title="Nos coordonnées bancaires"
        type="h2"
        classname={`relative mt-4 sm:mt-8 2xl:pl-2 uppercase text-lg text-green font-bold tracking-widest`}
        firstLetterClassname="text-2xl"
      />

      <Title
        title="MONPLANCBD:"
        type="h3"
        classname={`relative mt-4 sm:mt-8 2xl:pl-2 uppercase text-md text-green font-bold tracking-widest`}
        firstLetterClassname="text-xl"
      />

      <table>
        <thead className="bg-green border border-black text-white">
          <tr>
            <th className="border border-black py-2 px-4">banque</th>
            <th className="border border-black py-2 px-4">numéros du compte</th>
            <th className="border border-black py-2 px-4">code guichet</th>
            <th className="border border-black py-2 px-4">IBAN</th>
            <th className="border border-black py-2 px-4">BIC</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black py-2 px-4">LCL</td>
            <td className="border border-black py-2 px-4">0000070699C</td>
            <td className="border border-black py-2 px-4">01747</td>
            <td className="border border-black py-2 px-4">FR05 3000 2017 4700 0007 0699 C46</td>
            <td className="border border-black py-2 px-4">CRLYFRPP</td>
          </tr>
        </tbody>
      </table>

      <Title
        title="Détails de la commande"
        type="h2"
        classname={`relative mt-4 sm:mt-8 2xl:pl-2 uppercase text-lg text-green font-bold tracking-widest`}
        firstLetterClassname="text-2xl"
      />
      <div className="w-1/2 flex items-center justify-between">
        <span>Produit</span>
        <span>Total</span>
      </div>
      <div className="w-1/2 h-[1px] bg-black"></div>
      <div className="w-1/2 flex items-center justify-between">
        <span>MIX SMALL BUDS + TRIM 5g - 1 x 5.49€</span>
        <span>5.49€</span>
      </div>
      <div className="w-1/2 flex items-center justify-between">
        <span>ROSIN CBD | CBD + CBDa: 61,83% 1g - 3 x 10.5€</span>
        <span>31.5€</span>
      </div>
      <div className="w-1/2 h-[1px] bg-black"></div>
      <div className="w-1/2 flex items-center justify-between">
        <span>Sous-total</span>
        <span>36.99€</span>
      </div>
      <div className="w-1/2 flex items-center justify-between">
        <span>Expédition</span>
        <span>Envoi à domicile</span>
      </div>
      <div className="w-1/2 flex items-center justify-between">
        <span>Moyen de paiement</span>
        <span>Virement bancaire</span>
      </div>
      <div className="w-1/2 flex items-center justify-between">
        <span>Total</span>
        <span>156,94€ (dont 8,16€ de TVA)</span>
      </div>

      <Title
        title="Adresse de facturation"
        type="h2"
        classname={`relative mt-4 sm:mt-8 2xl:pl-2 uppercase text-lg text-green font-bold tracking-widest`}
        firstLetterClassname="text-2xl"
      />
      <div className="flex flex-col">
        <span>David BOUCHET</span>
        <span>13 RUE DES CORDELIERS</span>
        <span>64210 BIDART</span>
        <span>0651525354</span>
        <span>dbalzary@gmail.com</span>
      </div>
      <Title
        title="Adresse de livraison"
        type="h2"
        classname={`relative mt-4 sm:mt-8 2xl:pl-2 uppercase text-lg text-green font-bold tracking-widest`}
        firstLetterClassname="text-2xl"
      />
      <div className="flex flex-col">
        <span>David BOUCHET</span>
        <span>13 RUE DES CORDELIERS</span>
        <span>64210 BIDART</span>
        <span>0651525354</span>
        <span>dbalzary@gmail.com</span>
      </div>
    </div>
  );
}
