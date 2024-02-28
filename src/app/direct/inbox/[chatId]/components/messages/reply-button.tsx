import { Button } from "@/components/ui/button";
import { HiOutlineReply } from "react-icons/hi";
import { useMessage } from "./messages-context/provider";

const MessageReply = ({
  messageId,
  messageUserName,
  messageText,
}: {
  messageId: string;
  messageUserName: string;
  messageText: string;
}) => {
  const {
    setFocusMessageInput,
    setReplyMessageId,
    setReplyMessageText,
    setReplyMessageUsername,
  } = useMessage();

  const replyMessageHandler = () => {
    setReplyMessageText(messageText);
    setReplyMessageUsername(messageUserName);
    setFocusMessageInput(true);
    setReplyMessageId(messageId);
  };
  return (
    <Button onClick={replyMessageHandler} variant={"noStyle"} className="p-0">
      <HiOutlineReply />
    </Button>
  );
};

export default MessageReply;
