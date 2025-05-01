import { getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";

import Title from "@/app/components/Title";
import Content from "./Content";
import { titleClassname } from "@/app/staticData/cartPageClasses";
import { Metadata } from "next/types";
import { DecodedPaymentToken, verifyPaymentToken } from "@/app/utils/auth";
import { redirect } from "next/navigation";

interface GenerateMetadataParams {
  params: { locale: string };
}

export async function generateMetadata({ params }: GenerateMetadataParams): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "orderReceived" });

  return {
    title: t("metadataTitle"),
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
        "max-video-preview": -1,
        "max-image-preview": "none",
        "max-snippet": -1,
      },
    },
  };
}

type TempStatus =
  | "processing"
  | "success"
  | "failed"
  | "fraud_refusal"
  | "fraud_warning"
  | "auth_failed"
  | "bank_refusal"
  | "max_attempts"
  | "technical_error"
  | "abandoned"
  | "unknown_failure"
  | "error";

interface CommandeRecueSearchParams {
  token: string;
  failure_reason?: string;
}

interface CommandeRecuePageProps {
  params: { locale: string };
  searchParams: CommandeRecueSearchParams;
}

export default async function Page({ params: { locale }, searchParams }: CommandeRecuePageProps) {
  const t = await getTranslations({ locale, namespace: "orderReceived" });

  const { token, failure_reason } = searchParams;
  const decodedToken: DecodedPaymentToken | null = verifyPaymentToken(token);

  if (!decodedToken) {
    console.warn(`Commande Recue Page (${locale}): Invalid, expired, or missing access token. Redirecting.`);
    redirect(`/${locale}`);
  }

  const contentProps = {
    locale: locale,
    // Construct the searchParams for the Content component, using verified token data
    // while preserving potentially useful original params like failure_reason.
    searchParams: {
      orderId: String(decodedToken.orderId), // Use verified orderId from token
      payment: decodedToken.payment, // Use verified payment type from token
      temp_status: decodedToken.status as TempStatus | undefined, // Use verified status from token (cast if necessary)
      failure_reason,
    },
  };

  return (
    <>
      <Title title={t("pageTitle")} type="h1" classname={twMerge(titleClassname, "md:mt-14 text-green text-center")} firstLetterClassname="text-xl" />

      <Content {...contentProps} />
    </>
  );
}
