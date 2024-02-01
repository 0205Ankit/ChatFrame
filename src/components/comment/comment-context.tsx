import { createContext } from "react";

type CommentContextType = {
  replyToUser: {
    username: string;
  };
  setReplyToUser: React.Dispatch<
    React.SetStateAction<{
      username: string;
    }>
  >;
  repliedCommentId: string;
  focusCommentInput: boolean;
  setRepliedCommentId: React.Dispatch<React.SetStateAction<string>>;
  setFocusCommentInput: React.Dispatch<React.SetStateAction<boolean>>;
};

const CommentContext = createContext<CommentContextType | null>(null);

export default CommentContext;
