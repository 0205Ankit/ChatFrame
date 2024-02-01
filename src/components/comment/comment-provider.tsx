import { useContext, useState } from "react";
import CommentContext from "./comment-context";

export const CommentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [replyToUser, setReplyToUser] = useState<{
    username: string;
  }>({
    username: "",
  }); // using state like this so that the component re-renders even if the replyToUser.username is the same as before
  const [repliedCommentId, setRepliedCommentId] = useState<string>("");
  const [focusCommentInput, setFocusCommentInput] = useState<boolean>(false);
  return (
    <CommentContext.Provider
      value={{
        replyToUser,
        setReplyToUser,
        repliedCommentId,
        setRepliedCommentId,
        focusCommentInput,
        setFocusCommentInput,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};

export const useComment = () => {
  const context = useContext(CommentContext);

  if (!context) {
    throw new Error("useComment must be used within a <CommentProvider />");
  }

  return context;
};
