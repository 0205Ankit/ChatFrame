import EmptyProfilePhoto from "@/components/empty-profile-photo";
import ProfilePhoto from "@/components/profile-photo";
import { api } from "@/trpc/server";
import React from "react";

const ProfileHeader = async () => {
  const user = await api.user.get.query();

  return (
    <div>
      <div className="h-32 w-32 overflow-hidden rounded-full">
        {user?.profilePhoto ? (
          <ProfilePhoto
            image={user?.profilePhoto || "/empty-profile-photo.jpeg"}
            className="h-full w-full"
          />
        ) : (
          <EmptyProfilePhoto className="h-full w-full" />
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
