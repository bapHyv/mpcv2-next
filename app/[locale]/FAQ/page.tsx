import Paragraph from "@/app/components/Paragraph";
import Title from "@/app/components/Title";
import { getTranslations } from "next-intl/server";

interface Params {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params: { locale } }: Params) {
  const t = await getTranslations({ locale, namespace: "FAQ" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function Page({ params: { locale } }: Params) {
  const t = await getTranslations({ locale, namespace: "FAQ" });
  return (
    <>
      <Title
        type="h1"
        title={t("title")}
        classname="text-center mt-10 text-5xl text-green"
      />
      <div className="mx-">
        <Title
          type="h2"
          title={t("subtitle1")}
          classname="my-2 text-3xl text-green"
        />
        <Paragraph p={t("p1")} classname="text-justify text-xl" />
        <Title
          type="h2"
          title={t("subtitle2")}
          classname="my-2 text-3xl text-green"
        />
        <Paragraph p={t("p2")} classname="text-justify text-xl" />
        <Title
          type="h2"
          title={t("subtitle3")}
          classname="my-2 text-3xl text-green"
        />
        <Paragraph p={t("p3")} classname="text-justify text-xl" />
        <Title
          type="h2"
          title={t("subtitle4")}
          classname="my-2 text-3xl text-green"
        />
        <Paragraph p={t("p4")} classname="text-justify text-xl" />
        <Title
          type="h2"
          title={t("subtitle5")}
          classname="my-2 text-3xl text-green"
        />
        <Paragraph p={t("p5")} classname="text-justify text-xl" />
      </div>
    </>
  );
}
