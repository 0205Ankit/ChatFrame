import React from "react";
import ProfileHeader from "./profile-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LuGrid, LuBookmark } from "react-icons/lu";
import { Separator } from "@/components/ui/separator";
import AllUserPosts from "./all-posts";
import SavedPosts from "./saved-posts";
import { api } from "@/trpc/server";
import Link from "next/link";

const tabsTriggerStyle =
  "rounded-none px-2 data-[state=active]:border-t-2 data-[state=active]:border-primary data-[state=active]:shadow-none";

const ProfilePage = async ({ params }: { params: { profileName: string } }) => {
  const { profileName } = params;
  const user = await api.user.checkUserExistByUserName.query({
    profileName,
  });
  const isUserLoggedIn = await api.user.checkUserLoggedIn.query({
    profileName,
  });

  if (!user) {
    return (
      <div>
        <h1 className="mt-5 text-center text-3xl font-semibold">
          Sorry, this page isn&apos;t available.
        </h1>
        <p className="mt-5 text-center">
          The link you followed may be broken, or the page may have been
          removed. Go back to{" "}
          <Link href={"/"} className="font-semibold text-primary">
            Home page
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <ProfileHeader
        profileName={profileName}
        isUserLoggedIn={isUserLoggedIn}
        userId={user.id}
      />
      <Separator className="mt-20" />
      <div className="mb-20 flex justify-center">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="h-fit w-full gap-10 bg-transparent p-0">
            <TabsTrigger value="posts" className={tabsTriggerStyle}>
              <LuGrid className="mr-1" /> Posts
            </TabsTrigger>
            {isUserLoggedIn && (
              <TabsTrigger value="saved" className={tabsTriggerStyle}>
                <LuBookmark className="mr-1" /> Saved
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="posts" className="w-full">
            <AllUserPosts profileName={profileName} />
          </TabsContent>
          {isUserLoggedIn && (
            <TabsContent value="saved" className="w-full">
              <SavedPosts />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
