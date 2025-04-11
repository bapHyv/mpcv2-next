"use client";

import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useAuth } from "@/app/context/authContext";
import { subtleSectionWrapperClassname } from "@/app/staticData/cartPageClasses";

interface Props {
  redirect: string;
  classname?: string;
}

export default function AreYouCustomer({ redirect, classname }: Props) {
  const { userData } = useAuth();

  if (userData) return null;

  return (
    <section className={twMerge(subtleSectionWrapperClassname, "text-sm", classname)}>
      Vous êtes client chez nous?{" "}
      <Link href={{ pathname: "/connexion", query: { redirect } }} className="underline text-green font-medium hover:text-dark-green">
        Connectez-vous
      </Link>{" "}
      pour retrouver vos avantages.
    </section>
  );
}
