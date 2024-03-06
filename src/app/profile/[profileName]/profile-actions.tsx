"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import React from "react";

const ProfileActions = ({ userId }: { userId: string }) => {
  const [isFollowing, setIsFollowing] = React.useState(false);
  const router = useRouter();
  const { mutate: follow } = api.user.followUser.useMutation({
    onMutate: () => {
      setIsFollowing(true);
    },
  });
  const { mutate: unfollow } = api.user.unfollowUser.useMutation({
    onMutate: () => {
      setIsFollowing(false);
    },
  });
  const { mutate: sendMessage } = api.chat.createChat.useMutation({
    onSuccess: (data) => {
      router.push(`/direct/inbox/${data.id}`);
    },
  });
  api.user.isFollowingUser.useQuery(
    {
      targetUserId: userId,
    },
    {
      onSuccess: (data) => {
        setIsFollowing(data);
      },
    },
  );

  const sendMessageHandler = () => {
    sendMessage({ type: "ONE_TO_ONE", participantId: [userId] });
  };

  return (
    <div className="ml-2 flex items-center gap-2">
      {isFollowing ? (
        <Button
          onClick={() => unfollow({ targetUserId: userId })}
          variant={"outline"}
          className="px-5"
          size={"sm"}
        >
          Unfollow
        </Button>
      ) : (
        <Button
          onClick={() => follow({ targetUserId: userId })}
          className="px-5"
          size={"sm"}
        >
          Follow
        </Button>
      )}
      <Button
        onClick={sendMessageHandler}
        className="px-5"
        size={"sm"}
        variant={"outline"}
      >
        Message
      </Button>
    </div>
  );
};

export default ProfileActions;
