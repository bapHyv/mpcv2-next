import { twMerge } from "tailwind-merge";
import Title from "../Title";

interface Props {
  icon: JSX.Element;
  title: string;
  text: string;
  divClassname?: string;
  titleClassname?: string;
  titleFirstLetterClassname?: string;
  pClassname?: string;
}

export default function ServiceCard({ icon, title, text, divClassname, pClassname, titleClassname, titleFirstLetterClassname }: Props) {
  return (
    <div className={twMerge("flex flex-col items-center p-5 border-2 z-10 border-white w-full sm:w-1/3 lg:w-1/4", divClassname)}>
      {icon}
      <Title
        title={title}
        type="h3"
        classname={twMerge("relative mt-4 mb-6 uppercase text-lg text-center text-white font-bold tracking-widest", titleClassname)}
        firstLetterClassname={twMerge("text-2xl", titleFirstLetterClassname)}
      />
      <p className={twMerge("text-white text-center leading-8", pClassname)}>{text}</p>
    </div>
  );
}
