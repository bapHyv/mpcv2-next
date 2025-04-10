import { twMerge } from "tailwind-merge";

export default function Separator({ classname }: { classname?: string }) {
  return (
    <div className="flex items-center justify-center">
      <div className={twMerge("bg-neutral-200 h-[1px] mt-4 w-full", classname)}></div>
    </div>
  );
}
