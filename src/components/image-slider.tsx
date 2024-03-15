"use client";
import React, { useCallback } from "react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "Frontend/src/components/ui/carousel";
import Image from "next/image";
import { cn } from "Frontend/src/lib/utils";
import likeAnimation from "../../public/animations/like-animation.json";
import Lottie from "lottie-react";

const LottieMemo = React.memo(Lottie);

const ImageSlider = ({
  images,
  imageClassName,
  sliderClassName,
  likePost,
  isLiked,
  isPostSlider,
}: {
  images: string[];
  imageClassName?: string;
  sliderClassName?: string;
  likePost?: () => void;
  isLiked?: boolean;
  isPostSlider?: boolean;
}) => {
  const [sliderApi, setSliderApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [showLikeAnimation, setShowLikeAnimation] = React.useState(false);

  React.useEffect(() => {
    if (!sliderApi) {
      return;
    }

    setCount(sliderApi.scrollSnapList().length);
    setCurrent(sliderApi.selectedScrollSnap() + 1);

    sliderApi.on("select", () => {
      setCurrent(sliderApi.selectedScrollSnap() + 1);
    });
  }, [sliderApi]);

  const likePostHandler = useCallback(() => {
    if (isPostSlider && likePost) {
      setShowLikeAnimation(true);
      if (isLiked) return;
      likePost();
    }
  }, [isLiked, likePost, isPostSlider]);

  return (
    <Carousel
      onDoubleClick={likePostHandler}
      className={cn("relative h-full", sliderClassName)}
      setApi={setSliderApi}
    >
      <CarouselContent className="">
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <Image
              src={image}
              alt="image"
              width={100}
              height={100}
              className={cn("h-full w-full object-cover", imageClassName)}
              unoptimized
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 && (
        <>
          <CarouselPrevious className="left-2" type="button" size={"sm"} />
          <CarouselNext className="right-2" type="button" size={"sm"} />
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
      {showLikeAnimation && (
        <div
          className={cn(
            "absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-[50%]",
          )}
        >
          <LottieMemo
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            animationData={JSON.parse(JSON.stringify(likeAnimation))}
            loop={false}
            onComplete={() => setShowLikeAnimation(false)}
          />
        </div>
      )}
    </Carousel>
  );
};

export default React.memo(ImageSlider, (prevProp, nextProp) => {
  return prevProp.isLiked === nextProp.isLiked;
});
