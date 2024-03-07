import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { TbSettings } from "react-icons/tb";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ChangeChatName from "./change-chat-name";
import AddUsersToChat from "./add-user-to-chat";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

const ChatSettings = ({ chatId }: { chatId: string }) => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const utils = api.useUtils();

  const { data } = api.chat.getChatsById.useQuery({
    chatId: chatId,
  });

  const { mutate: removeParticipant } =
    api.chat.removeParticipantFromChat.useMutation({
      onSuccess: () => {
        void utils.chat.getChats.invalidate();
        void utils.chat.getChatsById.invalidate();
      },
    });

  const isLoggedInUserAdmin = data?.participants.find(
    (participant) => participant.userId === session?.user.id,
  )?.isAdmin;

  const usersInChat = data?.participants.map((participant) => participant.user);

  return (
    <>
      <Button variant={"noStyle"} size={"sm"} onClick={() => setOpen(true)}>
        <TbSettings className="text-3xl" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-2xl">Details</SheetTitle>
            <ChangeChatName chatId={chatId} />
            <div>
              <Button
                size={"sm"}
                variant={"noStyle"}
                onClick={() =>
                  removeParticipant({
                    chatId,
                    participantId: session?.user.id ?? "",
                  })
                }
                className="bg-error px-4 text-white hover:bg-error"
              >
                Leave
              </Button>
              <p className="py-3 text-sm">
                You won&apos;t receive messages from this group and it will be
                removed from the feed unless someone adds you to the chat again.
              </p>
            </div>
            <AddUsersToChat chatId={chatId} usersInChat={usersInChat} />
            <ScrollArea className="my-5 flex h-[calc(50vh-50px)] flex-col gap-1">
              {data?.participants.map((participant) => (
                <Link
                  href={`/profile/${participant.user.userName}`}
                  key={participant.userId}
                  className="flex items-center justify-between rounded-md px-4 py-2 transition-all hover:bg-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={
                        participant.user.profilePhoto ??
                        "/empty-profile-photo.jpeg"
                      }
                      alt="profile"
                      width={100}
                      height={100}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                    <div>
                      <h1 className="font-normal">
                        {participant.user.userName ?? "user"}
                      </h1>
                      <p className="text-sm font-medium text-slate-500">
                        {participant.isAdmin ? "Admin" : "Member"}
                      </p>
                    </div>
                  </div>
                  {isLoggedInUserAdmin &&
                    participant.userId !== session?.user?.id && (
                      <Button
                        size={"xs"}
                        variant={"noStyle"}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          removeParticipant({
                            chatId: chatId,
                            participantId: participant.userId,
                          });
                        }}
                        className="float-end h-fit bg-error px-2 py-1 text-white hover:bg-error"
                      >
                        Remove
                      </Button>
                    )}
                </Link>
              ))}
            </ScrollArea>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ChatSettings;
