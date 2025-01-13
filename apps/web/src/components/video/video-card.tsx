import { Avatar } from "@/components/ui";
import { CopyLink, VideoCardMenu } from "@/components/video";
import { WorkspaceVideoT } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Dot, LoaderCircle, Share2, User } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  video: WorkspaceVideoT;
  workspaceId: string;
};

const VideoCard: React.FC<Props> = ({ video, workspaceId }) => {
  // TODO: format dates
  return (
    <div className="bg-[#171717] flex justify-center items-center">
      {video.processing ? (
        <LoaderCircle className="inline w-8 h-8 animate-spin text-yellow-400 " />
      ) : (
        <div className="group overflow-hidden cursor-pointer bg-[#171717] relative border-[1px] border-[#252525] flex flex-col rounded-xl">
          <div className="absolute top-3 right-3 z-50 gap-x-3 hidden group-hover:flex">
            <VideoCardMenu
              videoId={video.id}
              folderId={video.folder?.id}
              folderName={video.folder?.name}
              workspaceId={workspaceId}
            />

            <CopyLink className="p-[5px] h-5 bg-hover:bg-transparent bg-[#252525]" videoId={video.id} />
          </div>

          <Link
            href={`/dashboard/${workspaceId}/video/${video.id}`}
            className="hover:bg-[#252525] transition duration-150 flex flex-col justify-between h-full"
          >
            <video controls={false} preload="metadata" className="w-full aspect-video opacity-50 z-20">
              <source src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${video.source}#t=1`} />
            </video>

            <div className="px-5 py-3 flex flex-col gap-7-2 z-20">
              <h2 className="text-sm font-semibold text-[#BDBDBD]">{video.title}</h2>

              <div className="flex gap-x-2 items-center mt-4">
                <Avatar.Root className="w-8 h-8">
                  <Avatar.Image src={video.user?.image!} />
                  <Avatar.Fallback>
                    <User className="w-8 h-8" size={22} />
                  </Avatar.Fallback>
                </Avatar.Root>

                <div>
                  <p className="capitalize text-xs text-[#BDBDBD]">
                    {video.user?.firstName} {video.user?.lastName}
                  </p>
                  <p className="text-[#6d6b6b]  text-xs flex items-center ">
                    <Dot /> {formatDistanceToNow(video.createdAt)} ago
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <span className="flex gap-x-1 items-center">
                  <Share2 fill="#9D9D9D" className="text-[#9D9D9D]" size={12} />

                  <p className="text-xs text-[#9D9D9D] capitalize">{video.user?.firstName}'s Workspace</p>
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default VideoCard;
