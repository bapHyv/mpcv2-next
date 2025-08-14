import { linkClassname } from "@/app/staticData/cartPageClasses";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

interface GenerateMetadataParams {
  params: { locale: string };
}

export async function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }, { locale: "es" }];
}

export async function generateMetadata({ params }: GenerateMetadataParams): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "" });
  const siteBaseUrl = process.env.MAIN_URL || "https://www.monplancbd.fr";

  const title = t("metadataLegalNotices.title");
  const description = t("metadataLegalNotices.description");

  return {
    title: title,
    description: description,
    alternates: {
      canonical: `${siteBaseUrl}/${locale}/mentions-legales`,
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
      url: `${siteBaseUrl}/${locale}/mentions-legales`,
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
  const t = await getTranslations({ locale, namespace: "legalNotices" });
  return (
    <div className="utility-page">
      {/* H2: 1. Informations Légales (Éditeur du Site) */}
      <h2>{t("section1.title")}</h2>
      <p
        dangerouslySetInnerHTML={{
          __html: t("section1.intro", {
            lawLink: `<a href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164/#LEGIARTI000006421543" target="_blank" rel="noopener noreferrer" class="${linkClassname}">${t(
              "section1.lawLinkText"
            )}</a>`,
          }),
        }}
      />
      {/* Legal Information List */}
      <ul className="list-none space-y-2 my-4">
        <li>
          {/* H3: Raison Sociale */}
          <h3>{t("section1.item_companyName.label")}</h3>
          <p>{t("section1.item_companyName.value")}</p>
        </li>
        <li>
          {/* H3: Adresse du Siège Social */}
          <h3>{t("section1.item_address.label")}</h3>
          <p>{t("section1.item_address.value")}</p>
        </li>
        <li>
          {/* H3: Forme Juridique et Capital Social */}
          <h3>{t("section1.item_legalFormCapital.label")}</h3>
          <p>{t("section1.item_legalFormCapital.value")}</p>
        </li>
        <li>
          {/* H3: Numéro SIRET */}
          <h3>{t("section1.item_siret.label")}</h3>
          <p>{t("section1.item_siret.value")}</p>
        </li>
        <li>
          {/* H3: Numéro RCS */}
          <h3>{t("section1.item_rcs.label")}</h3>
          <p>{t("section1.item_rcs.value")}</p>
        </li>
        <li>
          {/* H3: Numéro de TVA Intracommunautaire */}
          <h3>{t("section1.item_vat.label")}</h3>
          <p>{t("section1.item_vat.value")}</p>
        </li>
        <li>
          {/* H3: Coordonnées de Contact (Email, Téléphone) */}
          <h3>{t("section1.item_contact.label")}</h3>
          <ul className="list-disc list-inside ml-4">
            <li>
              {t("section1.item_contact.emailLabel")}:{" "}
              <a href={`mailto:${t("section1.item_contact.emailValue")}`} className={linkClassname}>
                {t("section1.item_contact.emailValue")}
              </a>
            </li>
            <li>
              {t("section1.item_contact.phoneLabel")}: {t("section1.item_contact.phoneValue")}
            </li>
          </ul>
        </li>
        <li>
          {/* H3: Conditions Générales de Vente (Link) */}
          <h3>{t("section1.item_gtc.label")}</h3>
          <p
            dangerouslySetInnerHTML={{
              __html: t("section1.item_gtc.value", {
                gtcLink: `<a href="/${locale}/conditions-generales-de-vente" class="${linkClassname}">${t("section1.item_gtc.gtcLinkText")}</a>`,
              }),
            }}
          />
          {/* Note: Adjust href="/${locale}/conditions-generales-de-vente" if your GTC page slug is different */}
        </li>
      </ul>
      {/* H2: 2. Administration du Site */}
      <h2>{t("section2.title")}</h2>
      <ul className="list-none space-y-2 my-4">
        <li>
          {/* H3: Directeur de la Publication */}
          <h3>{t("section2.item_director.label")}</h3>
          <p>
            {t("section2.item_director.name")}
            <br />
            <em>{t("section2.item_director.legal_entity_note", { companyName: t("section1.item_companyName.value") })}</em>
          </p>
        </li>
        <li>
          {/* H3: Contact du Directeur de la Publication */}
          <h3>{t("section2.item_directorContact.label")}</h3>
          <p>{t("section2.item_directorContact.value")}</p>
        </li>
        {/* Optional Webmaster Section - Conditionally render based on whether it's needed/different */}
        {/* Check if translation exists before rendering */}
        {t("section2.item_webmaster.value") !== `section2.item_webmaster.value` && (
          <li>
            {/* H3: Webmaster */}
            <h3>{t("section2.item_webmaster.label")}</h3>
            <p>{t("section2.item_webmaster.value")}</p>
          </li>
        )}
        {t("section2.item_webmasterContact.value") !== `section2.item_webmasterContact.value` && (
          <li>
            {/* H3: Contact du Webmaster */}
            <h3>{t("section2.item_webmasterContact.label")}</h3>
            <p>{t("section2.item_webmasterContact.value")}</p>
          </li>
        )}
      </ul>
      {/* H2: 3. Hébergement du Site */}
      <h2>{t("section3.title")}</h2>
      <p>{t("section3.intro")}</p>
      <ul className="list-none space-y-2 my-4">
        <li>
          {/* H3: Nom de l'Hébergeur */}
          <h3>{t("section3.item_hostName.label")}</h3>
          <p>{t("section3.item_hostName.value")}</p>
        </li>
        <li>
          {/* H3: Raison Sociale de l'Hébergeur */}
          <h3>{t("section3.item_hostCompany.label")}</h3>
          <p>{t("section3.item_hostCompany.value")}</p>
        </li>
        <li>
          {/* H3: Adresse de l'Hébergeur */}
          <h3>{t("section3.item_hostAddress.label")}</h3>
          <p>{t("section3.item_hostAddress.value")}</p>
        </li>
        <li>
          {/* H3: Contact de l'Hébergeur */}
          <h3>{t("section3.item_hostContact.label")}</h3>
          <p>{t("section3.item_hostContact.value")}</p>
        </li>
      </ul>
      {/* H2: 4. Propriété Intellectuelle */}
      <h2>{t("section4.title")}</h2>
      <p>{t("section4.para1")}</p>
      <p>{t("section4.para2")}</p>
      {/* H2: 5. Protection des Données Personnelles */}
      <h2>{t("section5.title")}</h2>
      <p
        dangerouslySetInnerHTML={{
          __html: t("section5.para1", {
            privacyPolicyLink: `<a href="/${locale}/politiques-de-confidentialites" class="${linkClassname}">${t(
              "section5.privacyPolicyLinkText"
            )}</a>`,
          }),
        }}
      />
      <p>{t("section5.para2_rights_summary")}</p>
      {/* Note: Adjust href="/${locale}/politiques-de-confidentialites" if slug differs */}
      {/* H2: 6. Utilisation des Cookies */}
      <h2>{t("section6.title")}</h2>
      <p>
        {t("section6.para1")}
        <a href={`/${locale}/politiques-de-confidentialites`} className={`${linkClassname}`}>
          {t("section6.cookiePolicyLinkText")}
        </a>
      </p>
      <p>{t("section6.para2_definition")}</p>
      <p>{t("section6.para3_management_intro")}</p>
      <ul className="list-disc list-inside my-4 space-y-1">
        <li>
          {t("section6.browser_settings.chrome.label")}:{" "}
          <a href={t("section6.browser_settings.chrome.link")} target="_blank" rel="noopener noreferrer" className={linkClassname}>
            {t("section6.browser_settings.link_text")}
          </a>
        </li>
        <li>
          {t("section6.browser_settings.firefox.label")}:{" "}
          <a href={t("section6.browser_settings.firefox.link")} target="_blank" rel="noopener noreferrer" className={linkClassname}>
            {t("section6.browser_settings.link_text")}
          </a>
        </li>
        <li>
          {t("section6.browser_settings.safari.label")}:{" "}
          <a href={t("section6.browser_settings.safari.link")} target="_blank" rel="noopener noreferrer" className={linkClassname}>
            {t("section6.browser_settings.link_text")}
          </a>
        </li>
        <li>
          {t("section6.browser_settings.edge.label")}:{" "}
          <a href={t("section6.browser_settings.edge.link")} target="_blank" rel="noopener noreferrer" className={linkClassname}>
            {t("section6.browser_settings.link_text")}
          </a>
        </li>
      </ul>
      <p
        dangerouslySetInnerHTML={{
          __html: t("section6.para4_youronlinechoices", {
            yourOnlineChoicesLink: `<a href="http://www.youronlinechoices.com/fr/controler-ses-cookies/" target="_blank" rel="noopener noreferrer" class="${linkClassname}">${t(
              "section6.yourOnlineChoicesLinkText"
            )}</a>`,
          }),
        }}
      />
      {/* Note: Assuming cookie details are in Privacy Policy */}
      {/* H2: 7. Liens Hypertextes */}
      <h2>{t("section7.title")}</h2>
      <p>{t("section7.para1")}</p>
      <p>{t("section7.para2")}</p>
      {/* H2: 8. Limitation de Responsabilité */}
      <h2>{t("section8.title")}</h2>
      <p>{t("section8.para1")}</p>
      <p>{t("section8.para2")}</p>
      {/* H2: 9. Droit Applicable et Juridiction */}
      <h2>{t("section9.title")}</h2>
      <p>{t("section9.para1")}</p>
      {/* H2: 10. Date de Mise à Jour */}
      <h2>{t("section10.title")}</h2>
      <p>{t("section10.para1", { updateDate: "12/05/2025" })}</p>
      {/* Replace placeholder in translation or dynamically insert date */}
    </div>
  );
}
