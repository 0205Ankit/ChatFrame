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
  //   console.log(isLoading);

  const searchHandler = debounce((value: string) => {
    setValue(value);
  }, 500);

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
        // onClick={}
        className="text-bg-primaryDark cursor-pointer rounded-full text-xl"
      />
      {value && (
        <div className="absolute inset-x-0 top-full min-h-[200px] w-full rounded-md px-3 py-5">
          {isLoading ? (
            <div className="flex items-center gap-1">
              <div
                style={{
                  height: `${40}px`,
                  width: `${40}px`,
                }}
                className="animate-pulse rounded-full bg-slate-200"
              />
              <div className="flex flex-col">
                <h1 className="mb-1 w-20 animate-pulse rounded-sm bg-slate-200 py-1"></h1>
                <h1 className="w-10 animate-pulse rounded-sm bg-slate-200 py-1"></h1>
              </div>
            </div>
          ) : (
            <>
              {Array.isArray(users) && users.length === 0 ? (
                <p className="text-center">No results found</p>
              ) : (
                <>
                  {users?.map((user) => {
                    return (
                      <div
                        key={user.id}
                        className="mb-3 cursor-pointer"
                        onClick={() => {
                          router.replace(`/profile/${user.userName}`);
                          setSheetOpen(false);
                          setShrink(false);
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

export default SearchDropdown;
