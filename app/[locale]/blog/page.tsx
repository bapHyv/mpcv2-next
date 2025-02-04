import data from "@/app/staticData/blog.json";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

interface Params {
  locale: string;
}

export default function Page({ params }: { params: Params }) {
  const { locale } = params;
  return (
    <>
      <h1 className="mt-4 xl:mt-6 text-center uppercase text-green text-3xl font-medium">Blog</h1>
      <div className="flex flex-wrap justify-center gap-2 my-4 px-2">
        {data.map((e, i) => (
          <Link
            key={`${e.alt}-${i}`}
            href={`/blog/${e.href}`}
            className={clsx(
              "w-full flex flex-col items-center gap-1 border border-neutral-300 rounded-md p-2 shadow-md",
              "sm:w-1/3",
              "lg:w-1/4",
              "xl:w-1/5"
            )}
          >
            <h2 className="text-center">{e.title}</h2>
            <div className="w-36 h-36">
              <Image src={e.src} alt={e.alt} width={144} height={144} className="rounded-full object-cover" />
            </div>
            <span className="text-xs text-neutral-400">Published: {e.published}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
