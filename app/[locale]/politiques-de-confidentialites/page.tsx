import { linkClassname } from "@/app/staticData/cartPageClasses";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";

interface GenerateMetadataParams {
  params: { locale: string };
}

export async function generateMetadata({ params }: GenerateMetadataParams): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "" });
  const siteBaseUrl = process.env.MAIN_URL || "https://www.monplancbd.fr";

  const title = t("privacyPolicy.metadata.title");
  const description = t("privacyPolicy.metadata.description");

  return {
    title: title,
    description: description,
    alternates: {
      canonical: `${siteBaseUrl}/${locale}/politiques-de-confidentialites`,
      languages: {
        "fr-FR": `${siteBaseUrl}/fr/politiques-de-confidentialites`,
        "en-US": `${siteBaseUrl}/en/politiques-de-confidentialites`,
        "es-ES": `${siteBaseUrl}/es/politiques-de-confidentialites`,
        "x-default": `${siteBaseUrl}/fr/politiques-de-confidentialites`,
      },
    },
    robots: {
      // Keep as noindex unless needed
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
      url: `${siteBaseUrl}/${locale}/politiques-de-confidentialites`,
      siteName: t("global.brandName"),
      images: [{ url: `${siteBaseUrl}/og-image-default.png`, width: 1200, height: 630, alt: "MonPlanCBD Privacy Policy" }],
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
  const t = await getTranslations({ locale, namespace: "" });

  const updateDate = new Date().toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });

  const benchmarkProcessesOutsideEU = true;

  return (
    <div className="utility-page">
      <h1>{t("privacyPolicy.mainTitle")}</h1>

      {/* Section: Introduction et Engagement */}
      <h2>{t("privacyPolicy.introduction.title")}</h2>
      <p>{t("privacyPolicy.introduction.para1")}</p>

      {/* Section: Responsable du Traitement */}
      <h2>{t("privacyPolicy.dataController.title")}</h2>
      <p>{t("privacyPolicy.dataController.intro")}</p>
      <ul className="list-none space-y-1 my-2">
        <li>{t("privacyPolicy.dataController.companyName")}</li>
        <li>{t("privacyPolicy.dataController.address")}</li>
        <li>
          {t("privacyPolicy.dataController.emailLabel")}:{" "}
          <a href={`mailto:${t("privacyPolicy.dataController.emailValue")}`} className={linkClassname}>
            {t("privacyPolicy.dataController.emailValue")}
          </a>
        </li>
      </ul>

      {/* Section: Quelles Données Personnelles Collectons-Nous ? */}
      <h2>{t("privacyPolicy.dataCollected.title")}</h2>
      <p>{t("privacyPolicy.dataCollected.intro")}</p>
      <ul className="list-disc list-inside space-y-1 my-4">
        <li>{t("privacyPolicy.dataCollected.item_identification")}</li>
        <li>{t("privacyPolicy.dataCollected.item_connection_navigation")}</li>
        <li>{t("privacyPolicy.dataCollected.item_order_transaction")}</li>
        <li>{t("privacyPolicy.dataCollected.item_account")}</li>
        <li>{t("privacyPolicy.dataCollected.item_reviews")}</li>
        <li>{t("privacyPolicy.dataCollected.item_technical")}</li>
      </ul>
      <p>{t("privacyPolicy.dataCollected.outro")}</p>

      {/* Section: Pourquoi Utilisons-Nous Vos Données (Finalités) ? */}
      <h2>{t("privacyPolicy.purposes.title")}</h2>
      <p>{t("privacyPolicy.purposes.intro")}</p>
      {/* Sub-section: Exécution du contrat */}
      <h3>{t("privacyPolicy.purposes.contract.basis")}</h3>
      <ul className="list-disc list-inside space-y-1 my-2 ml-4">
        <li>{t("privacyPolicy.purposes.contract.item_order_management")}</li>
        <li>{t("privacyPolicy.purposes.contract.item_delivery")}</li>
        <li>{t("privacyPolicy.purposes.contract.item_crm")}</li>
        <li>{t("privacyPolicy.purposes.contract.item_account_management")}</li>
      </ul>
      {/* Sub-section: Respect d'une obligation légale */}
      <h3>{t("privacyPolicy.purposes.legalObligation.basis")}</h3>
      <ul className="list-disc list-inside space-y-1 my-2 ml-4">
        <li>{t("privacyPolicy.purposes.legalObligation.item_invoice_retention")}</li>
        <li>{t("privacyPolicy.purposes.legalObligation.item_authority_requests")}</li>
      </ul>
      {/* Sub-section: Votre Consentement */}
      <h3>{t("privacyPolicy.purposes.consent.basis")}</h3>
      <ul className="list-disc list-inside space-y-1 my-2 ml-4">
        <li>{t("privacyPolicy.purposes.consent.item_newsletter")}</li>
        <li>{t("privacyPolicy.purposes.consent.item_cookies")}</li>
        <li>{t("privacyPolicy.purposes.consent.item_reviews")}</li>
      </ul>
      <p>
        <em>{t("privacyPolicy.purposes.consent.withdrawal_note")}</em>
      </p>
      {/* Sub-section: Notre Intérêt Légitime */}
      <h3>{t("privacyPolicy.purposes.legitimateInterest.basis")}</h3>
      <ul className="list-disc list-inside space-y-1 my-2 ml-4">
        <li>{t("privacyPolicy.purposes.legitimateInterest.item_security_fraud")}</li>
        <li>{t("privacyPolicy.purposes.legitimateInterest.item_service_improvement")}</li>
        <li>{t("privacyPolicy.purposes.legitimateInterest.item_personalization")}</li>
        <li>{t("privacyPolicy.purposes.legitimateInterest.item_loyalty")}</li>
        <li>{t("privacyPolicy.purposes.legitimateInterest.item_information_requests")}</li>
      </ul>

      {/* Section: Avec Qui Partageons-Nous Vos Données ? */}
      <h2>{t("privacyPolicy.dataSharing.title")}</h2>
      <p>{t("privacyPolicy.dataSharing.intro")}</p>
      <ul className="list-disc list-inside space-y-1 my-4">
        <li>{t("privacyPolicy.dataSharing.item_payment")}</li>
        <li>{t("privacyPolicy.dataSharing.item_carriers")}</li>
        <li>{t("privacyPolicy.dataSharing.item_hosting")}</li>
        <li>{t("privacyPolicy.dataSharing.item_emailing")}</li> {/* Keep the verification note here or in translation */}
        <li>{t("privacyPolicy.dataSharing.item_authorities")}</li>
      </ul>
      <p>{t("privacyPolicy.dataSharing.outro")}</p>
      {/* Sub-section: Transferts Internationaux */}
      <h3>{t("privacyPolicy.dataSharing.transfers.title")}</h3>
      <p>{t("privacyPolicy.dataSharing.transfers.para1")}</p>
      {/* Conditional Paragraph based on verification */}
      {benchmarkProcessesOutsideEU ? (
        <p>{t("privacyPolicy.dataSharing.transfers.para2_outside_eu")}</p>
      ) : (
        <p>{t("privacyPolicy.dataSharing.transfers.para2_inside_eu")}</p>
      )}

      {/* Section: Combien de Temps Conservons-Nous Vos Données ? */}
      <h2>{t("privacyPolicy.dataRetention.title")}</h2>
      <p>{t("privacyPolicy.dataRetention.intro")}</p>
      <ul className="list-disc list-inside space-y-1 my-4">
        <li>{t("privacyPolicy.dataRetention.item_client_active")}</li>
        <li>{t("privacyPolicy.dataRetention.item_order_billing")}</li>
        <li>{t("privacyPolicy.dataRetention.item_prospects")}</li>
        <li>{t("privacyPolicy.dataRetention.item_marketing_consent")}</li>
        <li>{t("privacyPolicy.dataRetention.item_cookies")}</li>
      </ul>

      {/* Section: Comment Protégeons-Nous Vos Données ? */}
      <h2>{t("privacyPolicy.dataSecurity.title")}</h2>
      <p>{t("privacyPolicy.dataSecurity.para1")}</p>

      {/* Section: Utilisation des Cookies */}
      <h2>{t("privacyPolicy.cookies.title")}</h2>

      <p>
        {t("privacyPolicy.cookies.introduction")} <Link href="/politique-cookies">{t("privacyPolicy.cookies.cookiePolicyLinkText")}</Link>
      </p>
      {/* Sub-section: Gestion du Consentement aux Cookies */}

      {/* Section: Vos Droits Concernant Vos Données Personnelles */}
      <h2>{t("privacyPolicy.yourRights.title")}</h2>
      <p>{t("privacyPolicy.yourRights.intro")}</p>
      <ul className="list-disc list-inside space-y-1 my-4">
        <li>{t("privacyPolicy.yourRights.item_access")}</li>
        <li>{t("privacyPolicy.yourRights.item_rectification")}</li>
        <li>{t("privacyPolicy.yourRights.item_erasure")}</li>
        <li>{t("privacyPolicy.yourRights.item_restriction")}</li>
        <li>{t("privacyPolicy.yourRights.item_portability")}</li>
        <li>{t("privacyPolicy.yourRights.item_objection")}</li>
        <li>{t("privacyPolicy.yourRights.item_withdraw_consent")}</li>
        <li>{t("privacyPolicy.yourRights.item_post_mortem")}</li>
      </ul>
      {/* Sub-section: Comment exercer vos droits */}
      <h3>{t("privacyPolicy.yourRights.howToExercise.title")}</h3>
      <p>{t("privacyPolicy.yourRights.howToExercise.intro")}</p>
      <ul className="list-disc list-inside space-y-1 my-2 ml-4">
        <li
          dangerouslySetInnerHTML={{
            __html: t("privacyPolicy.yourRights.howToExercise.item_profile", {
              profileLink: `<a href="/${locale}/mon-compte/profil" class="${linkClassname}">${t(
                "privacyPolicy.yourRights.howToExercise.profileLinkText"
              )}</a>`,
            }),
          }}
        />
        <li
          dangerouslySetInnerHTML={{
            __html: t("privacyPolicy.yourRights.howToExercise.item_addresses", {
              addressesLink: `<a href="/${locale}/mon-compte/adresses" class="${linkClassname}">${t(
                "privacyPolicy.yourRights.howToExercise.addressesLinkText"
              )}</a>`,
            }),
          }}
        />
        <li>{t("privacyPolicy.yourRights.howToExercise.item_newsletter")}</li>
      </ul>
      <p>{t("privacyPolicy.yourRights.howToExercise.outro")}</p>
      {/* Sub-section: Droit de réclamation auprès de la CNIL */}
      <h3>{t("privacyPolicy.yourRights.complaintRight.title")}</h3>
      <p
        dangerouslySetInnerHTML={{
          __html: t("privacyPolicy.yourRights.complaintRight.para1", {
            cnilLink: `<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" class="${linkClassname}">www.cnil.fr</a>`,
          }),
        }}
      />

      {/* Section: Politique Concernant les Mineurs */}
      <h2>{t("privacyPolicy.minorsPolicy.title")}</h2>
      <p>{t("privacyPolicy.minorsPolicy.para1")}</p>

      {/* Section: Mise à Jour de la Politique de Confidentialité */}
      <h2>{t("privacyPolicy.policyUpdate.title")}</h2>
      <p>{t("privacyPolicy.policyUpdate.para1")}</p>

      {/* Section: Contact */}
      <h2>{t("privacyPolicy.contact.title")}</h2>
      <p>{t("privacyPolicy.contact.intro")}</p>
      <ul className="list-none space-y-1 my-2">
        <li>
          {t("privacyPolicy.contact.emailLabel")}:{" "}
          <a href={`mailto:${t("privacyPolicy.contact.emailValue")}`} className={linkClassname}>
            {t("privacyPolicy.contact.emailValue")}
          </a>
        </li>
        <li>
          {t("privacyPolicy.contact.mailLabel")}: {t("privacyPolicy.contact.postalAddress")}
        </li>
      </ul>

      {/* Section: Date de Dernière Mise à Jour */}
      <h2>{t("privacyPolicy.lastUpdate.title")}</h2>
      <p>{t("privacyPolicy.lastUpdate.date", { updateDate: updateDate })}</p>
    </div>
  );
}
