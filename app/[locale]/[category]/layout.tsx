import AccountHeader from "@/app/components/AccountHeader";
import { getTranslations } from "next-intl/server";
import { categories as ICategories } from "@/app/types/productsTypes";
import OtherNavbar from "@/app/components/OtherNavbar";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

async function getCategories(locale: string): Promise<ICategories> {
  const t = await getTranslations({ locale, namespace: "category" });
  return [
    { url: "fleurs%20de%20cbd", urlTitle: `🌿 ${t("flower")}`, category: "fleurs", title: t("flower"), slug: "fleurs-cbd" },
    { url: "hash%20de%20cbd", urlTitle: `🍫 ${t("hash")}`, category: "hashs", title: t("hash"), slug: "pollens-resines-hash-cbd" },
    { url: "moonrocks", urlTitle: `🌠 ${t("moonrock")}`, category: "moonrocks", title: t("moonrock"), slug: "moonrocks-cbd" },
    { url: "huiles", urlTitle: `💧 ${t("oil")}`, category: "huiles", title: t("oil"), slug: "huiles-cbd" },
    { url: "infusions", urlTitle: `🌱 ${t("herbalTea")}`, category: "infusions", title: t("herbalTea"), slug: "infusions-cbd" },
    { url: "soins", urlTitle: `🌿 ${t("health")}`, category: "soins", title: t("health"), slug: "soins-cbd" },
    { url: "vaporisateurs", urlTitle: `💨 ${t("vaporizer")}`, category: "vaporisateurs", title: t("vaporizer"), slug: "vaporisateur" },
  ];
}

const AccountLayout = async ({
  children,
  params: { locale, category },
}: Readonly<{ children: React.ReactNode; params: { locale: string; category: string } }>) => {
  const categories = await getCategories(locale);
  return (
    <>
      <OtherNavbar className="xl:justify-center animate-slide-in-bottom md:animate-slide-in-top">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/${locale}/${cat.slug}`}
            className={twMerge(
              "capitalize text-center text-sm py-1 px-3 mx-1 rounded-md text-nowrap whitespace-nowrap",

              "transition-colors duration-150 ease-in-out",
              "hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white",
              category === cat.slug ? "font-medium text-green bg-white/10 ring-1 ring-green/50" : "text-white"
            )}
          >
            {cat.urlTitle}
          </Link>
        ))}
      </OtherNavbar>
      {children}
    </>
  );
};

export default AccountLayout;
