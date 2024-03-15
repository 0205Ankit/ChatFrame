import { Button } from "@/components/ui/button";
import { HiOutlineReply } from "react-icons/hi";
import { useMessage } from "../messages-context/provider";
import { type MsgType } from "@prisma/client";

const MessageReply = ({
  messageId,
  messageUserName,
  messageText,
  messageType,
}: {
  messageId: string;
  messageUserName: string;
  messageText: string;
  messageType: MsgType;
}) => {
  const {
    setFocusMessageInput,
    setReplyMessageId,
    setReplyMessageText,
    setReplyMessageUsername,
  } = useMessage();

  const replyMessageHandler = () => {
    if (messageType === "PHOTO") {
      setReplyMessageText("Image");
    }
    if (messageType === "AUDIO") {
      setReplyMessageText("Audio");
    } else {
      setReplyMessageText(messageText);
    }
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
