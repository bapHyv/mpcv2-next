import { linkClassname } from "@/app/staticData/cartPageClasses";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

interface GenerateMetadataParams {
  params: { locale: string };
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
      <p>{t("section1.intro")}</p>

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

      {/* TODO: CHECK hosting informations!!! */}
      {/* H2: 2. Administration du Site */}
      <h2>{t("section2.title")}</h2>
      <ul className="list-none space-y-2 my-4">
        <li>
          {/* H3: Directeur de la Publication */}
          <h3>{t("section2.item_director.label")}</h3>
          <p>{t("section2.item_director.value")}</p>
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
          <p>
            {t("section3.item_hostName.value")} <em>({t("toBeVerified")})</em>
          </p>
        </li>
        <li>
          {/* H3: Raison Sociale de l'Hébergeur */}
          <h3>{t("section3.item_hostCompany.label")}</h3>
          <p>
            {t("section3.item_hostCompany.value")} <em>({t("toBeVerified")})</em>
          </p>
        </li>
        <li>
          {/* H3: Adresse de l'Hébergeur */}
          <h3>{t("section3.item_hostAddress.label")}</h3>
          <p>
            {t("section3.item_hostAddress.value")} <em>({t("toBeVerified")})</em>
          </p>
        </li>
        <li>
          {/* H3: Contact de l'Hébergeur */}
          <h3>{t("section3.item_hostContact.label")}</h3>
          <p>
            {t("section3.item_hostContact.value")} <em>({t("toBeVerified")})</em>
          </p>
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
      {/* Note: Adjust href="/${locale}/politiques-de-confidentialites" if slug differs */}

      {/* H2: 6. Utilisation des Cookies */}
      <h2>{t("section6.title")}</h2>
      <p
        dangerouslySetInnerHTML={{
          __html: t("section6.para1", {
            privacyPolicyLink: `<a href="/${locale}/politiques-de-confidentialites" class="${linkClassname}">${t(
              "section6.privacyPolicyLinkText"
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
      <p>{t("section10.para1", { updateDate: "17/04/2025" })}</p>
      {/* Replace placeholder in translation or dynamically insert date */}

      {/* TODO: check previous _______________________________________________________________________________________________________________ */}
      <p>_______________________________________________________________________________________________________________</p>
      <p>PREVIOUS:</p>
      <h1>MENTIONS LÉGALES</h1>
      <h2>Présentation du site</h2>
      <p>
        En vertu de l’article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique, il est précisé aux utilisateurs du
        site monplancbd.fr l’identité des différents intervenants dans le cadre de sa réalisation et de son suivi :
      </p>
      <h2>Informations légales</h2>
      <ul>
        <li>
          -Nom de la Société: <strong>SAS MONPLANCBD</strong>
        </li>
        <li>
          -Adresse du siège social: <strong>2 place Elie Lambert, 64100, Bayonne</strong>
        </li>
        <li>
          -Téléphone: <strong>06.51.64.16.43</strong>
        </li>
        <li>
          -Capital: <strong>1000 €</strong>
        </li>
        <li>
          -SIRET: <strong>88780395500012</strong>
        </li>
        <li>
          -R.C.S: <strong>887 803 955 R.C.S. BAYONNE</strong>
        </li>
        <li>
          -Numéro TVA intracommunautaire: <strong>FR39 887803955</strong>
        </li>
        <li>
          -Adresse de courrier électronique: <strong>contact@monplancbd.fr</strong>-
        </li>
        <li>
          <a href={`https://monplancbd.fr/${locale}/conditions-generales-de-vente/`}>Conditions générales de vente</a>
        </li>
      </ul>
      <h2>Hébergement</h2>
      <ul>
        <li>
          Adresse: <strong>ONLINE SAS BP 438 75366 PARIS CEDEX 08 FRANCE</strong>
        </li>
        <li>
          Téléphone: <strong>+33 (0)1 84 13 00 00</strong>
        </li>
      </ul>
      <h2>Administration du site</h2>
      <ul>
        <li>
          -Créateur du site: <strong>MonPlanCBD</strong>
        </li>
        <li>
          -Responsable de la publication: <strong>HAMDADA Mohamed Yacine</strong>
        </li>
        <li>
          -Contacter le responsable de la publication : <strong>contact@monplancbd.fr</strong>
        </li>
        <li>
          -Le responsable de la publication est une personne morale -Le Webmaster est: <strong>HAMDADA Mohamed Yacine</strong>
        </li>
        <li>
          -Contacter le Webmaster<strong>:</strong> contact@monplancbd.fr
        </li>
      </ul>
      <h2>Liens hypertextes et utilisation des cookies</h2>
      <p>
        Le site monplancbd.fr contient un certain nombre de liens hypertextes vers d’autres sites, mis en place avec l’autorisation de MONPLANCBD.
        Cependant, MONPLANCBD n’a pas la possibilité de vérifier le contenu des sites ainsi visités et n’assumera en conséquence aucune responsabilité
        de ce fait.
      </p>
      <p>
        La navigation sur le site monplancbd.fr est susceptible de provoquer l’installation de cookie(s) sur l’ordinateur de l’utilisateur. Un cookie
        est un fichier de petite taille, qui ne permet pas l’identification de l’utilisateur, mais qui enregistre des informations relatives à la
        navigation d’un ordinateur sur un site. Les données ainsi obtenues visent à faciliter la navigation ultérieure sur le site et ont également
        vocation à permettre diverses mesures de fréquentation.
      </p>
      <p>
        Le refus d’installation d’un cookie peut entraîner l’impossibilité d’accéder à certains services. L’utilisateur peut toutefois configurer son
        ordinateur de la manière suivante, pour refuser l’installation des cookies :
      </p>
      <p>
        Sous Internet Explorer : onglet outil (pictogramme en forme de rouage en haut a droite) / options internet. Cliquez sur Confidentialité et
        choisissez Bloquer tous les cookies. Validez sur Ok.
      </p>
      <p>
        Sous Firefox : en haut de la fenêtre du navigateur, cliquez sur le bouton Firefox, puis aller dans l’onglet Options. Cliquer sur l’onglet Vie
        privée.
      </p>
      <p>
        Paramétrez les Règles de conservation sur : utiliser les paramètres personnalisés pour l’historique. Enfin décochez-la pour désactiver les
        cookies.
      </p>
      <p>
        Sous Safari : Cliquez en haut à droite du navigateur sur le pictogramme de menu (symbolisé par un rouage). Sélectionnez Paramètres. Cliquez
        sur Afficher les paramètres avancés. Dans la section “Confidentialité”, cliquez sur Paramètres de contenu. Dans la section “Cookies”, vous
        pouvez bloquer les cookies.
      </p>
      <p>
        Sous Chrome : Cliquez en haut à droite du navigateur sur le pictogramme de menu (symbolisé par trois lignes horizontales). Sélectionnez
        Paramètres. Cliquez sur Afficher les paramètres avancés. Dans la section “Confidentialité”, cliquez sur préférences. Dans l’onglet
        “Confidentialité”, vous pouvez bloquer les cookies.
      </p>
      <h2>Utilisation des données personnelles</h2>
      <p>
        En France, les données personnelles sont notamment protégées par la loi n° 78-87 du 6 janvier 1978, la loi n° 2004-801 du 6 août 2004,
        l’article L. 226-13 du Code pénal et la Directive Européenne du 24 octobre 1995.
      </p>
      <p>
        A l’occasion de l’utilisation du site monplancbd.fr, peuvent êtres recueillies : l’URL des liens par l’intermédiaire desquels l’utilisateur a
        accédé au site monplancbd.fr, le fournisseur d’accès de l’utilisateur, l’adresse de protocole Internet (IP) de l’utilisateur.
      </p>
      <p>
        En tout état de cause, MONPLANCBD ne collecte des informations personnelles relatives à l’utilisateur uniquement pour le besoin de certains
        services proposés par le site monplancbd.fr. L’utilisateur fournit ces informations en toute connaissance de cause, notamment lorsqu’il
        procède par lui-même à leur saisie. Il est alors précisé à l’utilisateur du site monplancbd.fr l’obligation ou non de fournir ces
        informations.
      </p>
      <p>
        Conformément aux dispositions des articles 38 et suivants de la loi 78-17 du 6 janvier 1978 relative à l’informatique, aux fichiers et aux
        libertés, tout utilisateur dispose d’un droit d’accès, de rectification et d’opposition aux données personnelles le concernant, en effectuant
        sa demande écrite et signée, accompagnée d’une copie du titre d’identité avec signature du titulaire de la pièce, en précisant l’adresse à
        laquelle la réponse doit être envoyée.
      </p>
      <p>
        Aucune information personnelle de l’utilisateur du site monplancbd.fr n’est publiée à l’insu de l’utilisateur, échangée, transférée, cédée ou
        vendue sur un support quelconque à des tiers. Seule l’hypothèse du rachat de MONPLANCBD et de ses droits permettrait la transmission des dites
        informations à l’éventuel acquéreur qui serait à son tour tenu de la même obligation de conservation et de modification des données vis à vis
        de l’utilisateur du site monplancbd.fr.
      </p>
      <p>
        Les bases de données sont protégées par les dispositions de la loi du 1er juillet 1998 transposant la directive 96/9 du 11 mars 1996 relative
        à la protection juridique des bases de données.
      </p>
    </div>
  );
}
