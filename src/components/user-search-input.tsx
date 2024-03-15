import { api } from "Frontend/src/trpc/react";
import debounce from "lodash.debounce";
import React, { useState } from "react";
import { Input } from "./ui/input";
import ProfileCard from "./profile-card";
import { type User } from "@prisma/client";

const UserSearchInput = ({
  selectedUser,
}: {
  selectedUser: React.Dispatch<React.SetStateAction<User | null>>;
}) => {
  const [userInput, setUserInput] = useState("");
  const [sendQuery, setSendQuery] = useState(false);

  const { data: users, isLoading } = api.user.searchUser.useQuery(
    { query: userInput },
    {
      enabled: sendQuery,
    },
  );
  const searchUserHandler = debounce((value: string) => {
    if (value) setSendQuery(true);
    else setSendQuery(false);
  }, 500);

  return (
    <div className="relative">
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
                        onClick={() => {
                          selectedUser(user);
                          setUserInput("");
                        }}
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
  );
};

export default UserSearchInput;
