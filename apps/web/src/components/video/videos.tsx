"use client";

import { getWorkspacesVideos } from "@/actions/workspace";
import { VideoCard } from "@/components/video";
import { useQueryData } from "@/hooks";
import { cn } from "@/libs/utils";
import { QueryKeysE } from "@/types";
import { Video } from "lucide-react";
import React from "react";

type Props = {
  folderId: string;
  workspaceId: string;
};

const Videos: React.FC<Props> = ({ folderId, workspaceId }) => {
  const { data: videos } = useQueryData({
    initialData: [],
    queryKey: [QueryKeysE.WORKSPACE_VIDEOS],
    queryFn: async () => {
      const { videos } = await getWorkspacesVideos(folderId);
      return videos;
    },
  });

  // TODO: add videos

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Video size={22} color="#545454" fill="#545454" />
          <h2 className="text-[#BDBDBD] text-lg">Videos</h2>
        </div>
      </div>

      <section
        className={cn({
          "p-5": !videos?.length,
          "grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5": videos?.length,
        })}
      >
        {!videos?.length && <p className="text-[#BDBDBD]">No videos in workspace</p>}

        {videos?.map((video) => (
          <VideoCard key={video.id} video={video} workspaceId={workspaceId} />
        ))}
      </section>
    </div>
  );
};

export default Videos;
