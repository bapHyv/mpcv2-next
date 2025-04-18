import { linkClassname } from "@/app/staticData/cartPageClasses";
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
    <div className="utility-page">
      {/* Section I: About CBD & Legality */}
      <h2>{t("section1.title")}</h2>
      <div>
        <h3>{t("section1.q1.question")}</h3>
        <p>{t("section1.q1.answer")}</p>
      </div>
      <div>
        <h3>{t("section1.q2.question")}</h3>
        <p>{t("section1.q2.answer")}</p>
      </div>
      <div>
        <h3>{t("section1.q3.question")}</h3>
        <p>{t("section1.q3.answer")}</p>
      </div>
      <div>
        <h3>{t("section1.q4.question")}</h3>
        <p>{t("section1.q4.answer")}</p>
      </div>
      <div>
        <h3>{t("section1.q5.question")}</h3>
        <p>{t("section1.q5.answer")}</p>
      </div>
      <div>
        <h3>{t("section1.q6.question")}</h3>
        <p>{t("section1.q6.answer")}</p>
      </div>
      <div>
        <h3>{t("section1.q7.question")}</h3>
        <p>{t("section1.q7.answer")}</p>
      </div>
      {/* Section II: About MonPlanCBD Products */}
      <h2>{t("section2.title")}</h2>
      <div>
        <h3>{t("section2.q8.question")}</h3>
        {/* Using dangerouslySetInnerHTML to allow the link within the translation */}
        <p
          dangerouslySetInnerHTML={{
            __html: t("section2.q8.answer", {
              productsLink: `<a href="/${locale}/fleurs-cbd" class="${linkClassname}">${t("section2.q8.productsLinkText")}</a>`,
            }),
          }}
        />
      </div>
      <div>
        <h3>{t("section2.q9.question")}</h3>
        {/* Using <ul> for the multi-part answer */}
        <ul>
          <li>
            <strong>{t("section2.q9.answer_flowers_label")}</strong>: {t("section2.q9.answer_flowers_text")}
          </li>
          <li>
            <strong>{t("section2.q9.answer_oils_label")}</strong>: {t("section2.q9.answer_oils_text")}
          </li>
          <li>
            <strong>{t("section2.q9.answer_resins_label")}</strong>: {t("section2.q9.answer_resins_text")}
          </li>
        </ul>
      </div>
      <div>
        <h3>{t("section2.q10.question")}</h3>
        <p>{t("section2.q10.answer")}</p>
      </div>
      <div>
        <h3>{t("section2.q11.question")}</h3>
        <p>{t("section2.q11.answer")}</p>
      </div>
      <div>
        <h3>{t("section2.q12.question")}</h3>
        {/* Using dangerouslySetInnerHTML to allow the link within the translation */}
        <p
          dangerouslySetInnerHTML={{
            __html: t("section2.q12.answer", {
              analysisLink: `<a href="https://www.monplancbd.fr/analyses" class="${linkClassname}">${t("section2.q12.analysisLinkText")}</a>`,
            }),
          }}
        />
        {/* Note: Replace "/lien-analyses" with the actual link to the analysis page or info */}
      </div>
      <div>
        <h3>{t("section2.q13.question")}</h3>
        <p>{t("section2.q13.answer")}</p>
      </div>
      <div>
        <h3>{t("section2.q14.question")}</h3>
        <p>{t("section2.q14.answer")}</p>
      </div>
      {/* Section III: Usage & Recommendations */}
      <h2>{t("section3.title")}</h2>
      <div>
        <h3>{t("section3.q15.question")}</h3>
        <p>{t("section3.q15.intro")}</p>
        <ul>
          <li>
            <strong>{t("section3.q15.answer_infusion_label")}</strong>: {t("section3.q15.answer_infusion_text")}
          </li>
          <li>
            <strong>{t("section3.q15.answer_vaporization_label")}</strong>: {t("section3.q15.answer_vaporization_text")}
          </li>
        </ul>
      </div>
      <div>
        <h3>{t("section3.q16.question")}</h3>
        <p>{t("section3.q16.answer")}</p>
      </div>
      <div>
        <h3>{t("section3.q17.question")}</h3>
        <p>
          <strong>{t("section3.q17.answer_emphasis")}</strong> {t("section3.q17.answer_text")}
        </p>
      </div>
      <div>
        <h3>{t("section3.q18.question")}</h3>
        <p>{t("section3.q18.answer")}</p>
      </div>
      {/* Section IV: Ordering & Account */}
      <h2>{t("section4.title")}</h2>
      <div>
        <h3>{t("section4.q19.question")}</h3>
        <p>{t("section4.q19.answer")}</p>
      </div>
      <div>
        <h3>{t("section4.q20.question")}</h3>
        <p>{t("section4.q20.answer")}</p>
      </div>
      <div>
        <h3>{t("section4.q21.question")}</h3>
        <p>{t("section4.q21.answer")}</p>
      </div>
      <div>
        <h3>{t("section4.q22.question")}</h3>
        {/* Using dangerouslySetInnerHTML to allow the link within the translation */}
        <p
          dangerouslySetInnerHTML={{
            __html: t("section4.q22.answer", {
              loyaltyProgramLink: `<a href="/${locale}/mon-compte/fidelite" class="${linkClassname}">${t("section4.q22.loyaltyProgramLinkText")}</a>`,
            }),
          }}
        />
        {/* Note: Adjust href="/${locale}/mon-compte/fidelite" if slug differs */}
      </div>
      {/* Section V: Shipping & Delivery */}
      <h2>{t("section5.title")}</h2>
      <div>
        <h3>{t("section5.q23.question")}</h3>
        {/* Using dangerouslySetInnerHTML for the link */}
        <p
          dangerouslySetInnerHTML={{
            __html: t("section5.q23.answer", {
              shippingPolicyLink: `<a href="/${locale}/politique-expedition" class="${linkClassname}">${t(
                "section5.q23.shippingPolicyLinkText"
              )}</a>`,
            }),
          }}
        />
        {/* Note: Adjust href="/${locale}/politique-expedition" if slug differs */}
      </div>
      <div>
        <h3>{t("section5.q24.question")}</h3>
        {/* Using dangerouslySetInnerHTML for the link */}
        <p
          dangerouslySetInnerHTML={{
            __html: t("section5.q24.answer", {
              shippingPolicyLink: `<a href="/${locale}/politique-expedition" class="${linkClassname}">${t(
                "section5.q24.shippingPolicyLinkText"
              )}</a>`,
            }),
          }}
        />
      </div>
      <div>
        <h3>{t("section5.q25.question")}</h3>
        <p>{t("section5.q25.answer")}</p>
      </div>
      <div>
        <h3>{t("section5.q26.question")}</h3>
        {/* Using dangerouslySetInnerHTML for the link */}
        <p
          dangerouslySetInnerHTML={{
            __html: t("section5.q26.answer", {
              gtcLink: `<a href="/${locale}/conditions-generales-de-vente" class="${linkClassname}">${t("section5.q26.gtcLinkText")}</a>`,
            }),
          }}
        />
      </div>
      <div>
        <h3>{t("section5.q27.question")}</h3>
        <p>{t("section5.q27.answer")}</p>
      </div>
      {/* Section VI: Returns & Issues */}
      <h2>{t("section6.title")}</h2>
      <div>
        <h3>{t("section6.q28.question")}</h3>
        <p>{t("section6.q28.answer")}</p>
      </div>
      <div>
        <h3>{t("section6.q29.question")}</h3>
        {/* Using dangerouslySetInnerHTML for links */}
        <p
          dangerouslySetInnerHTML={{
            __html: t("section6.q29.answer", {
              gtcLink: `<a href="/${locale}/conditions-generales-de-vente" class="${linkClassname}">${t("section6.q29.gtcLinkText")}</a>`,
              returnPolicyLink: `<a href="/${locale}/politique-de-retour" class="${linkClassname}">${t("section6.q29.returnPolicyLinkText")}</a>`,
            }),
          }}
        />
        {/* Note: Adjust href="/${locale}/politique-de-retour" if slug differs or policy isn't separate */}
      </div>
      {/* Section VII: Safety & Precautions */}
      <h2>{t("section7.title")}</h2>
      <div>
        <h3>{t("section7.q30.question")}</h3>
        <p>{t("section7.q30.answer")}</p>
      </div>
      <div>
        <h3>{t("section7.q31.question")}</h3>
        <p>{t("section7.q31.answer")}</p>
      </div>
      <div>
        <h3>{t("section7.q32.question")}</h3>
        <p>{t("section7.q32.answer")}</p>
      </div>
      <div>
        <h3>{t("section7.q33.question")}</h3>
        <p>
          <strong>{t("section7.q33.answer_emphasis")}</strong> {t("section7.q33.answer_text")}
        </p>
      </div>
      <div>
        <h3>{t("section7.q34.question")}</h3>
        <p>{t("section7.q34.answer")}</p>
      </div>
      {/* Section VIII: Contact & Support */}
      <h2>{t("section8.title")}</h2>
      <div>
        <h3>{t("section8.q35.question")}</h3>
        <p>{t("section8.q35.intro")}</p>
        {/* Using <ul> for contact methods */}
        <ul>
          <li>
            {t("section8.q35.email_label")}:{" "}
            <a href={`mailto:${t("section8.q35.email_value")}`} className={linkClassname}>
              {t("section8.q35.email_value")}
            </a>
          </li>
          <li>
            {t("section8.q35.phone_label")}: {t("section8.q35.phone_value")}
          </li>
          <li>
            {t("section8.q35.form_label")}{" "}
            <a href="/lien-contact" className={linkClassname}>
              {t("section8.q35.form_link_text")}
            </a>
            .
          </li>{" "}
          {/* Note: Replace "/lien-contact" */}
        </ul>
        <p>{t("section8.q35.outro")}</p>
      </div>
      {/* TODO: check previous _______________________________________________________________________________________________________________ */}
      <p>_______________________________________________________________________________________________________________</p>
      <p>PREVIOUS:</p>
      <h1>FAQ - CBD</h1>
      <h3>CBD : Le cannabidiol, qu’est-ce que c’est ?</h3>
      <p>
        Le cannabidiol&nbsp;<strong>(CBD)&nbsp;</strong>est une molécule présente dans le chanvre et complète le spectre des 110 autres cannabinoïdes
        connus à ce jour. On lui connaît des vertus bien-être pour le sommeil, le stress, l’anxiété, les tensions musculaires, etc. On le retrouve
        sous forme de baume, d’huile ou de fleurs à infuser.
      </p>
      <h3>Comment connaître le taux de CBD/THC?</h3>
      <p>
        Il est tout naturel de vouloir connaître les taux de CBD ou de THC présents dans les fleurs et les huiles de chanvre que nous vous proposons.
        C’est pourquoi chaque étiquette produit se verra apposer un QR code qui vous redirigera vers l’analyse associée, répondant aux procédures
        requises par l’arrêté 2004-02-24 art. 3 JORF du 21 mars 2004.
      </p>
      <h3>Comment utiliser du CBD ?</h3>
      <p>
        Il n’y a pas une seule meilleure façon, tout simplement parce que chaque personne a un profil unique et particulier. La méthode la plus connue
        est l’infusion de la fleur de chanvre en incorporant un corps gras dans le mélange. Par exemple, vVous pouvez ajouter du beurre, de la crème
        ou encore de huile végétale (comme l’huile de coco) dans de l’eau frémissante à 90°CLaissez infuser 10 à 15 min. Servez.
      </p>
      <h3>Puis-je me faire livrer du CBD à domicile ?</h3>
      <p>
        Si vous habitez dans l’une de ces villes (
        <a href="https://www.google.com/maps/d/edit?mid=1UBp3lAoKqBxWujjIMBFOLJ6BtedjGsBI&amp;usp=sharing" target="_blank" rel="nofollow noopener">
          voir la carte
        </a>
        ), vous pourrez recevoir vos produits sous 24H. La qualité de service et d’information sont des critères essentiels pour Mon Plan CBD.&nbsp;
        Pour cette raison, vous recevrez votre commande dans un conditionnement garantissant une conservation optimale afin de profiter au maximum des
        vertus bien-êtres recherchées.
      </p>
      <h3>Quelques recommandations…</h3>
      Conformément à la loi en vigueur, nos produits ne sont pas destinés à la combustion. Il s’agit de respecter la méthode mentionnée plus haut, à
      savoir l’infusion avec un corps gras. Ne pas fumer, ne pas conduire après consommation, déconseillé pour la femme enceinte ou allaitante. Si
      vous souhaitez en savoir plus sur les conditions d’utilisation, veuillez&nbsp;
      <a
        href={`https://www.monplancbd.fr/${locale}/blog/comment-choisir-et-consommer-fleurs-cbd/`}
        target="_blank"
        rel="noreferrer noopener nofollow"
        aria-label="cliquer ici (opens in a new tab)"
      >
        cliquer ici
      </a>
      . Nos produits ne sont ni des stupéfiants, ni des médicaments. Pour toute question, n’hésitez pas à nous joindre sur les réseaux sociaux ou par
      e-mail à l’adresse que vous trouverez dans la rubrique , en mentionnant votre demande en objet.
    </div>
  );
}
