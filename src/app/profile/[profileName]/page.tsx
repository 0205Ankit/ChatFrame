import React from "react";
import ProfileHeader from "./profile-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LuGrid, LuBookmark } from "react-icons/lu";
import { Separator } from "@/components/ui/separator";
import AllUserPosts from "./all-user-posts";
import SavedPosts from "./saved-posts";

const tabsTriggerStyle =
  "rounded-none px-2 data-[state=active]:border-t-2 data-[state=active]:border-primary data-[state=active]:shadow-none";

const ProfilePage = ({ params }: { params: { profileName: string } }) => {
  const { profileName } = params;
  return (
    <div>
      <ProfileHeader profileName={profileName} />
      <Separator className="mt-20" />
      <div className="mb-20 flex justify-center">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="h-fit w-full gap-10 bg-transparent p-0">
            <TabsTrigger value="posts" className={tabsTriggerStyle}>
              <LuGrid className="mr-1" /> Posts
            </TabsTrigger>
            <TabsTrigger value="saved" className={tabsTriggerStyle}>
              <LuBookmark className="mr-1" /> Saved
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="w-full">
            <AllUserPosts />
          </TabsContent>
          <TabsContent value="saved" className="w-full">
            <SavedPosts />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
