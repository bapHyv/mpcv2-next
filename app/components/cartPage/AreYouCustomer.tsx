"use client";

import { useAuth } from "@/app/context/authContext";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface Props {
  redirect: string;
  classname?: string;
}

export default function AreYouCustomer({ redirect, classname }: Props) {
  const { userData } = useAuth();

  return userData ? null : (
    <section className={twMerge("text-sm", "mt-2 p-3 sm:p-4 lg:col-span-5 lg:mt-4", classname)}>
      Vous etes client chez nous?{" "}
      <Link href={{ pathname: "/connexion", query: { redirect } }} className="underline text-green">
        Connectez-vous
      </Link>
    </section>
  );
}
