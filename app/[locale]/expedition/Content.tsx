"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
import { useEffect, useRef, useState, FormEvent } from "react";
import clsx from "clsx";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { twMerge } from "tailwind-merge";
import { useLocale, useTranslations } from "next-intl";

import Form from "@/app/components/shippingPage/Form";
import Total from "@/app/components/shippingPage/Total";
import OrderSummary from "@/app/components/shippingPage/OrderSummary";
import Shipping from "@/app/components/shippingPage/Shipping";
import AreYouCustomer from "@/app/components/cartPage/AreYouCustomer";
import Title from "@/app/components/Title";
import { useOrder } from "@/app/context/orderContext";
import { useAlerts } from "@/app/context/alertsContext";
import { isUserDataAPIResponse } from "@/app/utils/typeGuardsFunctions";
import { useAuth } from "@/app/context/authContext";
import { buttonClassname } from "@/app/staticData/cartPageClasses";
import { UserDataAPIResponse } from "@/app/types/profileTypes";

interface AuthError {
  message: string;
  status: number;
}

export default function DisplayComponents() {
  const [isPending, setIsPending] = useState(false);
  const [authError, setAuthError] = useState<null | AuthError>(null);
  const form = useRef<HTMLFormElement>(null);

  const { order } = useOrder();
  const router = useRouter();
  const { addAlert } = useAlerts();
  const { userData, setUserData, referralToken } = useAuth();
  const t = useTranslations("");
  const locale = useLocale();

  const handleAction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.current) return;

    // If the user is already logged in, just proceed to payment.
    if (userData) {
      router.push("/paiement");
      return;
    }

    // --- Guest Checkout / Registration Logic ---
    setAuthError(null);
    setIsPending(true);
    try {
      const formData = new FormData(form.current);

      const loginPayload = {
        username: order.shippingAddress.email,
        password: order.password,
      };

      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginPayload),
      });

      if (loginResponse.status === 404) {
        // Construct the payload for our API route
        const payload = {
          mail: order.shippingAddress.email,
          password: order.password,
          firstname: order.shippingAddress.firstname,
          lastname: order.shippingAddress.lastname,
          optInMarketing: !!formData.get("optInMarketing"),
          referralToken,
          shippingAddress: order.shippingAddress,
          billingAddress: order.billingAddress,
          isDifferentBilling: order["different-billing"],
        };

        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const responseData = await response.json();

        if (!response.ok) {
          let textKey = "alerts.accountCreation.defaultError.text";
          let titleKey = "alerts.accountCreation.title";
          let color: "blue" | "red" | "yellow" = "red";

          if (response.status === 409) {
            textKey = "alerts.accountCreation.error409.text";
            titleKey = "alerts.accountCreation.error409.title";
            color = "blue";
            setTimeout(() => router.push(`/connexion?redirect=paiement&mail=${encodeURIComponent(order.shippingAddress.email)}`), 500);
          } else {
            textKey = responseData.message || "alerts.accountCreation.defaultError.text";
            titleKey = "alerts.accountCreation.defaultError.title";
            color = "red";
          }
          setIsPending(false);
          addAlert(uuid(), t(textKey), t(titleKey), color);
          return;
        }

        if (isUserDataAPIResponse(responseData)) {
          if (!Array.isArray(responseData.addresses)) {
            responseData.addresses = [];
          }
          setUserData(responseData);
          addAlert(uuid(), t("alerts.accountCreation.success200.text"), t("alerts.accountCreation.success200.title"), "emerald");
          router.push("/paiement");
        }
        return;
      }

      if (loginResponse.status === 409) {
        let titleKey = "alerts.signIn.defaultError.title";
        let textKey = "alerts.signIn.defaultError.text";
        let color: "red" = "red";
        setAuthError({ status: 409, message: t(textKey) });
        setIsPending(false);
        addAlert(uuid(), textKey.startsWith("alerts.") ? t(textKey) : textKey, t(titleKey), color);
        return;
      }

      if (loginResponse.status === 401) {
        let titleKey = "alerts.signIn.error401.title";
        let textKey = "alerts.signIn.error401.text";
        let color: "yellow" = "yellow";
        setAuthError({ status: 401, message: t(textKey) });
        setIsPending(false);
        addAlert(uuid(), textKey.startsWith("alerts.") ? t(textKey) : textKey, t(titleKey), color);
        return;
      }

      const userData: UserDataAPIResponse = await loginResponse.json();
      if (!Array.isArray(userData.addresses)) {
        userData.addresses = [];
      }

      setUserData(userData);
      addAlert(uuid(), t("alerts.signIn.success200.text"), t("alerts.signIn.success200.title"), "emerald");
      router.push("/paiement");
      router.refresh();
    } catch (error) {
      console.error("Error during guest checkout registration:", error);
      addAlert(uuid(), t("alerts.accountCreation.genericError.text"), t("alerts.accountCreation.genericError.title"), "red");
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Title
        title={t("shippingPage.h1")}
        type="h1"
        classname={`relative mb-6 text-center uppercase text-xl text-green font-bold tracking-widest`}
        firstLetterClassname="text-4xl"
      />

      <div className="mb-6">
        <Link
          href={`/${locale}/panier`}
          className={twMerge(clsx(buttonClassname, "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50", "px-3 py-1.5 text-sm"))}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1.5" aria-hidden="true" />
          {t("shippingPage.backToCartButton")}
        </Link>
      </div>

      <AreYouCustomer redirect="expedition" />

      <form ref={form} onSubmit={handleAction} className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-8 xl:gap-x-12 mt-6">
        <div className="lg:col-span-7 space-y-6">
          <Form authError={authError} />
        </div>
        <div className="lg:col-span-5 mt-8 lg:mt-0 space-y-6">
          <OrderSummary />
          <Shipping />
          <Total isPending={isPending} />
        </div>
      </form>
    </div>
  );
}
