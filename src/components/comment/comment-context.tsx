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
  setRepliedCommentId: React.Dispatch<React.SetStateAction<string>>;
};

const CommentContext = createContext<CommentContextType | null>(null);

export default CommentContext;
