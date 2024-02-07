import ProfileCard from "@/components/profile-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import React from "react";
import { IoClose } from "react-icons/io5";

type PropType = React.HTMLAttributes<HTMLDivElement> & {
  setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShrink: React.Dispatch<React.SetStateAction<boolean>>;
};
const RecentSearch = ({ className, setSheetOpen, setShrink }: PropType) => {
  const router = useRouter();
  const { data } = api.search.getRecentSearch.useQuery();
  const utils = api.useUtils();
  const { mutate: deleteRecentSearchMutation } =
    api.search.deleteRecentSearch.useMutation({
      onSuccess: () => {
        void utils.search.getRecentSearch.invalidate();
      },
    });
  const { mutate: deleteAllRecentSearchMutation } =
    api.search.deleteAllRecentSearch.useMutation({
      onSuccess: () => {
        void utils.search.getRecentSearch.invalidate();
      },
    });

  const deleteRecentSearch = (targetUserId: string) => {
    deleteRecentSearchMutation({ targetUserId });
  };

  return (
    <div className={cn("p-5", className)}>
      <div className="mb-2 flex items-center justify-between font-bold">
        Recent
        {data && data.length > 0 && (
          <Button
            variant={"noStyle"}
            size={"smallest"}
            className="font-semibold text-primary"
            onClick={() => deleteAllRecentSearchMutation()}
          >
            Clear All
          </Button>
        )}
      </div>
      {data && data.length > 0 ? (
        <>
          {data.map((search) => (
            <div
              key={search.targetUserId}
              className="group flex cursor-pointer items-center justify-between rounded-lg px-3 py-4 transition-all hover:bg-black/10"
              onClick={() => {
                router.replace(`/profile/${search.targetUser?.userName}`);
                setSheetOpen(false);
                setShrink(false);
              }}
            >
              <ProfileCard
                imageSize={40}
                userImage={
                  search.targetUser?.profilePhoto ?? "/empty-profile-photo.jpeg"
                }
                userName={search.targetUser?.userName}
              />
              <IoClose
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  deleteRecentSearch(search.targetUserId);
                }}
                className="hidden text-2xl text-slate-600 group-hover:block"
              />
            </div>
          ))}
        </>
      ) : (
        <div className="mt-20 text-center font-semibold text-slate-400">
          No Recent searches
        </div>
      )}
    </div>
  );
};

export default RecentSearch;
