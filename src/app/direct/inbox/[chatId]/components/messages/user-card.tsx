"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const UserCard = ({
  userName,
  profilePhoto,
}: {
  userName: string;
  profilePhoto: string;
}) => {
  return (
    <div className="mb-10 mt-5 flex flex-col items-center">
      <Image
        src={profilePhoto}
        alt="profile photo"
        width={50}
        height={50}
        className="h-28 w-28 rounded-full object-cover"
      />
      <h2 className="my-3 text-xl font-semibold">{userName}</h2>
      <Link
        href={`/profile/${userName}`}
        className={cn(buttonVariants(), "rounded-xl px-5 py-1")}
      >
        View Profile
      </Link>
    </div>
  );
};

export default UserCard;
