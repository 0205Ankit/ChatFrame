import EmptyProfilePhoto from "@/components/empty-profile-photo";
import { api } from "@/trpc/server";
import Image from "next/image";
import React from "react";

const ProfileHeader = async () => {
  const user = await api.user.get.query();
  
  return (
    <div>
      <div className="h-32 w-32 overflow-hidden rounded-full">
        {user?.profilePhoto ? (
          <Image
            src={user?.profilePhoto}
            alt="profile"
            width={100}
            height={100}
            className="h-full w-full object-cover"
          />
        ) : (
          <EmptyProfilePhoto className="h-full w-full" />
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
