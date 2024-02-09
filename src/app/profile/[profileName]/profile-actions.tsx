import { Button } from "@/components/ui/button";
import React from "react";

const ProfileActions = () => {
  return (
    <div className="ml-2 flex items-center gap-2">
      {true ? (
        <Button className="px-5" size={"sm"}>
          Follow
        </Button>
      ) : (
        <Button variant={"outline"} className="px-5" size={"sm"}>
          Unfollow
        </Button>
      )}
      <Button className="px-5" size={"sm"} variant={"outline"}>
        Message
      </Button>
    </div>
  );
};

export default ProfileActions;
