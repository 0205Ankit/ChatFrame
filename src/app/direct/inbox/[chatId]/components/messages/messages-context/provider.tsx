import { useContext, useState } from "react";
import MessagesContext from "./context";

export const MessagesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [replyMessageId, setReplyMessageId] = useState("");
  const [focusMessageInput, setFocusMessageInput] = useState(false);
  const [replyMessageText, setReplyMessageText] = useState("");
  const [replyMessageUsername, setReplyMessageUsername] = useState("");
  return (
    <MessagesContext.Provider
      value={{
        replyMessageId,
        setReplyMessageId,
        focusMessageInput,
        setFocusMessageInput,
        replyMessageText,
        setReplyMessageText,
        replyMessageUsername,
        setReplyMessageUsername,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessagesContext);

  if (!context) {
    throw new Error("useComment must be used within a <Messages />");
  }
  const reset = () => {
    context?.setReplyMessageId("");
    context?.setReplyMessageText("");
    context?.setReplyMessageUsername("");
    context?.setFocusMessageInput(false);
  };

  return { ...context, reset };
};
