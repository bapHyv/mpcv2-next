import { linkClassname } from "@/app/staticData/cartPageClasses";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }, { locale: "es" }];
}

interface GenerateMetadataParams {
  params: { locale: string };
}

export async function generateMetadata({ params }: GenerateMetadataParams): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "" });
  const siteBaseUrl = process.env.MAIN_URL || "https://www.monplancbd.fr";

  const title = t("metadataGCS.title");
  const description = t("metadataGCS.description");

  return {
    title: title,
    description: description,
    alternates: {
      canonical: `${siteBaseUrl}/${locale}/conditions-generales-de-vente`,
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
      url: `${siteBaseUrl}/${locale}/conditions-generales-de-vente`,
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
  const t = await getTranslations({ locale, namespace: "GCS" });
  return (
    <div className="utility-page">
      {/* H2: Préambule et Champ d'Application */}
      <h2>{t("preamble.title")}</h2>

      {/* H3: Identification du Vendeur (MONPLANCBD SAS) */}
      <h3>{t("preamble.sellerId.title")}</h3>
      <p>{t("preamble.sellerId.para1")}</p>

      {/* H3: Identification de l'Acheteur */}
      <h3>{t("preamble.buyerId.title")}</h3>
      <p>{t("preamble.buyerId.para1")}</p>

      {/* H3: Objet des Conditions Générales de Vente */}
      <h3>{t("preamble.object.title")}</h3>
      <p>{t("preamble.object.para1")}</p>

      {/* H3: Acceptation des Conditions */}
      <h3>{t("preamble.acceptance.title")}</h3>
      <p>{t("preamble.acceptance.para1")}</p>

      {/* H2: Produits */}
      <h2>{t("products.title")}</h2>

      {/* H3: Description des Produits */}
      <h3>{t("products.description.title")}</h3>
      <p>{t("products.description.para1")}</p>

      {/* H3: Disponibilité des Produits */}
      <h3>{t("products.availability.title")}</h3>
      <p>{t("products.availability.para1")}</p>

      {/* H3: Zone Géographique de Vente */}
      <h3>{t("products.zone.title")}</h3>
      <p>{t("products.zone.para1")}</p>

      {/* H2: Prix */}
      <h2>{t("price.title")}</h2>

      {/* H3: Devise et Taxes (TVA) */}
      <h3>{t("price.currencyVat.title")}</h3>
      <p>{t("price.currencyVat.para1")}</p>

      {/* H3: Modification des Prix */}
      <h3>{t("price.modification.title")}</h3>
      <p>{t("price.modification.para1")}</p>

      {/* H3: Frais de Livraison */}
      <h3>{t("price.shippingCosts.title")}</h3>
      <p>{t("price.shippingCosts.para1")}</p>
      <p
        dangerouslySetInnerHTML={{
          __html: t("price.shippingCosts.para2", {
            shippingPolicyLink: `<a href="/${locale}/politique-expedition" class="${linkClassname}">${t(
              "price.shippingCosts.shippingPolicyLinkText"
            )}</a>`,
          }),
        }}
      />
      {/* Reminder: Insert Shipping Costs Table HTML here after this paragraph */}

      {/* H2: Commande et Paiement */}
      <h2>{t("orderPayment.title")}</h2>

      {/* H3: Processus de Commande */}
      <h3>{t("orderPayment.process.title")}</h3>
      <p>{t("orderPayment.process.para1")}</p>

      {/* H3: Compte Client et Commande Invité */}
      <h3>{t("orderPayment.accountGuest.title")}</h3>
      <p>{t("orderPayment.accountGuest.para1_revised")}</p>

      {/* H3: Confirmation de Commande */}
      <h3>{t("orderPayment.confirmation.title")}</h3>
      <p>{t("orderPayment.confirmation.para1")}</p>

      {/* H3: Moyens de Paiement Sécurisés */}
      <h3>{t("orderPayment.securePayment.title")}</h3>
      <p>{t("orderPayment.securePayment.para1_revised")}</p>

      {/* H3: Preuve de la Transaction */}
      <h3>{t("orderPayment.proof.title")}</h3>
      <p>{t("orderPayment.proof.para1")}</p>

      {/* H2: Réserve de Propriété */}
      <h2 className="!text-xl !text-left">{t("retentionOfTitle.title")}</h2>
      <p>{t("retentionOfTitle.para1")}</p>

      {/* H2: Droit de Rétractation */}
      <h2 className="!text-xl !text-left">{t("rightOfWithdrawal.title")}</h2>

      {/* H3: Délai d'Exercice du Droit de Rétractation */}
      <h3 className="!text-lg !text-left">{t("rightOfWithdrawal.exercisePeriod.title")}</h3>
      <p>{t("rightOfWithdrawal.exercisePeriod.para1")}</p>

      {/* H3: Conditions de Retour des Produits */}
      <h3 className="!text-lg !text-left">{t("rightOfWithdrawal.returnConditions.title")}</h3>
      <p>{t("rightOfWithdrawal.returnConditions.para1")}</p>

      {/* H3: Modalités de Retour et Remboursement */}
      <h3 className="!text-lg !text-left">{t("rightOfWithdrawal.returnRefundProcess.title")}</h3>
      <p
        dangerouslySetInnerHTML={{
          __html: t("rightOfWithdrawal.returnRefundProcess.para1", {
            returnPolicyLink: `<a href="/${locale}/politique-de-retour" class="${linkClassname}">${t(
              "rightOfWithdrawal.returnRefundProcess.returnPolicyLinkText"
            )}</a>`,
          }),
        }}
      />
      {/* Note: Adjust href="/${locale}/politique-de-retour" if your return policy page slug is different */}

      {/* H2: Livraison */}
      <h2 className="!text-xl !text-left">{t("delivery.title")}</h2>

      {/* H3: Adresse de Livraison */}
      <h3 className="!text-lg !text-left">{t("delivery.address.title")}</h3>
      <p>{t("delivery.address.para1")}</p>

      {/* H3: Modes et Frais de Livraison */}
      <h3 className="!text-lg !text-left">{t("delivery.methodsCosts.title")}</h3>
      <p>{t("delivery.methodsCosts.para1")}</p>

      {/* H3: Délais de Livraison (Indicatifs) */}
      <h3 className="!text-lg !text-left">{t("delivery.timescales.title")}</h3>
      <p>{t("delivery.timescales.para1")}</p>

      {/* H3: Transfert des Risques */}
      <h3 className="!text-lg !text-left">{t("delivery.riskTransfer.title")}</h3>
      <p>{t("delivery.riskTransfer.para1")}</p>

      {/* H3: Réception de la Commande et Vérification */}
      <h3 className="!text-lg !text-left">{t("delivery.receptionVerification.title")}</h3>
      <p>{t("delivery.receptionVerification.para1")}</p>

      {/* H3: Problèmes de Livraison (Dommages, Colis non reçu) */}
      <h3 className="!text-lg !text-left">{t("delivery.issues.title")}</h3>
      <p>{t("delivery.issues.para1_damage")}</p>
      <p className="font-semibold my-2">{t("delivery.issues.para2_non_receipt_important_note")}</p>
      <p>{t("delivery.issues.para3_non_receipt_policy")}</p>

      {/* H2: Garanties Légales */}
      <h2 className="!text-xl !text-left">{t("legalGuarantees.title")}</h2>

      {/* H3: Garantie de Conformité */}
      <h3 className="!text-lg !text-left">{t("legalGuarantees.conformity.title")}</h3>
      <p>{t("legalGuarantees.conformity.para1")}</p>

      {/* H3: Garantie des Vices Cachés */}
      <h3 className="!text-lg !text-left">{t("legalGuarantees.hiddenDefects.title")}</h3>
      <p>{t("legalGuarantees.hiddenDefects.para1")}</p>

      {/* H3: Modalités de Réclamation */}
      <h3 className="!text-lg !text-left">{t("legalGuarantees.claimsProcess.title")}</h3>
      <p>{t("legalGuarantees.claimsProcess.para1")}</p>

      {/* H2: Responsabilité */}
      <h2 className="!text-xl !text-left">{t("liability.title")}</h2>
      <p>{t("liability.para1")}</p>
      <p>{t("liability.para2")}</p>

      <h2 className="!text-xl !text-left">{t("intellectualProperty.title")}</h2>
      <p>{t("intellectualProperty.para1")}</p>
      <p>{t("intellectualProperty.para2")}</p>

      {/* H2: Protection des Données Personnelles */}
      <h2 className="!text-xl !text-left">{t("personalData.title")}</h2>
      <p
        dangerouslySetInnerHTML={{
          __html: t("personalData.para1", {
            privacyPolicyLink: `<a href="/${locale}/politiques-de-confidentialites" class="${linkClassname}">${t(
              "personalData.privacyPolicyLinkText"
            )}</a>`,
          }),
        }}
      />
      {/* Note: Adjust href="/${locale}/politiques-de-confidentialites" if your privacy policy page slug is different */}

      {/* H2: Utilisation des Cookies */}
      <h2 className="!text-xl !text-left">{t("cookies.title")}</h2>
      <p
        dangerouslySetInnerHTML={{
          __html: t("cookies.para1", {
            privacyPolicyLink: `<a href="/${locale}/politiques-de-confidentialites" class="${linkClassname}">${t(
              "cookies.privacyPolicyLinkText"
            )}</a>`,
          }),
        }}
      />
      {/* Note: Linking to the privacy policy again, assuming cookie details are within it */}

      {/* H2: Modification des Conditions Générales de Vente */}
      <h2 className="!text-xl !text-left">{t("modificationGTC.title")}</h2>
      <p>{t("modificationGTC.para1")}</p>
      <p>{t("modificationGTC.para2")}</p>

      {/* H2: Droit Applicable et Règlement des Litiges */}
      <h2 className="!text-xl !text-left">{t("governingLawDisputes.title")}</h2>

      {/* H3: Droit Applicable */}
      <h3 className="!text-lg !text-left">{t("governingLawDisputes.applicableLaw.title")}</h3>
      <p>{t("governingLawDisputes.applicableLaw.para1")}</p>

      {/* H3: Juridiction Compétente */}
      <h3 className="!text-lg !text-left">{t("governingLawDisputes.jurisdiction.title")}</h3>
      <p>{t("governingLawDisputes.jurisdiction.para1")}</p>

      {/* H3: Médiation et Règlement en Ligne des Litiges (ODR) */}
      <h3 className="!text-lg !text-left">{t("governingLawDisputes.mediationODR.title")}</h3>
      <p
        dangerouslySetInnerHTML={{
          __html: t("governingLawDisputes.mediationODR.para1", {
            odrLink: `<a href="https://webgate.ec.europa.eu/odr/" target="_blank" rel="noopener noreferrer" class="${linkClassname}">${t(
              "governingLawDisputes.mediationODR.odrLinkText"
            )}</a>`,
          }),
        }}
      />

      {/* H2: Contact */}
      <h2 className="!text-xl !text-left">{t("contact.title")}</h2>
      <p>{t("contact.para1")}</p>
      <ul className="list-disc list-inside space-y-1 my-4">
        <li>
          {t("contact.email")}:{" "}
          <a href={`mailto:${t("contact.emailAddress")}`} className={linkClassname}>
            {t("contact.emailAddress")}
          </a>
        </li>
        <li>
          {t("contact.phone")}: {t("contact.phoneNumber")} ({t("contact.phoneInfo")})
        </li>
        <li>
          {t("contact.mail")}: {t("contact.postalAddress")}
        </li>
      </ul>
    </div>
  );
}
