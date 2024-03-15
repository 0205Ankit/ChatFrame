import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import socket from "@/utils/socket";
import Link from "next/link";
import { FaFacebookMessenger } from "react-icons/fa";
import { RiMessengerLine } from "react-icons/ri";

type PropTypes = {
  active?: boolean;
  shrink: boolean;
};
const Messages = ({ active, shrink }: PropTypes) => {
  const utils = api.useUtils();
  const { data: totalUnreadChats, isLoading } =
    api.chat.getTotalUnreadChats.useQuery();

  socket.on("message received", () => {
    void utils.chat.getTotalUnreadChats.invalidate();
  });

  return (
    <Link
      href="/direct/inbox"
      className={cn(
        "relative flex cursor-pointer items-center gap-2 rounded-md px-2 py-3 text-lg font-medium transition-all duration-200 hover:bg-primary",
        { "font-bold": active },
        { "px-3": shrink },
      )}
    >
      <div className="relative">
        {active ? (
          <FaFacebookMessenger className="text-2xl" />
        ) : (
          <RiMessengerLine className="text-2xl" />
        )}
        {!isLoading && !!totalUnreadChats && totalUnreadChats > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold">
            {totalUnreadChats}
          </span>
        )}
      </div>
      {!shrink && "Messages"}
    </Link>
  );
};

export default Messages;
