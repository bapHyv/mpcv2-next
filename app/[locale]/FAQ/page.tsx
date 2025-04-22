import { linkClassname } from "@/app/staticData/cartPageClasses";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
// import FaqContent from './Content';

interface GenerateMetadataParams {
  params: { locale: string };
}

export async function generateMetadata({ params }: GenerateMetadataParams): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "" });
  const siteBaseUrl = process.env.MAIN_URL || "https://www.monplancbd.fr";

  const title = t("metadataFAQ.title");
  const description = t("metadataFAQ.description");

  return {
    title: title,
    description: description,
    keywords: t("metadataFAQ.keywords")
      .split(",")
      .map((k) => k.trim()),
    alternates: {
      canonical: `${siteBaseUrl}/${locale}/FAQ`,
      languages: {
        "fr-FR": `${siteBaseUrl}/fr/FAQ`,
        "en-US": `${siteBaseUrl}/en/FAQ`,
        "es-ES": `${siteBaseUrl}/es/FAQ`,
        "x-default": `${siteBaseUrl}/fr/FAQ`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: title,
      description: description,
      url: `${siteBaseUrl}/${locale}/FAQ`,
      siteName: t("global.brandName"),
      images: [
        {
          url: `${siteBaseUrl}/og-image-faq.jpg`,
          width: 1200,
          height: 630,
          alt: t("metadataFAQ.ogImageAlt"),
        },
      ],
      locale: locale.replace("-", "_"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [`${siteBaseUrl}/og-image-faq.jpg`],
    },
  };
}

interface Params {
  params: {
    locale: string;
  };
}

export default async function Page({ params: { locale } }: Params) {
  const t = await getTranslations({ locale, namespace: "FAQ" });

  const faqData = [
    // Section I: About CBD & Legality
    { id: "q1", questionKey: "section1.q1.question", answerKey: "section1.q1.answer" },
    { id: "q2", questionKey: "section1.q2.question", answerKey: "section1.q2.answer" },
    { id: "q3", questionKey: "section1.q3.question", answerKey: "section1.q3.answer" },
    { id: "q4", questionKey: "section1.q4.question", answerKey: "section1.q4.answer" },
    { id: "q5", questionKey: "section1.q5.question", answerKey: "section1.q5.answer" },
    { id: "q6", questionKey: "section1.q6.question", answerKey: "section1.q6.answer" },
    { id: "q7", questionKey: "section1.q7.question", answerKey: "section1.q7.answer" },

    // Section II: About MonPlanCBD Products
    { id: "q8", questionKey: "section2.q8.question", answerKey: "section2.q8.answer" },
    { id: "q9", questionKey: "section2.q9.question", answerKey: "section2.q9.answer_flowers_text" },
    { id: "q10", questionKey: "section2.q10.question", answerKey: "section2.q10.answer" },
    { id: "q11", questionKey: "section2.q11.question", answerKey: "section2.q11.answer" },
    { id: "q12", questionKey: "section2.q12.question", answerKey: "section2.q12.answer" },
    { id: "q13", questionKey: "section2.q13.question", answerKey: "section2.q13.answer" },
    { id: "q14", questionKey: "section2.q14.question", answerKey: "section2.q14.answer" },

    // Section III: Usage & Recommendations
    { id: "q15", questionKey: "section3.q15.question", answerKey: "section3.q15.intro" },
    { id: "q16", questionKey: "section3.q16.question", answerKey: "section3.q16.answer" },
    { id: "q17", questionKey: "section3.q17.question", answerKey: "section3.q17.answer_text" },
    { id: "q18", questionKey: "section3.q18.question", answerKey: "section3.q18.answer" },

    // Section IV: Ordering & Account
    { id: "q19", questionKey: "section4.q19.question", answerKey: "section4.q19.answer" },
    { id: "q20", questionKey: "section4.q20.question", answerKey: "section4.q20.answer" },
    { id: "q21", questionKey: "section4.q21.question", answerKey: "section4.q21.answer" },
    { id: "q22", questionKey: "section4.q22.question", answerKey: "section4.q22.answer" },

    // Section V: Shipping & Delivery
    { id: "q23", questionKey: "section5.q23.question", answerKey: "section5.q23.answer" },
    { id: "q24", questionKey: "section5.q24.question", answerKey: "section5.q24.answer" },
    { id: "q25", questionKey: "section5.q25.question", answerKey: "section5.q25.answer" },
    { id: "q26", questionKey: "section5.q26.question", answerKey: "section5.q26.answer" },
    { id: "q27", questionKey: "section5.q27.question", answerKey: "section5.q27.answer" },

    // Section VI: Returns & Issues
    { id: "q28", questionKey: "section6.q28.question", answerKey: "section6.q28.answer" },
    { id: "q29", questionKey: "section6.q29.question", answerKey: "section6.q29.answer" },

    // Section VII: Safety & Precautions
    { id: "q30", questionKey: "section7.q30.question", answerKey: "section7.q30.answer" },
    { id: "q31", questionKey: "section7.q31.question", answerKey: "section7.q31.answer" },
    { id: "q32", questionKey: "section7.q32.question", answerKey: "section7.q32.answer" },
    { id: "q33", questionKey: "section7.q33.question", answerKey: "section7.q33.answer_text" },
    { id: "q34", questionKey: "section7.q34.question", answerKey: "section7.q34.answer" },

    // Section VIII: Contact & Support
    { id: "q35", questionKey: "section8.q35.question", answerKey: "section8.q35.intro" },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((item) => {
      const siteBaseUrl = process.env.MAIN_URL || "https://www.monplancbd.fr";
      // Get the raw translated string. Provide dummy/empty placeholders
      // for any variables (like links) expected by the translation string,
      // as we only want the core text for the schema.
      let rawAnswerText = t(item.answerKey, {
        productsLink: `${siteBaseUrl}/${locale}/fleurs-cbd`,
        analysisLink: `${siteBaseUrl}/analyses/`,
        loyaltyProgramLink: `${siteBaseUrl}/${locale}/mon-compte/fidelite`,
        shippingPolicyLink: `${siteBaseUrl}/${locale}/`,
        gtcLink: `${siteBaseUrl}/${locale}/`,
        returnPolicyLink: `${siteBaseUrl}/${locale}/`,
        profileLink: `${siteBaseUrl}/${locale}/`,
        addressesLink: `${siteBaseUrl}/${locale}/`,
        cnilLink: `${siteBaseUrl}/${locale}/`,
        odrLink: `${siteBaseUrl}/${locale}/`,
        // Add any other placeholders your translations might use for links/variables
      });

      let answerText = "";

      // --- Manual Concatenation for specific multi-part answers ---
      // Adjust these based on your exact translation keys and desired plain text output

      if (item.id === "q9") {
        answerText = `${t("section2.q9.answer_flowers_label")}: ${t("section2.q9.answer_flowers_text")} ${t("section2.q9.answer_oils_label")}: ${t(
          "section2.q9.answer_oils_text"
        )} ${t("section2.q9.answer_resins_label")}: ${t("section2.q9.answer_resins_text")}`;
      }
      // Q15 (Usage Methods List)
      else if (item.id === "q15") {
        answerText = `${t("section3.q15.intro")} ${t("section3.q15.answer_infusion_label")}: ${t("section3.q15.answer_infusion_text")} ${t(
          "section3.q15.answer_vaporization_label"
        )}: ${t("section3.q15.answer_vaporization_text")}`;
      }
      // Q35 (Contact Info List)
      else if (item.id === "q35") {
        const formLinkText = t("section8.q35.form_link_text");
        answerText = `${t("section8.q35.intro")} ${t("section8.q35.email_label")}: ${t("section8.q35.email_value")}. ${t(
          "section8.q35.phone_label"
        )}: ${t("section8.q35.phone_value")}. ${t("section8.q35.form_label")} ${formLinkText}. ${t("section8.q35.outro")}`;
        answerText = answerText.replace(new RegExp(formLinkText + "\\.$"), formLinkText);
      }
      // Q8 (Product Range Link)
      else if (item.id === "q8") {
        const linkText = t("section2.q8.productsLinkText");
        // Replace the placeholder in the raw text with the actual link text
        answerText = t(item.answerKey, { productsLink: linkText });
        // Strip any remaining minor HTML potentially introduced if linkText had tags
        answerText = answerText
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      }
      // Q12 (Analysis Link)
      else if (item.id === "q12") {
        const linkText = t("section2.q12.analysisLinkText");
        answerText = t(item.answerKey, { analysisLink: linkText });
        answerText = answerText
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      }
      // Q22 (Loyalty Link)
      else if (item.id === "q22") {
        const linkText = t("section4.q22.loyaltyProgramLinkText");
        answerText = t(item.answerKey, { loyaltyProgramLink: linkText });
        answerText = answerText
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      }
      // Q23 (Shipping Policy Link 1)
      else if (item.id === "q23") {
        const linkText = t("section5.q23.shippingPolicyLinkText");
        answerText = t(item.answerKey, { shippingPolicyLink: linkText });
        answerText = answerText
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      }
      // Q24 (Shipping Policy Link 2)
      else if (item.id === "q24") {
        const linkText = t("section5.q24.shippingPolicyLinkText");
        answerText = t(item.answerKey, { shippingPolicyLink: linkText });
        answerText = answerText
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      }
      // Q26 (GTC Link)
      else if (item.id === "q26") {
        const linkText = t("section5.q26.gtcLinkText");
        answerText = t(item.answerKey, { gtcLink: linkText });
        answerText = answerText
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      }
      // Q29 (GTC & Return Policy Links)
      else if (item.id === "q29") {
        const gtcLinkText = t("section6.q29.gtcLinkText");
        const returnPolicyLinkText = t("section6.q29.returnPolicyLinkText");
        answerText = t(item.answerKey, {
          gtcLink: gtcLinkText,
          returnPolicyLink: returnPolicyLinkText,
        });
        answerText = answerText
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      }

      // --- Default Handling for simple answers ---
      else {
        // Apply basic HTML stripping to the raw answer text
        answerText = rawAnswerText
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      }

      // --- Return the structured data object for this Q&A pair ---
      return {
        "@type": "Question",
        name: t(item.questionKey), // Translated question text
        acceptedAnswer: {
          "@type": "Answer",
          text: answerText, // The processed, plain text answer
        },
      };
    }),
  };

  return (
    <div className="utility-page">
      {/* Inject the schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema, null, 2) }} // Pretty print for dev
      />
      {/* Page Title & Last Updated */}
      <h1>{t("pageTitle")}</h1>
      <p className="text-sm text-gray-500 mb-6">{t("lastUpdated")}</p>
      {/* --- Render Section I --- */}
      <h2>{t("section1.title")}</h2>
      {faqData
        .filter((q) => q.questionKey.startsWith("section1."))
        .map((item) => (
          <div key={item.id}>
            <h3>{t(item.questionKey)}</h3>
            <p>{t(item.answerKey)}</p>
          </div>
        ))}
      {/* --- Render Section II --- */}
      <h2>{t("section2.title")}</h2>
      {faqData
        .filter((q) => q.questionKey.startsWith("section2."))
        .map((item) => (
          <div key={item.id}>
            <h3>{t(item.questionKey)}</h3>
            {item.id === "q9" ? ( // Handle Q9 list rendering
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
            ) : (
              // Handle other Qs in Section II, including links
              <p
                dangerouslySetInnerHTML={{
                  __html: t(item.answerKey, {
                    // Pass link placeholders for rendering
                    productsLink: `<a href="/${locale}/fleurs-cbd" class="${linkClassname}">${t("section2.q8.productsLinkText")}</a>`,
                    analysisLink: `<a href="https://www.monplancbd.fr/analyses" class="${linkClassname}">${t("section2.q12.analysisLinkText")}</a>`,
                  }),
                }}
              />
            )}
          </div>
        ))}
      {/* --- Render Section III --- */}
      <h2>{t("section3.title")}</h2>
      {faqData
        .filter((q) => q.questionKey.startsWith("section3."))
        .map((item) => (
          <div key={item.id}>
            <h3>{t(item.questionKey)}</h3>
            {item.id === "q15" ? ( // Handle Q15 list rendering
              <>
                <p>{t("section3.q15.intro")}</p>
                <ul>
                  <li>
                    <strong>{t("section3.q15.answer_infusion_label")}</strong>: {t("section3.q15.answer_infusion_text")}
                  </li>
                  <li>
                    <strong>{t("section3.q15.answer_vaporization_label")}</strong>: {t("section3.q15.answer_vaporization_text")}
                  </li>
                </ul>
              </>
            ) : item.id === "q17" ? ( // Handle Q17 emphasis
              <p>
                <strong>{t("section3.q17.answer_emphasis")}</strong> {t(item.answerKey)}
              </p>
            ) : (
              // Simple paragraph for others
              <p>{t(item.answerKey)}</p>
            )}
          </div>
        ))}
      {/* --- Render Section IV --- */}
      <h2>{t("section4.title")}</h2>
      {faqData
        .filter((q) => q.questionKey.startsWith("section4."))
        .map((item) => (
          <div key={item.id}>
            <h3>{t(item.questionKey)}</h3>
            <p
              dangerouslySetInnerHTML={{
                __html: t(item.answerKey, {
                  loyaltyProgramLink: `<a href="/${locale}/mon-compte/fidelite" class="${linkClassname}">${t(
                    "section4.q22.loyaltyProgramLinkText"
                  )}</a>`,
                }),
              }}
            />
          </div>
        ))}
      {/* --- Render Section V --- */}
      <h2>{t("section5.title")}</h2>
      {faqData
        .filter((q) => q.questionKey.startsWith("section5."))
        .map((item) => (
          <div key={item.id}>
            <h3>{t(item.questionKey)}</h3>
            <p
              dangerouslySetInnerHTML={{
                __html: t(item.answerKey, {
                  // Pass link placeholders relevant to Section V
                  shippingPolicyLink: `<a href="/${locale}/politique-expedition" class="${linkClassname}">${t(
                    "section5.q23.shippingPolicyLinkText"
                  )}</a>`, // Reuse text key or create specific if needed
                  gtcLink: `<a href="/${locale}/conditions-generales-de-vente" class="${linkClassname}">${t("section5.q26.gtcLinkText")}</a>`,
                }),
              }}
            />
          </div>
        ))}
      {/* --- Render Section VI --- */}
      <h2>{t("section6.title")}</h2>
      {faqData
        .filter((q) => q.questionKey.startsWith("section6."))
        .map((item) => (
          <div key={item.id}>
            <h3>{t(item.questionKey)}</h3>
            <p
              dangerouslySetInnerHTML={{
                __html: t(item.answerKey, {
                  // Pass link placeholders relevant to Section VI
                  gtcLink: `<a href="/${locale}/conditions-generales-de-vente" class="${linkClassname}">${t("section6.q29.gtcLinkText")}</a>`,
                  returnPolicyLink: `<a href="/${locale}/politique-expedition#return-policy" class="${linkClassname}">${t(
                    "section6.q29.returnPolicyLinkText"
                  )}</a>`, // Ensure return policy page exists or adjust link/text key
                }),
              }}
            />
          </div>
        ))}
      {/* --- Render Section VII --- */}
      <h2>{t("section7.title")}</h2>
      {faqData
        .filter((q) => q.questionKey.startsWith("section7."))
        .map((item) => (
          <div key={item.id}>
            <h3>{t(item.questionKey)}</h3>
            {item.id === "q33" ? ( // Handle Q33 emphasis
              <p>
                <strong>{t("section7.q33.answer_emphasis")}</strong> {t(item.answerKey)}
              </p>
            ) : (
              <p>{t(item.answerKey)}</p>
            )}
          </div>
        ))}
      {/* --- Render Section VIII --- */}
      <h2>{t("section8.title")}</h2>
      {faqData
        .filter((q) => q.questionKey.startsWith("section8."))
        .map((item) => (
          <div key={item.id}>
            <h3>{t(item.questionKey)}</h3>
            {/* Render the intro for Q35 */}
            <p>{t(item.answerKey)}</p>
            {/* Render the list items specifically for Q35 */}
            {item.id === "q35" && (
              <>
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
                  </li>
                </ul>
                <p>{t("section8.q35.outro")}</p>
              </>
            )}
          </div>
        ))}
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
