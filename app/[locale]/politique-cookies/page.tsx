import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { linkClassname } from "@/app/staticData/cartPageClasses";

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

  const title = t("cookiePolicy.metadata.title");
  const description = t("cookiePolicy.metadata.description");

  return {
    title: title,
    description: description,
    alternates: {
      canonical: `${siteBaseUrl}/${locale}/politique-cookies`,
      languages: {
        "fr-FR": `${siteBaseUrl}/fr/politique-cookies`,
        "en-US": `${siteBaseUrl}/en/politique-cookies`,
        "es-ES": `${siteBaseUrl}/es/politique-cookies`,
        "x-default": `${siteBaseUrl}/fr/politique-cookies`,
      },
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
      url: `${siteBaseUrl}/${locale}/politique-cookies`,
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

export default async function CookiePolicyPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "cookiePolicy" });

  return (
    <div className="utility-page">
      {" "}
      {/* Use base styling */}
      <h1>{t("pageTitle")}</h1>
      <p className="text-sm text-gray-500 mb-6">{t("lastUpdated")}</p>
      {/* 1. Introduction - What are Cookies? */}
      <h2>{t("section1.title")}</h2>
      <p>{t("section1.para1")}</p>
      <p>{t("section1.para2")}</p>
      {/* 2. How We Use Cookies */}
      <h2>{t("section2.title")}</h2>
      <p>{t("section2.para1")}</p>
      {/* 3. Types of Cookies We Use */}
      <h2>{t("section3.title")}</h2>
      {/* 3.1 Strictly Necessary Cookies */}
      <h3>{t("section3.necessary.title")}</h3>
      <p>{t("section3.necessary.para1")}</p>
      <p>{t("section3.necessary.para2")}</p>
      <ul className="list-disc list-inside my-4 space-y-1">
        <li>
          <strong>{t("section3.necessary.cookie1.name")}</strong>: {t("section3.necessary.cookie1.purpose")} (
          {t("section3.necessary.cookie1.duration")})
        </li>
        <li>
          <strong>{t("section3.necessary.cookie2.name")}</strong>: {t("section3.necessary.cookie2.purpose")} (
          {t("section3.necessary.cookie2.duration")})
        </li>
        {/* Add cookie for consent storage if using a cookie, otherwise mention localStorage */}
        <li>
          <strong>{t("section3.necessary.storage.name")}</strong>: {t("section3.necessary.storage.purpose")} (
          {t("section3.necessary.storage.duration")})
        </li>
      </ul>
      {/* 3.2 Functional Cookies */}
      <h3>{t("section3.functional.title")}</h3>
      <p>{t("section3.functional.para1")}</p>
      <p>{t("section3.functional.para2")}</p>
      <ul className="list-disc list-inside my-4 space-y-1">
        <li>
          <strong>{t("section3.functional.cookie1.name")}</strong>: {t("section3.functional.cookie1.purpose")} (
          {t("section3.functional.cookie1.duration")})
        </li>
      </ul>
      {/* 3.3 Analytics & Improvement Data (Not Cookies, but related data collection) */}
      <h3>{t("section3.analytics.title")}</h3>
      <p>{t("section3.analytics.para1")}</p>
      <p>{t("section3.analytics.para2")}</p>
      <ul className="list-disc list-inside my-4 space-y-1">
        <li>{t("section3.analytics.data1.name")}</li>
        <li>{t("section3.analytics.data2.name")}</li>
        <li>{t("section3.analytics.data3.name")}</li>
      </ul>
      <p>{t("section3.analytics.para3")}</p>
      {/* 4. Third-Party Cookies (If any) */}
      {/*
      <h2>{t("section4.title")}</h2>
      <p>{t("section4.para1")}</p>
      <p>{t("section4.para2")}</p>
      <ul className="list-disc list-inside my-4 space-y-1">
         Example: <li><strong>Google Analytics (_ga, _gid, _gat):</strong> {t("section4.service1.purpose")} ({t("section4.service1.duration")}). {t.rich("section4.service1.policyLink", { link: (chunks) => <a href="GOOGLE_ANALYTICS_POLICY_URL" target="_blank" rel="noopener noreferrer" className={linkClassname}>{chunks}</a> })}</li>
      </ul>
       */}
      {/* 5. Managing Your Cookie Preferences */}
      <h2>{t("section5.title")}</h2>
      <p>{t("section5.para1")}</p>
      <p
        dangerouslySetInnerHTML={{
          __html: t("section5.para2", {
            // Provide a placeholder or use a client component interaction later
            preferencesLink: `<span class="font-semibold text-green">${t("section5.preferencesLinkText")}</span>`, // Simple text for now
          }),
        }}
      />
      <p>{t("section5.para3")}</p>
      <ul className="list-disc list-inside my-4 space-y-1">
        <li>
          <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className={linkClassname}>
            Google Chrome
          </a>
        </li>
        <li>
          <a
            href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassname}
          >
            Mozilla Firefox
          </a>
        </li>
        <li>
          <a
            href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassname}
          >
            Apple Safari
          </a>
        </li>
        <li>
          <a
            href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassname}
          >
            Microsoft Edge
          </a>
        </li>
      </ul>
      <p>{t("section5.para4")}</p>
      {/* 6. Local Storage */}
      <h2>{t("section6.title")}</h2>
      <p>{t("section6.para1")}</p>
      <ul className="list-disc list-inside my-4 space-y-1">
        <li>
          <strong>{t("section6.item1.name")}</strong>: {t("section6.item1.purpose")}
        </li>
        <li>
          <strong>{t("section6.item2.name")}</strong>: {t("section6.item2.purpose")}
        </li>
        <li>
          <strong>{t("section6.item3.name")}</strong>: {t("section6.item3.purpose")}
        </li>
        <li>
          <strong>{t("section6.item4.name")}</strong>: {t("section6.item4.purpose")}
        </li>
      </ul>
      <p>{t("section6.para2")}</p>
      {/* 7. Changes to This Policy */}
      <h2>{t("section7.title")}</h2>
      <p>{t("section7.para1")}</p>
      {/* 8. Contact Us */}
      <h2>{t("section8.title")}</h2>
      <p
        dangerouslySetInnerHTML={{
          __html: t("section8.para1", {
            emailLink: `<a href="mailto:${t("contactEmail")}" class="${linkClassname}">${t("contactEmail")}</a>`, // Assuming email is in global or this namespace
            privacyPolicyLink: `<a href="/${locale}/politiques-de-confidentialites" class="${linkClassname}">${t(
              "section8.privacyPolicyLinkText"
            )}</a>`,
          }),
        }}
      />
    </div>
  );
}
