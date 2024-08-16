import Paragraph from "@/app/components/Paragraph";
import Title from "@/app/components/Title";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

interface Params {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params: { locale } }: Params) {
  const t = await getTranslations({ locale, namespace: "legalNotices" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function Page({ params: { locale } }: Params) {
  const t = await getTranslations({ locale, namespace: "legalNotices" });
  return (
    <>
      <Title
        type="h1"
        title={t("title")}
        classname="text-center mt-10 text-5xl text-green"
      />
      <Paragraph p={t("p1")} classname="text-justify text-xl" />
      <div className="flex">
        <div className="p-2">
          <Title
            type="h2"
            title={t("subtitle2")}
            classname="my-2 text-3xl text-green"
          />
          <p>
            -Nom de la Société:{" "}
            <span className="font-bold">SAS MONPLANCBD</span> <br />
            -Adresse du siège social:{" "}
            <span className="font-bold">
              2 place Elie Lambert, 64100, Bayonne
            </span>{" "}
            <br />
            -Téléphone: <span className="font-bold">06.51.64.16.43</span> <br />
            -Capital: <span className="font-bold">1000 €</span> <br />
            -SIRET: <span className="font-bold">88780395500012</span> <br />
            -R.C.S:{" "}
            <span className="font-bold">887 803 955 R.C.S. BAYONNE</span> <br />
            -Numéro TVA intracommunautaire:{" "}
            <span className="font-bold">FR39 887803955</span> <br />
            -Adresse de courrier électronique:{" "}
            <span className="font-bold">contact@monplancbd.fr</span> <br />
            <Link
              className="text-green font-bold"
              href={`/${locale}/conditions_generales_de_vente`}
            >
              -Conditions générales de vente
            </Link>
          </p>
        </div>
        <div className="p-2">
          <Title
            type="h2"
            title={t("subtitle3")}
            classname="my-2 text-3xl text-green"
          />
          <p>
            Adresse:{" "}
            <span className="font-bold">
              ONLINE SAS BP 438 75366 PARIS CEDEX 08 FRANCE
            </span>{" "}
            <br />
            Téléphone: <span className="font-bold">+33 (0)1 84 13 00 00</span>
          </p>
        </div>
        <div className="p-2">
          <Title
            type="h2"
            title={t("subtitle4")}
            classname="my-2 text-3xl text-green"
          />
          <p>
            -Créateur du site: <span className="font-bold">MonPlanCBD</span>{" "}
            <br />
            -Responsable de la publication:{" "}
            <span className="font-bold">HAMDADA Mohamed Yacine</span> <br />
            -Contacter le responsable de la publication:{" "}
            <span className="font-bold">contact@monplancbd.fr</span> <br />
            -Le responsable de la publication est une personne morale -Le
            Webmaster est:{" "}
            <span className="font-bold">HAMDADA Mohamed Yacine</span> <br />
            -Contacter le Webmaster:{" "}
            <span className="font-bold">contact@monplancbd.fr</span>
            <br />
          </p>
        </div>
      </div>
      <Title
        type="h2"
        title={t("subtitle5")}
        classname="my-2 text-3xl text-green"
      />
      <Paragraph p={t("p2")} classname="text-justify text-xl" />
      <Title
        type="h2"
        title={t("subtitle6")}
        classname="my-2 text-3xl text-green"
      />
      <Paragraph p={t("p3")} classname="text-justify text-xl" />
    </>
  );
}
