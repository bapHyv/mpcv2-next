import { linkClassname } from "@/app/staticData/cartPageClasses";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

interface Params {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params: { locale } }: Params) {
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function Page({ params: { locale } }: Params) {
  const t = await getTranslations({ locale, namespace: "about" });
  return (
    <div className="utility-page">
      {" "}
      {/* Apply base styling for utility pages */}
      {/* Page Title (H1) */}
      <h1>{t("pageTitle")}</h1>
      {/* Optional: Placeholder for an authentic image */}
      <div className="my-6 flex justify-center">
        <Image
          src="/bayonne.jpg"
          alt={t("imageAlt")} // Add translation for image alt text
          width={600} // Adjust dimensions
          height={400}
          className="rounded-lg shadow-md object-cover"
        />
      </div>
      {/* Section 1: The Spark - Origin Story */}
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mt-8 mb-4">{t("section1.title")}</h2>
      <p>{t("section1.para1")}</p>
      <p>{t("section1.para2")}</p>
      <p>{t("section1.para3")}</p>
      {/* Section 2: Our Commitment - Quality & Transparency */}
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mt-8 mb-4">{t("section2.title")}</h2>
      <p>{t("section2.intro")}</p>
      <ul className="list-disc list-inside space-y-2 my-4 text-gray-700">
        {" "}
        {/* Styled list */}
        <li>
          <strong>{t("section2.item1.label")}</strong> {t("section2.item1.text")}
        </li>
        <li>
          <strong>{t("section2.item2.label")}</strong> {t("section2.item2.text")}
        </li>
        <li>
          <strong>{t("section2.item3.label")}</strong> {t("section2.item3.text")}
        </li>
        <li>
          <strong>{t("section2.item4.label")}</strong> {t("section2.item4.text")}
        </li>
      </ul>
      {/* Section 3: More Than Products - A Vision for Wellness */}
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mt-8 mb-4">{t("section3.title")}</h2>
      <p>{t("section3.para1")}</p>
      <p>{t("section3.para2")}</p>
      <p>{t("section3.para3")}</p>
      {/* Concluding Call-to-Action */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        {" "}
        {/* Added spacing and separator */}
        <p className="mb-4 text-gray-600">{t("cta.intro")}</p>
        <div className="flex flex-wrap justify-center gap-4">
          {" "}
          {/* Flex layout for links */}
          <Link href={`/${locale}/fleurs-cbd`} className={linkClassname}>
            {t("cta.link1")}
          </Link>
          <Link href={`/${locale}/huiles-cbd`} className={linkClassname}>
            {t("cta.link2")}
          </Link>
          <Link href={`/${locale}/blog`} className={linkClassname}>
            {t("cta.link3")}
          </Link>
        </div>
      </div>
    </div>
  );
}
