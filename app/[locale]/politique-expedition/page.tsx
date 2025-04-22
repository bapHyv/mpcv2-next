import type { Metadata } from "next";
import ShippingCalendar from "@/app/components/ShippingCalendar";
import { linkClassname } from "@/app/staticData/cartPageClasses";
import { getTranslations } from "next-intl/server";

interface GenerateMetadataParams {
  params: { locale: string };
}

export async function generateMetadata({ params }: GenerateMetadataParams): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "" });
  const siteBaseUrl = process.env.MAIN_URL || "https://www.monplancbd.fr";

  const title = t("metadataShippingPolicy.title");
  const description = t("metadataShippingPolicy.description");
  const keywords = t("metadataShippingPolicy.keywords")
    .split(",")
    .map((k) => k.trim());

  return {
    title: title,
    description: description,
    keywords: keywords,
    alternates: {
      canonical: `${siteBaseUrl}/${locale}/politique-expedition`,
      languages: {
        "fr-FR": `${siteBaseUrl}/fr/politique-expedition`,
        "en-US": `${siteBaseUrl}/en/politique-expedition`,
        "es-ES": `${siteBaseUrl}/es/politique-expedition`,
        "x-default": `${siteBaseUrl}/fr/politique-expedition`,
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
      url: `${siteBaseUrl}/${locale}/politique-expedition`,
      siteName: t("global.brandName"),
      images: [
        {
          url: `${siteBaseUrl}/og-image-default.png`,
          width: 1200,
          height: 630,
          alt: t("metadataShippingPolicy.ogImageAlt"),
        },
      ],
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

export default async function Page({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "shippingPolicy" });

  return (
    <div className="utility-page">
      <h1>{t("pageTitle")}</h1>
      <p className="text-sm text-gray-500 mb-6">{t("lastUpdated", { updateDate: "19/04/2025" })}</p>
      {/* Introduction */}
      <p>{t("introduction.para1")}</p>
      {/* Order Processing Time */}
      <h2>{t("processing.title")}</h2>
      <p>{t("processing.para1")}</p>
      {/* Component for Shipping Calendar */}
      <p>{t("processing.para2")}</p>
      <div className="my-6 flex justify-center">
        <ShippingCalendar />
      </div>
      {/* Shipping Methods */}
      <h2>{t("methods.title")}</h2>
      <p>{t("methods.para1", { carrier: "Chronopost" })}</p>
      {/* Optional: Add details about other methods if applicable (e.g., Relay Points) */}
      {/* <p>{t("methods.para2_relay")}</p> */}
      {/* Shipping Costs & Free Shipping Thresholds */}
      <h2>{t("costs.title")}</h2>
      <p>{t("costs.para1")}</p>
      {/* Detailed costs per zone */}
      <div>
        <h3>{t("costs.france.zoneName")}</h3>
        <p>{t("costs.france.thresholdMet", { amount: 40 })}</p>
        <p>{t("costs.france.thresholdNotMet", { amount: 40, cost: 8 })}</p>
      </div>
      <div className="mt-4">
        <h3>{t("costs.belgium.zoneName")}</h3>
        <p>{t("costs.belgium.thresholdMet", { amount: 65 })}</p>
        <p>{t("costs.belgium.thresholdNotMet", { amount: 65, cost: 8 })}</p>
      </div>
      <div className="mt-4">
        <h3>{t("costs.reunion.zoneName")}</h3>
        <p>{t("costs.reunion.thresholdMet", { amount: 80 })}</p>
        <p>{t("costs.reunion.thresholdNotMet", { amount: 80, cost: 10 })}</p>
      </div>
      <div className="mt-4">
        <h3>{t("costs.spain.zoneName")}</h3>
        <p>{t("costs.spain.thresholdMet", { amount: 80 })}</p>
        <p>{t("costs.spain.thresholdNotMet", { amount: 80, cost: 10 })}</p>
      </div>
      <div className="mt-4">
        <h3>{t("costs.ireland.zoneName")}</h3>
        <p>{t("costs.ireland.thresholdMet", { amount: 80 })}</p>
        <p>{t("costs.ireland.thresholdNotMet", { amount: 80, cost: 10 })}</p>
      </div>
      {/* Note: A table might be a clearer way to present this visually later */}
      {/* Estimated Delivery Times */}
      <h2>{t("deliveryTimes.title")}</h2>
      <p>{t("deliveryTimes.para1")}</p>
      <p>{t("deliveryTimes.para2", { maxDays: 30 })}</p>
      {/* TODO: Add typical estimated times per country if available */}
      <p>{t("deliveryTimes.para3_france_estimate", { days: "1-3" })}</p>
      {/* Order Tracking */}
      <h2>{t("tracking.title")}</h2>
      <p>{t("tracking.para1")}</p>
      {/* Receiving Your Order */}
      <h2>{t("reception.title")}</h2>
      <p>{t("reception.para1")}</p>
      <p>{t("reception.para2")}</p>
      <p>
        <strong>{t("reception.para3_checkPackage")}</strong>
      </p>
      {/* Delivery Issues */}
      <h2>{t("deliveryIssues.title")}</h2>
      <p>
        <strong>{t("deliveryIssues.riskTransfer.label")}</strong> {t("deliveryIssues.riskTransfer.text")}
      </p>
      <p>
        <strong>{t("deliveryIssues.damage.label")}</strong> {t("deliveryIssues.damage.text", { days: 3 })}
      </p>
      <div className="mt-4 p-4 border-l-4 border-red-400 bg-red-50">
        {" "}
        {/* Highlighted box */}
        <p>
          <strong>{t("deliveryIssues.nonReceipt.importantNote")}</strong>
        </p>
        <p>{t("deliveryIssues.nonReceipt.policy")}</p>
      </div>
      {/* International Shipping (Placeholder) */}

      <h2>{t("international.title")}</h2>
      <p>{t("international.para1_customs")}</p>

      {/* Returns (Brief Mention / Link) */}
      <h2 id="return-policy">{t("returns.title")}</h2>
      <p
        dangerouslySetInnerHTML={{
          __html: t("returns.para1_withdrawal", {
            days: 14,
            gtcLink: `<a href="/${locale}/conditions-generales-de-vente" class="${linkClassname}">${t("returns.gtcLinkText")}</a>`,
          }),
        }}
      />
      {/* Optional: Link to a dedicated return policy page if it exists */}
      {/* <p dangerouslySetInnerHTML={{
          __html: t("returns.para2_policyLink", {
              returnPolicyLink: `<a href="/${locale}/politique-de-retour" class="${linkClassname}">${t("returns.returnPolicyLinkText")}</a>`
          })
       }}/> */}
      {/* Contact Information */}
      <h2>{t("contact.title")}</h2>
      <p
        dangerouslySetInnerHTML={{
          __html: t("contact.para1", {
            emailLink: `<a href="mailto:${t("contact.emailAddress")}" class="${linkClassname}">${t("contact.emailAddress")}</a>`,
            phone: t("contact.phoneNumber"),
          }),
        }}
      />
    </div>
  );
}
