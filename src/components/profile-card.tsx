import React from "react";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import Image from "next/image";

type PropType = React.HTMLAttributes<HTMLImageElement> & {
  imageSize?: number;
  userImage?: string | null;
  userName?: string | null;
};

const ProfileCard = ({
  className,
  imageSize,
  userImage,
  userName,
}: PropType) => {
  const { data, isLoading } = api.user.get.useQuery();
  return (
    <>
      {isLoading ? (
        <div className="flex items-center gap-1">
          <div
            style={{
              height: `${imageSize ?? 30}px`,
              width: `${imageSize ?? 30}px`,
            }}
            className="animate-pulse rounded-full bg-slate-200"
          />
          <div className="flex flex-col">
            <h1 className="mb-1 w-20 animate-pulse rounded-sm bg-slate-200 py-1"></h1>
            <h1 className="w-10 animate-pulse rounded-sm bg-slate-200 py-1"></h1>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Image
            src={userImage ?? data?.profilePhoto ?? "/empty-profile-photo.jpeg"}
            alt="profile"
            width={100}
            height={100}
            style={{
              height: `${imageSize ?? 30}px`,
              width: `${imageSize ?? 30}px`,
            }}
            className="rounded-full object-cover"
          />
          <h1 className={cn({ className })}>
            {userName ?? data?.userName ?? "user"}
          </h1>
        </div>
      )}
    </>
  );
};

export default ProfileCard;
