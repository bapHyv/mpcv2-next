import Image from "next/image";

export async function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }, { locale: "es" }];
}
interface Params {
  locale: string;
}
export default function Page({ params }: { params: Params }) {
  const { locale } = params;
  return <div className="city-page"></div>;
}
