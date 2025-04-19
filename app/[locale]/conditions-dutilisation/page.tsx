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
      {/*TODO: delete below ___________________________________ */}
      <p>______________________________________________________________________</p>
      <p>ANCIENNES:</p>
      <h1 className="!text-2xl">Conditions générales d’utilisation du site www.monplancbd.fr et utilisation de produits au CBD</h1>
      <Image
        width="300"
        height="232"
        src="https://www.monplancbd.fr/wp-content/uploads/2021/01/conditions-generales-300x232.jpg"
        alt="cbd"
        loading="lazy"
      />
      <p>
        L’utilisation du site monplancbd.fr implique l’acceptation pleine et entière des conditions générales d’utilisation ci-après décrites. Ces
        conditions d’utilisation sont susceptibles d’être modifiées ou complétées à tout moment, les utilisateurs du site monplancbd.fr sont donc
        invités à les consulter de manière régulière.
      </p>
      <p>
        Ce site est normalement accessible à tout moment aux utilisateurs. Une interruption pour raison de maintenance technique peut toutefois être
        décidée par MONPLANCBD, qui s’efforcera alors de communiquer préalablement aux utilisateurs les dates et heures de l’intervention.
      </p>
      <p>
        Le site monplancbd.fr est mis à jour régulièrement par MONPLANCBD. De la même façon, les mentions légales peuvent être modifiées à tout moment
        : elles s’imposent néanmoins à l’utilisateur qui est invité à s’y référer le plus souvent possible afin d’en prendre connaissance.
      </p>
      <h2>Description des services fournis</h2>
      <p>Le site monplancbd.fr a pour objet de fournir une information concernant l’ensemble des activités de la société.</p>
      <p>
        MONPLANCBD s’efforce de fournir sur le site monplancbd.fr des informations aussi précises que possible. Toutefois, il ne pourra être tenu
        responsable des omissions, des inexactitudes et des carences dans la mise à jour, qu’elles soient de son fait ou du fait des tiers partenaires
        qui lui fournissent ces informations.
      </p>
      <p>
        Tous les informations indiquées sur le site monplancbd.fr sont données à titre indicatif et sont susceptibles d’évoluer. Par ailleurs, les
        renseignements figurant sur le site monplancbd.fr ne sont pas exhaustifs. Ils sont donnés sous réserve de modifications ayant été apportées
        depuis leur mise en ligne.
      </p>
      <h2>Limitations contractuelles sur les données techniques</h2>
      <p>
        Le site internet ne pourra être tenu responsable de dommages matériels liés à l’utilisation du site. De plus, l’utilisateur du site s’engage à
        accéder au site en utilisant un matériel récent, ne contenant pas de virus et avec un navigateur de dernière génération mis à jour.
      </p>
      <h2>Propriété intellectuelle et contrefaçons</h2>
      <p>
        MONPLANCBD est propriétaire des droits de propriété intellectuelle ou détient les droits d’usage sur tous les éléments accessibles sur le
        site, notamment les textes, images, graphismes, logo, icônes, sons, logiciels.
      </p>
      <p>
        Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le
        procédé utilisé, est interdite, sauf autorisation écrite préalable de : MONPLANCBD.
      </p>
      <p>
        Toute exploitation non autorisée du site ou de l’un des éléments qu’il contient sera considérée comme constitutive d’une contrefaçon et
        poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.
      </p>
      <h2>Limitation de responsabilité</h2>
      <p>
        MONPLANCBD ne pourra être tenue responsable des dommages directs et indirects causés au matériel de l’utilisateur, lors de l’accès au site
        monplancbd.fr et résultant soit de l’utilisation d’un matériel ne répondant pas aux spécifications indiquées au point “Limitations
        contractuelles sur les données techniques”, soit de l’apparition d’un bug ou d’une incompatibilité.
      </p>
      <p>MONPLANCBD ne pourra également être tenue responsable des dommages indirects consécutifs à l’utilisation du site monplancbd.fr.</p>
      <p>
        Des espaces interactifs (possibilité de poser des questions dans l’espace &quot;Contact&quot;) sont à la disposition des utilisateurs.
        MONPLANCBD se réserve le droit de supprimer, sans mise en demeure préalable, tout contenu déposé dans cet espace qui contreviendrait à la
        législation applicable en France, en particulier aux dispositions relatives à la protection des données. Le cas échéant, MONPLANCBD se réserve
        également la possibilité de mettre en cause la responsabilité civile et/ou pénale de l’utilisateur, notamment en cas de message à caractère
        raciste, injurieux, diffamant, ou pornographique, quel que soit le support utilisé (texte, photographie…).
      </p>
      <h2>Droit applicable et attribution de juridiction</h2>
      <p>
        Tout litige en relation avec l’utilisation du site monplancbd.fr est soumis au droit français. Il est fait attribution exclusive de
        juridiction aux tribunaux compétents de Bayonne.
      </p>
      <h2>Lexique</h2>
      <p>Utilisateur : internaute se connectant, utilisant le site susnommé.</p>
      <h2>Conditions générales d’utilisation des produits proposés sur le site www.monplancbd.fr</h2>
      <h2>Avertissement</h2>
      <p>
        Nos produits à base de CBD ne sont pas destinés à diagnostiquer, soigner, guérir, traiter, pallier, prévenir les maladies.
        <br />
        MONPLANCBD tient à rappeler que nos produits ne sont pas des stupéfiants du fait d’un taux de THC inférieur aux 0,2%, comme demandé par les
        législations franco-européennes.
      </p>
      <p>
        Article L3421-4 : la vente ou la publicité pour des produits stupéfiants est passible d’une peine de 5 ans d’emprisonnement et de 75 000€
        d’amende.
      </p>
      <h2>Âge légal</h2>
      <p>
        Le site <a href="https://www.monplancbd.fr">www.monplancbd.fr</a> est accessible uniquement à un public majeur (18 ans révolus). Aucune
        personne mineure n’a le droit de visualiser et/ou de commander sur le site <a href="https://www.monplancbd.fr">www.monplancbd.fr</a>.<br />
        Lors de votre premier accès au site, votre âge vous sera demandé afin de pouvoir visualiser ses pages et protéger l’accès aux personnes
        n’ayant pas 18 ans.
      </p>
      <h2>Utilisation des huiles de CBD</h2>
      <p>
        Les huiles de CBD proposées sur le site{" "}
        <a href="https://www.monplancbd.fr" target="_blank" rel="noopener">
          monplancbd
        </a>{" "}
        n’ont pas vocation à être fumées. Nos flacons d’huiles sublinguales sont fournis avec une pipette pour faire couler la quantité de gouttes qui
        vous convient. Les gouttes sont à placer sous la langue et à garder pendant 5 à 10 secondes avant de boire un verre d’eau.
      </p>
      <p> </p>
      <h2>Utilisation des fleurs de CBD</h2>
      <p>
        Les fleurs de chanvre que nous proposons sur le site WWW.MONPLANCBD.FR sont TOUTES en adéquation avec la législation franco-européenne. En
        effet toutes nos fleurs à infuser sont analysées par un laboratoire accrédité afin de garantir leur taux de THC inférieur à 0,2%.
      </p>
      <p>
        Les fleurs de chanvre proposées sur le site www.monplancbd.fr n’ont pas vocation à être fumées. Nous conseillons donc de les utiliser en
        infusion (tisane) ou de les vaporiser afin de tirer le meilleur profit de cette plante.
      </p>
      <p>
        Il est recommandé de procéder à une décarboxylation complète de la fleur pour de meilleurs résultats. Ces derniers sont obtenus en appliquant
        une température de 105°C pendant 15 minutes, puis une température de 100 à 110°C durant 60 à 120 minutes.
      </p>
      <p>
        Nous proposons aussi à notre clientèle d’utiliser de l’huile de coco, un corps gras recommandé pour une bonne assimilation des cannabinoïdes.
      </p>
      <p>
        Dans de l’eau bouillante, incorporez une cuillère à soupe d’huile de coco avec 0,5g à 1g de fleur de chanvre. Mélangez et laissez infuser
        pendant 10 minutes environ.
      </p>
      <p>
        Il est possible de conserver votre concoction au frais, à l’abri de sources lumineuses, et de la réutiliser plus tard. Il est possible de s’en
        servir en cuisine, pâtisserie ou pour la préparation de vos infusions.
      </p>
      <h2>Utilisation des pollens de CBD</h2>
      <p>Les pollens de chanvre proposés sur le site www.monplancbd.fr n’ont pas vocation à être fumés. Nous conseillons donc de les vaporiser.</p>
      <h2>Femmes enceintes</h2>
      <p>Dû au manque d’information sur le sujet, MONPLANCBD déconseille fortement la consommation de CBD pendant la grossesse.</p>
      <h2>Conduite</h2>
      <p>
        Le CBD n’a pas d’effet psychotrope, cependant, il peut induire une somnolence chez certaines personnes. S’il procure un bien-être, cela peut
        être accompagné par une sensation d’endormissement.
      </p>
      <p>
        Si vous avez consommé du CBD et que vous vous sentez fatigué, ne prenez pas le volant !En cas d’accident, MONPLANCBD se décharge de toute
        responsabilité si vous ne respectez pas cette condition d’utilisation.
      </p>
    </div>
  );
}
