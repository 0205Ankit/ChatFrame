import EmptyProfilePhoto from "@/components/empty-profile-photo";
import ProfilePhoto from "@/components/profile-photo";
import { api } from "@/trpc/server";
import React from "react";
import EditProfile from "./edit-profile";
import ProfileActions from "./profile-actions";

const ProfileHeader = async ({
  profileName,
  isUserLoggedIn,
}: {
  profileName: string;
  isUserLoggedIn: boolean;
}) => {
  const user = await api.user.getByUserName.query({ profileName });

  return (
    <div className="mx-auto mt-8 flex w-10/12 items-center gap-10">
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
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl">{profileName}</h1>
          {isUserLoggedIn ? (
            <EditProfile
              profileName={profileName}
              userImage={user?.profilePhoto ?? "/empty-profile-photo.jpeg"}
            />
          ) : (
            <ProfileActions />
          )}
        </div>
        <div className="flex items-center gap-6">
          <p className="font-medium">
            <span className="font-bold">{user?.posts?.length ?? 0}</span> posts
          </p>
          <p className="font-medium">
            <span className="font-bold">{user?.followedBy?.length ?? 0}</span>{" "}
            followers
          </p>
          <p className="font-medium">
            <span className="font-bold">{user?.following?.length ?? 0}</span>{" "}
            following
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
