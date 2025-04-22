import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Title from "@/app/components/Title";
import CleanUpAfterPayment from "@/app/components/CleanUpAfterPayment";

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface GenerateMetadataParams {
  params: { locale: string };
}

export async function generateMetadata({ params }: GenerateMetadataParams): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "bankTransferPage" });

  return {
    title: t("metadataTitle"),
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
        "max-video-preview": -1,
        "max-image-preview": "none",
        "max-snippet": -1,
      },
    },
  };
}

export default async function Page() {
  const hasCookies = cookies().get("allow_bank_transfer_access");

  if (!hasCookies || hasCookies.value !== "true") redirect("/");

  return (
    <>
      <Title
        title="Paiement par virement bancaire"
        type="h1"
        classname={`relative mt-4 sm:mt-8 2xl:pl-2 uppercase text-xl text-green font-bold tracking-widest`}
        firstLetterClassname="text-4xl"
      />
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
      <CleanUpAfterPayment />
    </>
  );
}
