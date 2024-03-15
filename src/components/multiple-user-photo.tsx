import { cn } from "Frontend/src/lib/utils";
import Image from "next/image";

type PropType = React.HTMLAttributes<HTMLDivElement> & {
  userImages: string[];
  imgSize?: number;
  isIcon?: boolean;
};

export const MultipleUserPhoto = ({
  userImages,
  imgSize = 50,
  isIcon,
}: PropType) => {
  if (isIcon) {
    return (
      <div
        style={{ height: `${imgSize}px`, width: `${imgSize}px` }}
        className="relative"
      >
        {userImages[0] && (
          <Image
            src={userImages[0]}
            alt="profile"
            width={50}
            height={50}
            className={cn(
              "absolute left-0 top-0 z-10 h-4/6 w-4/6 rounded-full border-2 border-white object-cover",
              {
                "h-full w-full": !userImages[1],
              },
            )}
          />
        )}
        {userImages[1] && (
          <Image
            src={userImages[1]}
            alt="profile"
            width={50}
            height={50}
            className="absolute bottom-0 right-0 h-5/6 w-5/6 rounded-full border-2 border-white object-cover"
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      {userImages[0] && (
        <Image
          src={userImages[0]}
          style={{ height: `${imgSize}px`, width: `${imgSize}px` }}
          alt="profile"
          width={50}
          height={50}
          className="rounded-full border-2 border-white object-cover"
        />
      )}
      {userImages[1] && (
        <Image
          src={userImages[1]}
          alt="profile"
          style={{ height: `${imgSize}px`, width: `${imgSize}px` }}
          width={50}
          height={50}
          className="-translate-x-3 rounded-full border-2 border-white object-cover"
        />
      )}
      {userImages[2] && (
        <div
          className="relative -translate-x-6 overflow-hidden rounded-full border-2 border-white"
          style={{ height: `${imgSize}px`, width: `${imgSize}px` }}
        >
          <Image
            src={userImages[2]}
            alt="profile"
            width={50}
            height={50}
            className="h-full w-full rounded-full object-cover"
          />
          <div
            className={cn(
              "absolute right-0 top-0 flex h-full w-full items-center justify-center bg-black/40 text-2xl font-semibold text-white",
              {
                "text-base": imgSize < 50,
              },
            )}
          >
            {userImages.length - 2}
          </div>
        </div>
      )}
    </div>
  );
};
