import type { Metadata } from "next";
import { linkClassname } from "@/app/staticData/cartPageClasses";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

interface GenerateMetadataParams {
  params: { locale: string };
}

export async function generateMetadata({ params }: GenerateMetadataParams): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "" });
  const siteBaseUrl = process.env.MAIN_URL || "https://www.monplancbd.fr";

  const title = t("metadataConditionsOfUse.title");
  const description = t("metadataConditionsOfUse.description");

  return {
    title: title,
    description: description,
    alternates: {
      canonical: `${siteBaseUrl}/${locale}/conditions-dutilisation`,
    },
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
        noimageindex: true,
        "max-video-preview": -1,
        "max-image-preview": "none",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: title,
      description: description,
      url: `${siteBaseUrl}/${locale}/conditions-dutilisation`,
      siteName: t("global.brandName"),
      images: [{ url: `${siteBaseUrl}/og-image-default.png`, width: 1200, height: 630, alt: "MonPlanCBD" }],
      locale: locale.replace("-", "_"),
      type: "article",
    },
    twitter: {
      card: "summary",
      title: title,
      description: description,
      images: [`${siteBaseUrl}/og-image-default.png`],
    },
  };
}

interface Params {
  params: {
    locale: string;
  };
}

export default async function Page({ params: { locale } }: Params) {
  const t = await getTranslations({ locale, namespace: "conditionsOfUse" });
  return (
    <div className="utility-page">
      <h1>{t("pageTitle")}</h1>
      {/* Optional: Add Last Updated Date Dynamically if needed */}
      <p className="text-sm text-gray-500 mb-6">{t("lastUpdated")}</p>
      {/* 1. Introduction et Acceptation des Conditions */}
      <h2>{t("section1.title")}</h2>
      <p>{t("section1.para1")}</p>
      <p
        dangerouslySetInnerHTML={{
          __html: t("section1.para2", {
            // Use dangerouslySetInnerHTML for embedded link
            privacyPolicyLink: `<a href="/${locale}/politiques-de-confidentialites" class="${linkClassname}">${t(
              "section1.privacyPolicyLinkText"
            )}</a>`,
          }),
        }}
      />
      <p>{t("section1.para3")}</p>
      {/* 2. Définitions */}
      <h2>{t("section2.title")}</h2>
      <p>{t("section2.intro")}</p>
      <ul className="list-disc list-inside space-y-1 my-4">
        <li>
          <strong>{t("section2.terms.site.label")}:</strong> {t("section2.terms.site.definition")}
        </li>
        <li>
          <strong>{t("section2.terms.user.label")}:</strong> {t("section2.terms.user.definition")}
        </li>
        <li>
          <strong>{t("section2.terms.monplancbd.label")}:</strong>
          <span
            dangerouslySetInnerHTML={{
              __html: t("section2.terms.monplancbd.definition", {
                // Use dangerouslySetInnerHTML for embedded link
                legalNoticesLink: `<a href="/${locale}/mentions-legales" class="${linkClassname}">${t(
                  "section2.terms.monplancbd.legalNoticesLinkText"
                )}</a>`,
              }),
            }}
          />
        </li>
        <li>
          <strong>{t("section2.terms.product.label")}:</strong> {t("section2.terms.product.definition")}
        </li>
        <li>
          <strong>{t("section2.terms.content.label")}:</strong> {t("section2.terms.content.definition")}
        </li>
        <li>
          <strong>{t("section2.terms.cgv.label")}:</strong>
          <span
            dangerouslySetInnerHTML={{
              __html: t("section2.terms.cgv.definition", {
                // Use dangerouslySetInnerHTML for embedded link
                cgvLink: `<a href="/${locale}/conditions-generales-de-vente" class="${linkClassname}">${t("section2.terms.cgv.cgvLinkText")}</a>`,
              }),
            }}
          />
        </li>
        <li>
          <strong>{t("section2.terms.cgu.label")}:</strong> {t("section2.terms.cgu.definition")}
        </li>
      </ul>
      {/* 3. Accès au Site et Éligibilité (Utilisateurs Majeurs) */}
      <h2>{t("section3.title")}</h2>
      <p>
        <strong>{t("section3.para1")}</strong>
      </p>{" "}
      {/* Emphasis added */}
      <p>{t("section3.para2")}</p>
      <p>{t("section3.para3")}</p>
      <h3>{t("section3.subsection_availability.title")}</h3>
      <p>{t("section3.subsection_availability.para1")}</p>
      <p>{t("section3.subsection_availability.para2")}</p>
      {/* 4. Comptes Utilisateurs (Account Creation During Checkout Version) */}
      <h2>{t("section4.title")}</h2>
      {/* Note: strong tag moved into the translation key for para1 */}
      <p dangerouslySetInnerHTML={{ __html: t("section4.para1") }} />
      <p
        dangerouslySetInnerHTML={{
          __html: t("section4.para2", {
            // Use dangerouslySetInnerHTML for embedded link
            privacyPolicyLink: `<a href="/${locale}/politiques-de-confidentialites" class="${linkClassname}">${t(
              "section4.privacyPolicyLinkText"
            )}</a>`,
          }),
        }}
      />
      <p>{t("section4.para3")}</p>
      <p>{t("section4.para4")}</p>
      {/* 5. Propriété Intellectuelle */}
      <h2>{t("section5.title")}</h2>
      <p>{t("section5.para1")}</p>
      <p>{t("section5.para2")}</p>
      <p>{t("section5.para3")}</p>
      <h2>{t("section6.title")}</h2>
      <p>{t("section6.intro")}</p>
      {/* 6.1 Nature des Produits et Conformité Légale (THC < 0,3%) */}
      <h3>{t("section6.subsection_compliance.title")}</h3>
      <p dangerouslySetInnerHTML={{ __html: t("section6.subsection_compliance.para1") }} /> {/* Allows <strong> */}
      <p>{t("section6.subsection_compliance.para2")}</p>
      {/* 6.2 Absence d'Allégations Thérapeutiques */}
      <h3>{t("section6.subsection_no_medical_claims.title")}</h3>
      <p>
        <strong>{t("section6.subsection_no_medical_claims.warning")}</strong>
      </p>{" "}
      {/* Warning emphasis */}
      <p>{t("section6.subsection_no_medical_claims.para1")}</p>
      {/* 6.3 Recommandations d'Utilisation (Infusion/Vaporisation) */}
      <h3>{t("section6.subsection_usage_recommendations.title")}</h3>
      <p>{t("section6.subsection_usage_recommendations.intro")}</p>
      <ul className="list-disc list-inside space-y-1 my-4">
        <li>
          <strong>{t("section6.subsection_usage_recommendations.item_flowers.label")}</strong>{" "}
          {t("section6.subsection_usage_recommendations.item_flowers.text")}
        </li>
        <li>
          <strong>{t("section6.subsection_usage_recommendations.item_oils.label")}</strong>{" "}
          {t("section6.subsection_usage_recommendations.item_oils.text")}
        </li>
      </ul>
      <p>{t("section6.subsection_usage_recommendations.outro")}</p>
      {/* 6.4 Interdiction de Fumer */}
      <h3>{t("section6.subsection_no_smoking.title")}</h3>
      {/* Using dangerouslySetInnerHTML to allow potential <strong> tags if needed in translation */}
      <p dangerouslySetInnerHTML={{ __html: t("section6.subsection_no_smoking.para1") }} />
      {/* 6.5 Précautions d'Usage (Santé, Conduite, Grossesse) */}
      <h3>{t("section6.subsection_precautions.title")}</h3>
      <ul className="list-disc list-inside space-y-1 my-4">
        <li>
          <strong>{t("section6.subsection_precautions.item_medical.label")}</strong> {t("section6.subsection_precautions.item_medical.text")}
        </li>
        <li>
          <strong>{t("section6.subsection_precautions.item_driving.label")}</strong> {t("section6.subsection_precautions.item_driving.text")}
        </li>
        <li>
          <strong>{t("section6.subsection_precautions.item_pregnancy.label")}</strong> {t("section6.subsection_precautions.item_pregnancy.text")}
        </li>
        <li>
          <strong>{t("section6.subsection_precautions.item_minors.label")}</strong> {t("section6.subsection_precautions.item_minors.text")}
        </li>
      </ul>
      {/* 6.6 Variabilité des Effets */}
      <h3>{t("section6.subsection_variability.title")}</h3>
      <p>{t("section6.subsection_variability.para1")}</p>
      {/* 7. Conduite de l'Utilisateur et Utilisations Interdites */}
      <h2>{t("section7.title")}</h2>
      <p>{t("section7.intro")}</p>
      <ul className="list-disc list-inside space-y-1 my-4">
        <li>{t("section7.item1")}</li>
        <li>{t("section7.item2")}</li>
        <li>{t("section7.item3")}</li>
        <li>{t("section7.item4")}</li>
        <li>{t("section7.item5")}</li>
        <li>{t("section7.item6")}</li>
        <li>{t("section7.item7")}</li>
        <li>{t("section7.item8")}</li>
        <li>{t("section7.item9")}</li>
        <li>{t("section7.item10_technical_responsibility")}</li>
      </ul>
      {/* 8. Contenu Généré par les Utilisateurs (Avis Produits) */}
      <h2>{t("section8.title")}</h2>
      <p>{t("section8.para1")}</p>
      <p>{t("section8.para2")}</p>
      <ul className="list-disc list-inside space-y-1 my-4">
        <li>{t("section8.item1")}</li>
        <li>{t("section8.item2")}</li>
        <li>{t("section8.item3")}</li>
        {/* Emphasis on no medical claims */}
        <li>
          <strong>{t("section8.item4_medical_claim")}</strong>
        </li>
        <li>{t("section8.item5")}</li>
      </ul>
      <p>{t("section8.para3")}</p>
      <p>{t("section8.para4")}</p>
      {/* 9. Liens Vers des Sites Tiers */}
      <h2>{t("section9.title")}</h2>
      <p>{t("section9.para1")}</p>
      <p>{t("section9.para2")}</p>
      <p>{t("section9.para3")}</p>
      {/* 10. Exonération de Garanties */}
      <h2>{t("section10.title")}</h2>
      {/* Using dangerouslySetInnerHTML as the content is legal text often styled specifically (e.g., uppercase) */}
      <p dangerouslySetInnerHTML={{ __html: t("section10.para1") }} />
      <p dangerouslySetInnerHTML={{ __html: t("section10.para2") }} />
      <p dangerouslySetInnerHTML={{ __html: t("section10.para3") }} />
      {/* 11. Limitation de Responsabilité */}
      <h2>{t("section11.title")}</h2>
      {/* Using dangerouslySetInnerHTML for legal text */}
      <p dangerouslySetInnerHTML={{ __html: t("section11.para1") }} />
      <p dangerouslySetInnerHTML={{ __html: t("section11.para2") }} />
      <p dangerouslySetInnerHTML={{ __html: t("section11.para3") }} />
      {/* 12. Indemnisation */}
      <h2>{t("section12.title")}</h2>
      <p>{t("section12.para1")}</p>
      {/* 13. Politique de Confidentialité et Conditions Générales de Vente */}
      <h2>{t("section13.title")}</h2>
      <p
        dangerouslySetInnerHTML={{
          __html: t("section13.para1", {
            // For Privacy Policy link
            privacyPolicyLink: `<a href="/${locale}/politiques-de-confidentialites" class="${linkClassname}">${t(
              "section13.privacyPolicyLinkText"
            )}</a>`,
          }),
        }}
      />
      <p
        dangerouslySetInnerHTML={{
          __html: t("section13.para2", {
            // For CGV link
            cgvLink: `<a href="/${locale}/conditions-generales-de-vente" class="${linkClassname}">${t("section13.cgvLinkText")}</a>`,
          }),
        }}
      />
      <p>{t("section13.para3")}</p>
      {/* 14. Modification des Conditions d'Utilisation */}
      <h2>{t("section14.title")}</h2>
      <p>{t("section14.para1")}</p>
      <p>{t("section14.para2")}</p>
      {/* 15. Résiliation */}
      <h2>{t("section15.title")}</h2>
      <p>{t("section15.para1")}</p>
      <p>{t("section15.para2")}</p>
      {/* 16. Droit Applicable et Règlement des Différends */}
      <h2>{t("section16.title")}</h2>
      <p>{t("section16.para1")}</p>
      <p>{t("section16.para2")}</p>
      {/* 17. Nous Contacter */}
      <h2>{t("section17.title")}</h2>
      <p>{t("section17.intro")}</p>
      <ul className="list-none my-4 space-y-1">
        {" "}
        {/* Use list-none if you don't want bullets */}
        <li>
          {t("section17.item_email")}:{" "}
          <a href={`mailto:${t("section17.email_address")}`} className={linkClassname}>
            {t("section17.email_address")}
          </a>
        </li>
        <li>
          {t("section17.item_mail")}: {t("section17.postal_address")}
        </li>
      </ul>
      {/* 18. Divisibilité et Intégralité de l'Accord */}
      <h2>{t("section18.title")}</h2>
      <p>{t("section18.para1")}</p>
      <p>{t("section18.para2")}</p>
    </div>
  );
}
