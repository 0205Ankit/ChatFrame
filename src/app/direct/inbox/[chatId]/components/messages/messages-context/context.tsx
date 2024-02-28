import { createContext } from "react";

type MessagesContext = {
  replyMessageId: string;
  setReplyMessageId: React.Dispatch<React.SetStateAction<string>>;
  setFocusMessageInput: React.Dispatch<React.SetStateAction<boolean>>;
  focusMessageInput: boolean;
  replyMessageText: string;
  setReplyMessageText: React.Dispatch<React.SetStateAction<string>>;
  replyMessageUsername: string;
  setReplyMessageUsername: React.Dispatch<React.SetStateAction<string>>;
};

const MessagesContext = createContext<MessagesContext | null>(null);

export default MessagesContext;
