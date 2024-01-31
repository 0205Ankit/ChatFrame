import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CommentFormattedText from "./comment-formatted-text";
import { type ReplyCommentsType } from "@/types/comment-type";

const CommentReplies = ({
  comments,
  repliedCommentId,
}: {
  comments: ReplyCommentsType[];
  repliedCommentId: string;
}) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" className="ml-5 border-b-0">
        <AccordionTrigger className="py-1 hover:no-underline">
          <div className="flex w-fit items-center gap-4 text-xs font-bold text-slate-500">
            <span className="scale-x-[5]">-</span> view Replies (
            {comments?.length ?? 1})
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {comments?.map((comment) => (
            <CommentFormattedText
              key={comment.id}
              comment={comment}
              mainCommentId={repliedCommentId}
              className="mt-4"
              isReply
            />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CommentReplies;
