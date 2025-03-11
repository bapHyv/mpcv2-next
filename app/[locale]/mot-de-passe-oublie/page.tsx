import ForgotPasswordForm from "@/app/components/ForgotPasswordForm";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

interface Params {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params: { locale } }: Params) {
  const t = await getTranslations({ locale, namespace: "signIn" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function Page({ params: { locale } }: Params) {
  const t = await getTranslations({ locale, namespace: "signIn" });
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image alt="Logo monplancbd" width={40} height={40} src={`/canna-vert.png`} className="mx-auto h-10 w-auto" />
          <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-neutral-100">Mot de passe oublie</h1>
        </div>
        <p className="my-5 max-w-xl mx-auto italic text-neutral-500 text-center">
          Mot de passe perdu ? Veuillez saisir votre identifiant ou votre adresse e-mail. Vous recevrez un lien par e-mail pour créer un nouveau mot
          de passe.
        </p>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <ForgotPasswordForm />
        </div>
      </div>
    </>
  );
}
