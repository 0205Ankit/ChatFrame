import { MultipleUserPhoto } from "@/app/_components/multiple-user-photo";
import ProfileCard from "@/components/profile-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import { type User } from "@prisma/client";
import debounce from "lodash.debounce";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CreateChatDialogContent = () => {
  const [userInput, setUserInput] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [sendQuery, setSendQuery] = useState(false);
  const { toast } = useToast();
  const { data } = useSession();
  const router = useRouter();
  const utils = api.useUtils();

  const selectedUsersImages = selectedUsers
    ? selectedUsers.map(
        (user) => user.profilePhoto ?? "/empty-profile-photo.jpeg",
      )
    : [];

  const { data: users, isLoading } = api.user.searchUser.useQuery(
    { query: userInput },
    {
      enabled: sendQuery,
    },
  );

  const { mutate: mutateMessage } = api.chat.createChat.useMutation({
    onSuccess: (data) => {
      void utils.chat.getChats.invalidate();
      router.push(`/direct/inbox/${data.id}`);
    },
  });

  const searchUserHandler = debounce((value: string) => {
    if (value) setSendQuery(true);
    else setSendQuery(false);
  }, 500);

  const selectUserHandler = (user: User) => {
    const isCurrentUser = user.id === data?.user.id;
    if (isCurrentUser) {
      toast({
        title: "Cannot select yourself",
        variant: "default",
      });
      return;
    }
    const userAlreadyExist = selectedUsers.find((u) => u.id === user.id);
    if (userAlreadyExist) {
      toast({
        title: "User already selected",
        variant: "default",
      });
      return;
    }
    setSelectedUsers((prev) => [...prev, user]);
    setUserInput("");
  };

  const sendMessageHandler = () => {
    mutateMessage({
      participantId: selectedUsers.map((user) => user.id),
      type: selectedUsers.length > 1 ? "GROUP" : "ONE_TO_ONE",
    });
  };

  return (
    <div className="relative flex min-h-80 flex-col">
      <h1 className="mb-3 text-center text-2xl font-semibold">New Message</h1>
      <div className="relative mb-10 mt-2">
        <Input
          className="focus-visible:ring-0"
          value={userInput}
          onChange={(e) => {
            setUserInput(e.target.value);
            searchUserHandler(e.target.value);
          }}
          placeholder="search for users"
        />
        {userInput && (
          <div className="custom-scrollbar absolute inset-x-0 top-[calc(100%+5px)] z-[20] max-h-[150px] w-full overflow-y-auto rounded-md bg-white shadow-xl">
            {isLoading ? (
              <div className="flex items-center gap-1 px-4 py-3">
                <div className="h-[40px] w-[40px] animate-pulse rounded-full bg-slate-200" />
                <div className="flex flex-col">
                  <h1 className="mb-1 w-20 animate-pulse rounded-sm bg-slate-200 py-1"></h1>
                  <h1 className="w-10 animate-pulse rounded-sm bg-slate-200 py-1"></h1>
                </div>
              </div>
            ) : (
              <>
                {Array.isArray(users) && users.length === 0 ? (
                  <div className="flex h-[100px] items-center justify-center">
                    No results found
                  </div>
                ) : (
                  <>
                    {users?.map((user) => {
                      return (
                        <div
                          key={user.id}
                          className="cursor-pointer px-4 py-3 transition-all hover:bg-black/10"
                          onClick={() => selectUserHandler(user)}
                        >
                          <ProfileCard
                            userImage={
                              user.profilePhoto ?? "/empty-profile-photo.jpeg"
                            }
                            userName={user.userName}
                            imageSize={40}
                          />
                        </div>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </div>
        )}
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
