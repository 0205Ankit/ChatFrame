import { MultipleUserPhoto } from "Frontend/src/components/multiple-user-photo";
import { Button } from "Frontend/src/components/ui/button";
import { Dialog, DialogContent } from "Frontend/src/components/ui/dialog";
import UserSearchInput from "Frontend/src/components/user-search-input";
import { useToast } from "Frontend/src/hooks/use-toast";
import { api } from "Frontend/src/trpc/react";
import { type User } from "@prisma/client";
import React, { useEffect, useState } from "react";

const AddUsersToChat = ({
  chatId,
  usersInChat,
}: {
  chatId: string;
  usersInChat: User[] | undefined;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const { toast } = useToast();
  const utils = api.useUtils();

  const { mutate: addParticipant, error } =
    api.chat.addParticipantToChat.useMutation({
      onSuccess: () => {
        void utils.chat.getChats.invalidate();
        void utils.chat.getChatsById.invalidate();
        setOpen(false);
        setSelectedUser(null);
        setSelectedUsers([]);
      },
    });

  const selectedUsersImages = selectedUsers
    ? selectedUsers.map(
        (user) => user.profilePhoto ?? "/empty-profile-photo.jpeg",
      )
    : [];

  useEffect(() => {
    if (!selectedUser) return;
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
    const isUserInChat = usersInChat?.find((u) => u.id === selectedUser.id);
    if (isUserInChat) {
      toast({
        title: "User already in chat",
        variant: "default",
      });
      return;
    }
    setSelectedUsers((prev) => [...prev, selectedUser]);
    setSelectedUser(null);
  }, [selectedUser, selectedUsers, toast, usersInChat]);

  return (
    <div className="py-5">
      <div className="flex items-center justify-between text-lg font-medium">
        Members{" "}
        <Button size={"sm"} className="px-4" onClick={() => setOpen(true)}>
          Add Members
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <div className="relative flex min-h-80 flex-col">
            <h1 className="mb-3 text-center text-2xl font-semibold">
              Add Members
            </h1>
            <div className="mb-10">
              <UserSearchInput selectedUser={setSelectedUser} />
            </div>
            <MultipleUserPhoto userImages={selectedUsersImages} imgSize={100} />
            <Button
              onClick={() => {
                addParticipant({
                  chatId,
                  participantIds: selectedUsers.map((user) => user.id),
                });
              }}
              disabled={selectedUsers.length === 0}
              className="absolute bottom-3 mt-5 w-full self-end"
            >
              Add
            </Button>
            {error && (
              <p className="absolute -bottom-2 mt-1 text-xs font-medium text-error">
                Can&apos;t add user to chat
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddUsersToChat;
