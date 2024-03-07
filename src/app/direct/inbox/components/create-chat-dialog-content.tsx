import { MultipleUserPhoto } from "@/components/multiple-user-photo";
import { Button } from "@/components/ui/button";
import UserSearchInput from "@/components/user-search-input";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import { type User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CreateChatDialogContent = ({
  closeDialog,
}: {
  closeDialog: () => void;
}) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();
  const { data } = useSession();
  const router = useRouter();
  const utils = api.useUtils();

  const selectedUsersImages = selectedUsers
    ? selectedUsers.map(
        (user) => user.profilePhoto ?? "/empty-profile-photo.jpeg",
      )
    : [];

  useEffect(() => {
    if (selectedUser) {
      const isCurrentUser = selectedUser.id === data?.user.id;
      if (isCurrentUser) {
        toast({
          title: "Cannot select yourself",
          variant: "default",
        });
        return;
      }
      const userAlreadyExist = selectedUsers.find(
        (u) => u.id === selectedUser.id,
      );
      if (userAlreadyExist) {
        toast({
          title: "User already selected",
          variant: "default",
        });
        return;
      }
      setSelectedUsers((prev) => [...prev, selectedUser]);
      setSelectedUser(null);
    }
  }, [selectedUser, selectedUsers, toast, data?.user.id]);

  const { mutate: mutateMessage } = api.chat.createChat.useMutation({
    onSuccess: (data) => {
      void utils.chat.getChats.invalidate();
      closeDialog();
      setSelectedUsers([]);
      setSelectedUser(null);
      router.push(`/direct/inbox/${data.id}`);
    },
  });

  const sendMessageHandler = () => {
    mutateMessage({
      participantId: selectedUsers.map((user) => user.id),
      type: selectedUsers.length > 1 ? "GROUP" : "ONE_TO_ONE",
    });
  };

  return (
    <div className="relative flex min-h-80 flex-col">
      <h1 className="mb-3 text-center text-2xl font-semibold">New Message</h1>
      <div className="mb-10">
        <UserSearchInput selectedUser={setSelectedUser} />
      </div>
      <MultipleUserPhoto userImages={selectedUsersImages} imgSize={100} />
      <Button
        onClick={sendMessageHandler}
        disabled={selectedUsers.length === 0}
        className="absolute bottom-0 mt-5 w-full self-end"
      >
        Chat
      </Button>
    </div>
  );
};

export default CreateChatDialogContent;
