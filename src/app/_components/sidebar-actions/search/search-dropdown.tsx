import ProfileCard from "@/components/profile-card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import React from "react";
import { IoCloseCircle } from "react-icons/io5";

const SearchDropdown = ({
  setSheetOpen,
  setShrink,
}: {
  setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShrink: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [value, setValue] = React.useState("");
  const router = useRouter();
  const { data: users, isLoading } = api.user.searchUser.useQuery(
    { query: value },
    {
      enabled: !!value,
    },
  );

  const { mutateAsync: createRecentSearch } =
    api.user.createRecentSearch.useMutation();

  const searchHandler = debounce((value: string) => {
    setValue(value);
  }, 500);

  const setRecentSearchHandler = async (userName: string, userId: string) => {
    await createRecentSearch({ targetUserId: userId });
    router.replace(`/profile/${userName}`);
    setSheetOpen(false);
    setShrink(false);
  };

  return (
    <div
      className={cn(
        "relative mt-5 flex items-center gap-3 rounded-xl border-2 border-input px-3 py-1",
      )}
    >
      <Input
        placeholder="Search..."
        className={cn("border-none focus-visible:ring-0")}
        onChange={(e) => searchHandler(e.target.value)}
      />
      <IoCloseCircle
        onClick={() => setValue("")}
        className="text-bg-primaryDark cursor-pointer rounded-full text-xl"
      />
      {value && (
        <div className="custom-scrollbar absolute inset-x-0 top-[calc(100%+5px)] max-h-[300px] w-full overflow-y-auto rounded-md bg-white shadow-xl">
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
                        onClick={() =>
                          setRecentSearchHandler(
                            user.userName ?? "user",
                            user.id,
                          )
                        }
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

export default SearchDropdown;
