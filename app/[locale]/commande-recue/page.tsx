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

  const isSuccess = decodedToken.status === "success" || decodedToken.status === "fraud_warning" || decodedToken.payment === "bankTransfer";

  const titleKey = isSuccess ? "pageTitleSuccess" : "pageTitleFailed";
  const titleColorClass = isSuccess ? "text-green" : "text-red-600";

  const contentProps = {
    locale: locale,
    searchParams: {
      orderId: String(decodedToken.orderId),
      payment: decodedToken.payment,
      status: decodedToken.status as TempStatus | undefined,
      failure_reason,
    },
  };

  return (
    <>
      <Title
        title={t(titleKey)}
        type="h1"
        classname={twMerge(titleClassname, "mt-10 md:mt-14 text-center", titleColorClass)}
        firstLetterClassname="text-xl"
      />

      <Content {...contentProps} />
    </>
  );
}
