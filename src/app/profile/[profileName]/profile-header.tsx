import EmptyProfilePhoto from "@/components/empty-profile-photo";
import ProfilePhoto from "@/components/profile-photo";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import React from "react";
import { IoIosSettings } from "react-icons/io";

const ProfileHeader = async ({ profileName }: { profileName: string }) => {
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
          <h1 className="mr-5 text-2xl">{profileName}</h1>
          <Button size={"sm"} className="px-5">
            Edit Profile
          </Button>
          <Button size={"sm"}>
            <IoIosSettings className="text-2xl" />
          </Button>
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
