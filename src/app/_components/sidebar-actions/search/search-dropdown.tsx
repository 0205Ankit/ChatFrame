import UserSearchInput from "@/components/user-search-input";
import { api } from "@/trpc/react";
import { type User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const SearchDropdown = ({
  setSheetOpen,
  setShrink,
}: {
  setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShrink: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const router = useRouter();

  const { mutateAsync: createRecentSearch } =
    api.user.createRecentSearch.useMutation();

  const setRecentSearchHandler = useCallback(
    async (userName: string, userId: string) => {
      await createRecentSearch({ targetUserId: userId });
      router.replace(`/profile/${userName}`);
      setSheetOpen(false);
      setShrink(false);
    },
    [createRecentSearch, router, setSheetOpen, setShrink],
  );

  useEffect(() => {
    if (!selectedUser) return;
    const asyncFunction = async () => {
      await setRecentSearchHandler(
        selectedUser.userName ?? "User",
        selectedUser.id,
      );
    };

    void asyncFunction();
  }, [selectedUser, setRecentSearchHandler]);

  return (
    <div className="pt-3">
      <UserSearchInput selectedUser={setSelectedUser} />
    </div>
  );
};

export default SearchDropdown;
