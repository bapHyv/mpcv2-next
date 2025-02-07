import Image from "next/image";
interface Params {
  locale: string;
}
export default function Page({ params }: { params: Params }) {
  const { locale } = params;
  return <div className="city-page"></div>;
}
