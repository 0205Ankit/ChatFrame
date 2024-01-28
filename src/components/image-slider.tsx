"use client";
import React from "react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ImageSlider = ({
  images,
  imageClassName,
  sliderClassName,
}: {
  images: string[];
  imageClassName?: string;
  sliderClassName?: string;
}) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Carousel className={cn("h-full", sliderClassName)} setApi={setApi}>
      <CarouselContent className="">
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <Image
              src={image}
              alt="image"
              width={100}
              height={100}
              className={cn(
                "aspect-square h-full w-full object-cover",
                imageClassName,
              )}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 && (
        <>
          <CarouselPrevious className="left-2" type="button" />
          <CarouselNext className="right-2" type="button" />
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-1">
            {Array(count)
              .fill(0)
              .map((_, index) => (
                <span
                  key={index}
                  className={cn("rounded-full bg-slate-200/30 p-1", {
                    "bg-slate-100": index + 1 === current,
                  })}
                ></span>
              ))}
          </div>
        </>
      )}
    </Carousel>
  );
};

export default ImageSlider;
