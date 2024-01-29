"use client";
import React from "react";
import { api } from "@/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CaptionFormattedText = ({ caption }: { caption: string }) => {
  const { data } = api.user.get.useQuery();
  return (
    <div className="flex-start flex gap-3">
      <Avatar className="h-7 w-7">
        <AvatarImage src={data?.profilePhoto ?? "/empty-profile-photo.jpeg"} />
        <AvatarFallback>CF</AvatarFallback>
      </Avatar>
      <pre className="w-[400px] font-sans text-sm">
        <span className="pr-3 font-semibold">{data?.userName}</span>
        {caption}
      </pre>
    </div>
  );
};

export default CaptionFormattedText;
