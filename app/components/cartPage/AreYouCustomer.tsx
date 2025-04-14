"use client";

import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useAuth } from "@/app/context/authContext";
import { useTranslations } from "next-intl";
import { subtleSectionWrapperClassname, linkClassname } from "@/app/staticData/cartPageClasses";

interface Props {
  redirect: string;
  classname?: string;
}

export default function AreYouCustomer({ redirect, classname }: Props) {
  const t = useTranslations("areYouCustomer");
  const { userData } = useAuth();

  if (userData) return null;

  return (
    <section className={twMerge(subtleSectionWrapperClassname, "text-sm text-center sm:text-left", classname)}>
      {t("promptText")}{" "}
      <Link href={{ pathname: "/connexion", query: { redirect } }} className={twMerge(linkClassname, "font-medium")}>
        {t("loginLinkText")}
      </Link>{" "}
      {t("suffixText")}
    </section>
  );
}
