import { linkClassname } from "@/app/staticData/cartPageClasses";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import type { Metadata } from "next";

interface GenerateMetadataParams {
  params: { locale: string };
}

export async function generateMetadata({ params }: GenerateMetadataParams): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "" });
  const siteBaseUrl = process.env.MAIN_URL || "https://www.monplancbd.fr";

  const title = t("metadataPrivacyPolicy.title");
  const description = t("metadataPrivacyPolicy.description");

  return {
    title: title,
    description: description,
    alternates: {
      canonical: `${siteBaseUrl}/${locale}/politiques-de-confidentialites`,
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
      url: `${siteBaseUrl}/${locale}/politiques-de-confidentialites`,
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
  const t = await getTranslations({ locale, namespace: "" });

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
        <li>{t("privacyPolicy.dataSharing.item_emailing")}</li> {/* Remember to verify Benchmark location */}
        <li>{t("privacyPolicy.dataSharing.item_authorities")}</li>
      </ul>
      <p>{t("privacyPolicy.dataSharing.outro")}</p>
      {/* Sub-section: Transferts Internationaux */}
      <h3>{t("privacyPolicy.dataSharing.transfers.title")}</h3>
      <p>{t("privacyPolicy.dataSharing.transfers.para1")}</p>
      {/* Conditional part - Need logic here based on Benchmark verification */}
      {/* <p>{t("privacyPolicy.dataSharing.transfers.para2_outside_eu")}</p> */}
      {/* <p>{t("privacyPolicy.dataSharing.transfers.para2_inside_eu")}</p> */}
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
      <p>{t("privacyPolicy.cookies.intro")}</p>
      <ul className="list-disc list-inside space-y-1 my-4">
        <li>{t("privacyPolicy.cookies.item_essential")}</li>
        <li>{t("privacyPolicy.cookies.item_functional")}</li>
        <li>{t("privacyPolicy.cookies.item_analytics")}</li>
        {/* Conditional part - Render only if marketing cookies are used */}
        {/* <li>{t("privacyPolicy.cookies.item_marketing")}</li> */}
      </ul>
      {/* Sub-section: Gestion du Consentement aux Cookies */}
      <h3>{t("privacyPolicy.cookies.consentManagement.title")}</h3>
      <p>{t("privacyPolicy.cookies.consentManagement.para1", { consentManagementLink: "[Lien/mécanisme de gestion des cookies]" })}</p>{" "}
      {/* Add mechanism description/link */}
      <p>{t("privacyPolicy.cookies.consentManagement.para2", { consentDuration: "[Durée du consentement, ex: 6]", retentionDuration: "13" })}</p>
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
        {/* Using dangerouslySetInnerHTML for links */}
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
      <p>{t("privacyPolicy.lastUpdate.date", { updateDate: "17/04/2025" })}</p>
      {/* TODO: check previous _______________________________________________________________________________________________________________ */}
      <p>_______________________________________________________________________________________________________________</p>
      <p>PREVIOUS:</p>
      <h1>MON PLAN CBD - POLITIQUE DE CONFIDENTIALITÉ</h1>
      <p>
        La société MONPLANCBD est soucieuse de la protection des données personnelles. Elle met en œuvre une démarche d&APOS;amélioration continue de
        sa conformité au Règlement général de protection des données (RGPD), à la Directive ePrivacy, ainsi qu&APOS;à la loi n° 78-17 du 6 janvier
        1978 dite Informatique et Libertés pour assurer le meilleur niveau de protection à vos données personnelles.
      </p>
      <p>
        Cette politique vous indique le type de données personnelles que nous collectons, la manière dont nous utilisons vos données personnelles et
        les droits dont vous disposez pour contrôler l’utilisation que nous en faisons.
      </p>
      <p>Au sens du RGPD :</p>
      <ul>
        <li>
          les « données personnelles » sont toutes informations qui vous concernent et permettent de vous identifier, directement ou indirectement.
        </li>

        <li>
          le « traitement de données personnelles » est toute opération ou ensemble d&APOS;opérations appliquées à des données à caractère personnel.
        </li>
      </ul>
      <p>
        Pour toute information sur la protection des données personnelles, vous pouvez également consulter le site de la Commission Nationale de
        l&APOS;Informatique et des Libertés <a href="http://www.cnil.fr/">www.cnil.fr</a>.
      </p>
      <h2>Article 1 – Personne responsable du traitement des données personnelles</h2>
      <p>Le responsable du traitement des données personnelles est la société MONPLANCBD.</p>
      <p>
        Les données personnelles sont collectées sur le site internet <a href="https://monplancbd.fr">www.monplancbd.fr</a> et sont traitées par la
        société MONPLANCBD, 2 place élie lambert 64100 Bayonne.
      </p>
      <h2>Article 2 – Fondements juridiques</h2>
      <p>La collecte des données personnelles est justifiée par différents fondement légaux :</p>
      <ul>
        <li>
          <strong>le consentement</strong> : notamment lorsque vous répondez à nos questions et lorsque vous donnez des avis sur nos produits ;
        </li>

        <li>
          <strong>le contrat</strong> : le traitement des données personnelles est nécessaire à l’exécution du contrat entre MONPLANCBD et vous
        </li>

        <li>
          <strong>l’obligation légale</strong> ;
        </li>

        <li>
          <strong>l’intérêt légitime</strong> de la société MONPLANCBD pour assurer le bon fonctionnement du site{" "}
          <a href="http://https//monplancbd.fr">www.monplancbd.fr</a> mais aussi la lutte contre la fraude.
        </li>
      </ul>
      <h2>Article 3 – Pourquoi mes données sont-elles collectées ?</h2>
      <ul>
        <li>
          <strong>Gestion de la relation client</strong>, nécessitant essentiellement des données d’identification comme votre nom et vos coordonnées
          de contact ;
        </li>

        <li>
          <strong>Commande, paiement et livraison d’une commande,</strong> nécessitant des données telles que vos nom, adresse électronique, adresse
          de facturation, adresse de livraison, numéro de téléphone, votre sélection de produits ou des informations relatives au paiement ;
        </li>

        <li>
          <strong>Amélioration de la navigation sur le site,</strong> par une personnalisation de nos services et des messages que vous nous
          adressons, permettant notamment lors de votre navigation sur notre site de vous proposer des produits similaires à ceux que vous avez déjà
          achetés ou consultés. Cela nécessite la collecte des données sur votre navigation et vos achats ;
        </li>

        <li>
          <strong>Personnalisation des publicités en ligne et des campagnes de communication</strong>, nécessitant notamment le recueil des
          informations de navigation et d’achats sur le site <strong>;</strong>
        </li>

        <li>
          <strong>Fidélisation</strong> par le biais de notre programme de fidélité, nécessitant la collecte des données d’identification et des
          données relatives à vos achats ;
        </li>

        <li>
          <strong>Envoi de communications commerciales</strong>, si vous choisissez de souscrire à la newsletter, nécessitant des données lors de la
          création de votre compte client telles que votre adresse électronique et de votre téléphone portable ;
        </li>

        <li>
          <strong>Réponse aux demandes</strong> sur nos produits ou notre marque effectuées à l’adresse suivante :{" "}
          <a href="https://monplabcbd.fr">www.monplancbd.fr </a>;
        </li>

        <li>
          <strong>Gestion des avis sur des produits</strong> pour laquelle nous avons besoin au minimum de votre adresse électronique ;
        </li>

        <li>
          <strong>Connaissance des clients et statistiques de performance de notre site</strong>, nécessitant le recueil de données pour mieux
          comprendre nos clients<strong>.</strong>
        </li>
      </ul>
      <h2>Article 4 – Données personnelles collectées et moment</h2>
      <p>
        Nous collections et traitons notamment les données suivantes : nom, prénom, adresse électronique, mot de passe, numéro de téléphone, adresse
        postale, adresse IP, données de connexions et données de navigation, historiques de commandes, produits consultés, incidents de livraisons,
        réclamations.
      </p>
      <p>Ces données sont généralement collectées quand</p>
      <ul>
        <li>
          Vous vous connectez et naviguez sur notre site <a href="https://monplancbd.fr">www.monplancbd.fr</a>;
        </li>
        <li>Vous créez puis vous connectez à votre compte client ;</li>
        <li>Vous rédigez un commentaire ;</li>
        <li>Vous sélectionnez des produits et constituez un panier ;</li>
        <li>Vous confirmez et payez une commande.</li>
      </ul>
      <h2>Article 5 – Durée de conservation des données</h2>
      <p>
        Les Données Personnelles des utilisateurs ne sont pas conservées au-delà de la durée strictement nécessaire aux finalités poursuivies,
        conformément à la Règlementation Applicable.
      </p>
      <p>Les données relatives à un client actif sont conservées :</p>
      <ul>
        <li>pendant toute la durée de la relation contractuelle, ou</li>
        <li>jusqu’à l’envoi d’une demande d’une demande suppression, ou</li>
        <li>Jusqu’à trois ans après une période d’inactivité.</li>
      </ul>
      <p>
        Lorsque vous nous contactez pour obtenir des informations sur nos produits ou notre marque, les données sont conservées pour la durée
        nécessaire au traitement de cette demande
      </p>
      <h2>Article 6 – Protection des données</h2>
      <p>Nous utilisons un logiciel SSL (Secure Sockets Layer Software) qui crypte vos informations.</p>
      <h2>Article 7 – Communication des données à des tiers</h2>
      <p>
        Les données que nous collectons sont transmises aux prestataires auxquels nous faisons appel pour la réalisation de nos services :
        transporteurs, services de paiement en ligne, service de programme de fidélisation externalisé, etc…
      </p>
      <p>Vos données ne feront pas l’objet de transmission en dehors de l’Union Européenne.</p>
      <h2>Article 8 – Mineurs</h2>
      <p>
        Notre site n’est pas destiné aux mineurs, nous ne leur vendons pas de produits. En conséquence, nous ne traitons pas les données les
        concernant.
      </p>
      <h2>Article 9 – Vos droits</h2>
      <p>
        Conformément à la loi « Informatique et libertés » du 6 janvier 1978 modifiée et du règlement (UE) no 2016/679 du 27 avril 2016, vous
        bénéficiez de droits relatifs à vos données personnelles que vous pouvez exercer à tout moment :
      </p>
      <ul>
        <li>
          <strong>droit d’accès ;</strong>
        </li>

        <li>
          <strong>droit de rectification ;</strong>
        </li>

        <li>
          <strong>
            droit de limitation du traitement de données (notamment si vous contestez l’exactitude des données, le traitement sera limité pendant la
            durée de vérification de leur exactitude) ;
          </strong>
        </li>

        <li>
          <strong>
            droit d’effacement, aussi appelé « droit à l’oubli ». Toutefois nous pouvons être contraint de conserver certaines données, notamment pour
            des motifs légaux ou légitimes impérieux ;
          </strong>
        </li>

        <li>
          <strong>
            droit à la portabilité des données, c’est-à-dire le droit de recevoir les données personnelles que vous nous avez fournies dans un format
            structuré, couramment utilisé et le droit de transmettre ces données à un autre responsable de traitement ;
          </strong>
        </li>

        <li>
          <strong>Droit de refus de toute prospection commerciale ;</strong>
        </li>

        <li>
          Vous pouvez enfin formuler des directives relatives à la conservation, à l’effacement et à la communication de vos données à caractère
          personnel après votre décès.
        </li>
      </ul>
      <p>
        Vous pouvez exercer vos droits auprès de MONPLANCBD à l’adresse suivante : <a href="https://monplancbd.fr">www.monplancbd.fr</a> par courrier
        à l’adresse : SAS MONPLANCBD, 2 place élie lambert 64100 Bayonne.
      </p>
      <p>
        Pour toute demande ou en cas de différend entre MONPLANCBD et les utilisateurs concernant le traitement de leurs données personnelles, ces
        derniers peuvent adresser leur demande ou leur réclamation à MONPLANCBD à l’adresse suivante : contact@monplancbd.fr ou par courrier à
        l’adresse : SAS MONPLANCBD 2 place élie lambert 64100 Bayonne.
      </p>
      <p>MONPLANCBD s’efforcera de trouver une solution satisfaisante pour assurer le respect de la règlementation applicable.</p>
      <p>
        En l’absence de réponse de MONPLANCBD ou si le différend persiste malgré la proposition de MONPLANCBD ou à tout moment, les utilisateurs ont
        la possibilité d’introduire une réclamation auprès de la CNIL sur son site internet www.cnil.fr ou auprès de l’autorité de contrôle de l’État
        membre de l’Union européenne au sein duquel l’utilisateur réside habituellement.
      </p>
      <h2>Article 10 - Cookies</h2>
      <p>
        La navigation sur le site <a href="https://monplancbd.fr">www.monplancbd.fr </a>est susceptible de provoquer l’installation de cookie(s) sur
        l’ordinateur de l’utilisateur.
      </p>
      <p>
        <strong>Définition -</strong> Un cookie est un fichier de petite taille, qui ne permet pas l’identification de l’utilisateur, mais qui
        enregistre des informations relatives à la navigation d’un ordinateur sur un site. Les données ainsi obtenues visent à faciliter la navigation
        ultérieure sur le site, et ont également vocation à permettre diverses mesures de fréquentation.
      </p>
      <p>
        <strong>Durée -</strong> Les données collectées grâce aux cookies émis par sont conservées pour une durée maximum de treize mois.
      </p>
      <p>
        <strong>Bandeau informatif -</strong> Un bandeau d’information est visible lors de votre première connexion sur notre site. Il permettra
        d’accepter les cookies, de personnaliser la gestion des cookies, ou de les refuser.
      </p>
      <p>
        <strong>Comment bloquer les cookies ? -</strong> L’utilisateur peut configurer son ordinateur de la manière suivante, pour refuser
        l’installation des cookies :
      </p>
      <p>
        <strong>Sous Internet Explorer :</strong> onglet outil (pictogramme en forme de rouage en haut à droite) / options internet. Cliquez sur
        Confidentialité et choisissez Bloquer tous les cookies. Validez sur Ok.
      </p>
      <p>
        <strong>Sous Firefox :</strong> en haut de la fenêtre du navigateur, cliquez sur le bouton Firefox, puis aller dans l’onglet Options. Cliquer
        sur l’onglet Vie privée. Paramétrez les Règles de conservation sur : utiliser les paramètres personnalisés pour l’historique. Enfin
        décochez-la pour désactiver les cookies.
      </p>
      <p>
        <strong>Sous Safari : </strong>Cliquez en haut à droite du navigateur sur le pictogramme de menu (symbolisé par un rouage). Sélectionnez
        Paramètres. Cliquez sur Afficher les paramètres avancés. Dans la section « Confidentialité », cliquez sur Paramètres de contenu. Dans la
        section « Cookies », vous pouvez bloquer les cookies.
      </p>
      <p>
        <strong>Sous Chrome :</strong> Cliquez en haut à droite du navigateur sur le pictogramme de menu (symbolisé par trois lignes horizontales).
        Sélectionnez Paramètres. Cliquez sur Afficher les paramètres avancés. Dans la section « Confidentialité », cliquez sur préférences. Dans
        l’onglet « Confidentialité », vous pouvez bloquer les cookies.
      </p>
      <p>
        <strong>Suppression -</strong> Les utilisateur peuvent les supprimer dans les paramètres du navigateur. Toutefois, la suppression de ces
        cookies peut entrainer certaines perturbations dans l’utilisation du site.
      </p>
      <p>
        <strong>Pour plus d’information -</strong> Pour une meilleure connaissance et maitrise des cookies de toute origine et pas seulement ceux du
        Site, les utilisateurs sont invités à consulter le site Youronlinechoices, édité par l’Interactive Advertising Bureau France (IAB) et la page
        spécifique de la CNIL :
      </p>
      <figure>
        <Image src="https://www.monplancbd.fr/wp-content/uploads/2020/09/data-security-t-1024x538.jpg" alt="cbd" width="256" height="135" />
        <figcaption>http://www.youronlinechoices.com/fr/controler-ses-cookies/</figcaption>
      </figure>
    </div>
  );
}
