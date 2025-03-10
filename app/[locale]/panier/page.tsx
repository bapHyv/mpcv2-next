import DisplayComponents from "@/app/components/cartPage/DisplayComponents";
import Title from "@/app/components/Title";

export default async function Page() {
  return (
    <>
      <Title
        title="Panier"
        type="h1"
        classname={`relative mt-4 sm:mt-8 2xl:pl-2 uppercase text-xl text-green font-bold tracking-widest`}
        firstLetterClassname="text-4xl"
      />
      <DisplayComponents />
    </>
  );
}
