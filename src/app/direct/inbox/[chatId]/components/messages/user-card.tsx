"use client";
import { MultipleUserPhoto } from "Frontend/src/components/multiple-user-photo";
import { buttonVariants } from "Frontend/src/components/ui/button";
import { cn } from "Frontend/src/lib/utils";
import { type User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const UserCard = ({
  userName,
  profilePhoto,
  isGroupChat,
  allParticipants,
  chatName,
}: {
  userName: string;
  profilePhoto: string;
  isGroupChat?: boolean;
  chatName?: string;
  allParticipants: { userId: string; user: User }[]; /// TODO: import actual types
}) => {
  const { data } = useSession();

  const allParticipantsPhotos = allParticipants.map(
    (participant) =>
      participant.user.profilePhoto ?? "/empty-profile-photo.jpeg",
  );

  if (isGroupChat) {
    return (
      <div className="mb-10 mt-5 flex flex-col items-center">
        <MultipleUserPhoto userImages={allParticipantsPhotos} imgSize={80} />
        {chatName ? (
          <p className="my-3 w-[200px] truncate text-center text-xl font-semibold">
            {chatName}
          </p>
        ) : (
          <p className="my-3 w-[200px] truncate text-center text-xl font-semibold">
            {allParticipants
              .filter((participant) => participant.userId !== data?.user?.id)
              .map((participant) => participant.user.userName ?? "User")
              .join(", ")}
          </p>
        )}
      </div>
    );
  }

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
