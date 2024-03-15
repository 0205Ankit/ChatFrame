"use client";
import React from "react";
import { api } from "Frontend/src/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "Frontend/src/components/ui/avatar";

const CaptionFormattedText = ({
  caption,
  userId,
}: {
  caption: string;
  userId: string;
}) => {
  const { data } = api.user.getByUserId.useQuery({ userId });
  return (
    <div className="flex-start flex gap-3">
      <Avatar className="h-7 w-7">
        <AvatarImage
          className="object-cover"
          src={data?.profilePhoto ?? "/empty-profile-photo.jpeg"}
        />
        <AvatarFallback>CF</AvatarFallback>
      </Avatar>
      <pre className="font-sans text-sm">
        <span className="pr-3 font-semibold">{data?.userName}</span>
        {caption}
      </pre>
    </div>
  );
};

export default CaptionFormattedText;
