import { twMerge } from "tailwind-merge";

export default function Paragraph({
  p,
  classname,
}: {
  p: string;
  classname?: string;
}) {
  return <p className={twMerge(classname)}>{p}</p>;
}
