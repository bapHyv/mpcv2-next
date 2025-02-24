"use client";

import { useAuth } from "@/app/context/authContext";
import Link from "next/link";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

export default function AreYouCustomer() {
  const { isSignedIn } = useAuth();

  return isSignedIn ? null : (
    <section className={twMerge("text-sm", "mt-2 rounded-lg bg-neutral-100 p-3 sm:p-4 lg:col-span-5 lg:mt-4")}>
      Vous etes client chez nous?{" "}
      <Link href={{ pathname: "/connexion", query: { redirect: "panier" } }} className="underline">
        Connectez-vous
      </Link>
    </section>
  );
}
