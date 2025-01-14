"use client";

import { Comment as CommentT, User as UserT } from "@prisma/client";
import React, { useState } from "react";
import { Avatar, Button, Card } from "@/components/ui";
import { cn } from "@/libs/utils";
import { DotIcon, UserIcon } from "lucide-react";
import CommentForm from "./comment-form";
import { formatDistanceToNow } from "date-fns";

interface Props extends Partial<CommentT> {
  author: {
    image: string;
    firstName: string;
    lastName: string;
  };
  isReply?: boolean;
  replies: (CommentT & { user: UserT | null })[];
}

const CommentCard: React.FC<Props> = ({ author, commentText, replies, videoId, commentId, isReply, createdAt }) => {
  const [onReply, setOnReply] = useState<boolean>(false);

  return (
    <Card.Root
      className={cn(
        {
          "bg-[#1D1D1D] pl-10 border-none shadow-none": isReply,
          "border-[1px] bg-[#1D1D1D] p-5 shadow-none": !isReply,
        },
        "relative"
      )}
    >
      <div className="flex gap-x-2 items-center">
        <Avatar.Root className="w-6 h-6">
          <Avatar.Image src={author.image} alt="author-image" />
          <Avatar.Fallback>
            <UserIcon />
          </Avatar.Fallback>
        </Avatar.Root>

        <p className="capitalize text-sm text-[#BDBDBD]">
          {author.firstName} {author.lastName}
        </p>

        <div className="flex items-center gap-0">
          <DotIcon color="#707070" />
          <span className="text-[707070] capitalize text-xs ml-[-6px]">{formatDistanceToNow(createdAt!)}</span>
        </div>
      </div>

      <div>
        <p className="text-[#BDBDBD]">{commentText}</p>
      </div>

      {!isReply && (
        <div className="flex justify-end mt-3">
          {!onReply ? (
            <Button
              className="text-sm rounded-full bg-[#252525] text-white hover:text-black"
              onClick={() => setOnReply(true)}
            >
              Reply
            </Button>
          ) : (
            <CommentForm
              close={() => setOnReply(false)}
              authorName={`${author.firstName} ${author.lastName}`}
              videoId={videoId!}
              commentId={commentId!}
            />
          )}
        </div>
      )}

      {!!replies.length && (
        <div className="flex flex-col gap-y-10 mt-5 border-l-2">
          {replies.map((reply) => (
            <CommentCard
              isReply
              key={reply.id}
              replies={[]}
              author={{ firstName: reply.user?.firstName!, image: reply.user?.image!, lastName: reply.user?.lastName! }}
              commentText={reply.commentText}
              commentId={reply.commentId}
              videoId={videoId}
              createdAt={reply.createdAt}
            />
          ))}
        </div>
      )}
    </Card.Root>
  );
};

export default CommentCard;
