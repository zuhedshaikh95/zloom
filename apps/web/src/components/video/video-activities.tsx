// "use client";

import { getVideoComments } from "@/actions/user";
import { CommentCard, CommentForm } from "@/components/global";
import { Tabs } from "@/components/ui";
import { useQueryData } from "@/hooks";
import { QueryKeysE } from "@/types";
import React from "react";

type Props = {
  authorName: string;
  videoId: string;
};

const VideoActivities: React.FC<Props> = ({ authorName, videoId }) => {
  const { data: comments } = useQueryData({
    initialData: [],
    queryKey: [QueryKeysE.VIDEO_COMMENTS],
    queryFn: async () => {
      const { comments } = await getVideoComments(videoId);
      return comments;
    },
  });

  return (
    <Tabs.Content value="Activity">
      <div className="p-6 bg-[#1D1D1D] rounded-xl flex flex-col gap-y-6">
        <CommentForm authorName={authorName} videoId={videoId} />

        {comments?.map((comment) => (
          <CommentCard
            key={comment.id}
            author={{
              firstName: comment.user?.firstName!,
              image: comment.user?.image!,
              lastName: comment.user?.lastName!,
            }}
            videoId={comment.videoId}
            replies={comment.replies}
            commentId={comment.id}
            commentText={comment.commentText}
            createdAt={comment.createdAt}
          />
        ))}
      </div>
    </Tabs.Content>
  );
};

export default VideoActivities;
