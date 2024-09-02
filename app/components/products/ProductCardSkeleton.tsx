import Separator from "../Separator";

export default function ProductCardSkeleton() {
  return (
    <div
      className={`col-span-12 md:col-span-6 xl:col-span-4 2xl:col-span-3 w-full
    transform text-left text-base transition my-4 p-2 pt-3 rounded-md 
    bg-neutral-100 dark:bg-light-black animate-pulse
    `}
    >
      {/* img */}
      <div className="w-[312px] h-[208px] bg-neutral-400 rounded-sm m-auto"></div>
      {/* name */}
      <div className="mt-8 h-[20px] bg-neutral-400 w-3/4"></div>
      {/* price from */}
      <div className="h-[16px] bg-neutral-400 mt-2 w-5/12"></div>
      {/* price */}
      <div className="h-[30px] bg-neutral-400 mt-3 w-3/12"></div>
      <Separator />
      {/* rating */}
      <div className="mt-4 bg-neutral-400 h-[24px] w-3/12"></div>
      {/* terpenes */}
      <div className="h-[24px] bg-neutral-400 mt-2 w-2/12"></div>
      {/* origin */}
      <div className="h-[24px] bg-neutral-400 mt-2 w-2/12"></div>
      {/* options name */}
      <div className="h-[24px] bg-neutral-400 mt-8 w-2/12"></div>
      {/* options */}
      <div className="mt-2 flex gap-2">
        <div className="h-10 w-10 bg-neutral-400 rounded-md"></div>
        <div className="h-10 w-10 bg-neutral-400 rounded-md"></div>
        <div className="h-10 w-10 bg-neutral-400 rounded-md"></div>
        <div className="h-10 w-10 bg-neutral-400 rounded-md"></div>
        <div className="h-10 w-10 bg-neutral-400 rounded-md"></div>
        <div className="h-10 w-10 bg-neutral-400 rounded-md"></div>
        <div className="h-10 w-10 bg-neutral-400 rounded-md"></div>
      </div>
      {/* add to cart button */}
      <div className="mt-8 h-[50px] bg-neutral-400 rounded-md"></div>
      {/* more info */}
      <div className="my-4 h-[24px] bg-neutral-400 w-6/12 m-auto"></div>
    </div>
  );
}
