import DisplayComponents from "@/app/components/orderPage/DisplayComponents";
import ParcelPointMapComponent from "@/app/components/orderPage/ParcelPointMapComponent";
import Title from "@/app/components/Title";

export default function Page() {
  return (
    <>
      <Title
        title="Validation de la commande"
        type="h1"
        classname={`relative mt-4 sm:mt-8 2xl:pl-2 uppercase text-xl text-green font-bold tracking-widest`}
        firstLetterClassname="text-4xl"
      />
      <DisplayComponents />
    </>
  );
}
