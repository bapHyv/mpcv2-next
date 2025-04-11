"use client";

import { Tab, TabList } from "@headlessui/react";
import Image from "next/image";
import clsx from "clsx";
import { Product } from "@/app/types/productsTypes";

interface ProductImageGalleryProps {
  images: Product["images"];
}

export default function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const allImages = images.main ? [images.main, ...images.others] : images.others;

  return (
    <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
      <TabList className="grid grid-cols-4 gap-4 sm:gap-6">
        {allImages.map((image) => (
          <Tab
            key={`${image.alt}-${image.url}`}
            className={({ selected }) =>
              clsx(
                "relative flex h-20 sm:h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900",
                "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green",
                selected ? "ring-2 ring-green ring-offset-1" : "ring-1 ring-inset ring-gray-300"
              )
            }
          >
            <span className="sr-only">{image.alt}</span>
            <span className="absolute inset-0 overflow-hidden rounded-md">
              <Image
                fill
                sizes="(max-width: 640px) 25vw, 10vw"
                alt={image.alt}
                src={`https://www.monplancbd.fr/wp-content/uploads/${image.url}`}
                className="h-full w-full object-cover object-center"
                priority={image.url === images.main?.url}
              />
            </span>
            <span
              aria-hidden="true"
              className={clsx(
                "pointer-events-none absolute inset-0 rounded-md",
                "ring-1 ring-transparent ui-selected:ring-2 ui-selected:ring-green ui-selected:ring-offset-0"
              )}
            />
          </Tab>
        ))}
      </TabList>
    </div>
  );
}
