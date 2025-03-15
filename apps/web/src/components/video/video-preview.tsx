"use client";

import { getPreviewVideo, sendEmailForFirstView } from "@/actions/workspace";
import { Button, Tabs } from "@/components/ui";
import { AiTools, CopyLink, EditVideoInfo, RichLink, VideoActivities, VideoTranscript } from "@/components/video";
import { useQueryData } from "@/hooks";
import { QueryKeysE } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Download } from "lucide-react";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import { ErrorMessage } from "@hookform/error-message";

type Props = {
  videoId: string;
};

const VideoPreview: React.FC<Props> = ({ videoId }) => {
  const { data } = useQueryData({
    queryKey: [QueryKeysE.PREVIEW_VIDEO],
    queryFn: async () => {
      const data = await getPreviewVideo(videoId);
      return data;
    },
  });

  if (data && !data.status) return redirect("/");

  useEffect(() => {
    if (data?.video?.views === 0) {
      notifyFirstView();
    }
  }, [data]);

  const notifyFirstView = async () => await sendEmailForFirstView(videoId);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 lg:px-20 lg:py-10 overflow-y-auto gap-5">
      <div className="flex flex-col lg:col-span-2 gap-y-10">
        <div>
          <div className="flex gap-x-5 items-start justify-between">
            <h2 className="text-white text-4xl font-bold">{data?.video?.title}</h2>

            {data?.author ? (
              <EditVideoInfo videoId={videoId} title={data.video?.title!} description={data.video?.description!} />
            ) : (
              <></>
            )}
          </div>

          <span className="flex gap-x-3 mt-2">
            <p className="text-[#9D9D9D] capitalize">
              {data?.video?.user?.firstName} {data?.video?.user?.lastName}
            </p>

            <p className="text-[#707070]">{formatDistanceToNow(data?.video?.createdAt!)} ago</p>
          </span>
        </div>

        <video className="w-full aspect-video opacity-50 rounded-xl" preload="metadata" controls>
          <source src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${data?.video?.source}#1`} />
        </video>

        <div className="flex flex-col text-2xl gap-y-4">
          <div className="flex gap-x-5 items-center justify-between">
            <p className="text-[#BDBDBD] font-semibold">Description</p>
            {data?.author ? (
              <EditVideoInfo videoId={videoId} title={data.video?.title!} description={data.video?.description!} />
            ) : (
              <></>
            )}
          </div>
          <p className="text-[#D9D9D9] text-lg font-medium">{data?.video?.description}</p>
        </div>
      </div>

      <div className="lg:col-span-1 flex flex-col gap-y-16">
        <div className="flex justify-end gap-x-3 items-center">
          <RichLink
            description={data?.video?.summary!}
            videoId={videoId}
            source={data?.video?.source!}
            title={data?.video?.title!}
          />

          <CopyLink variant="outline" className="rounded-full bg-transparent px-10" videoId={videoId} />

          <Button variant="outline" className="rounded-full bg-transparent px-10">
            <Download size={22} />
          </Button>
        </div>

        <Tabs.Root defaultValue="AI tools" className="w-full">
          <Tabs.List className="flex justify-start bg-transparent">
            {["AI tools", "Transcript", "Activity"].map((trigger) => (
              <Tabs.Trigger
                key={trigger}
                value={trigger}
                className="capitalize text-base data-[state=active]:bg-[#1D1D1D]"
              >
                {trigger}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <AiTools plan={data?.video?.user?.subscription?.plan!} trial={data?.video?.user?.trial!} videoId={videoId} />

          <VideoTranscript transcript={data?.video?.description!} />

          <VideoActivities authorName={data?.video?.user?.firstName!} videoId={videoId} />
        </Tabs.Root>
      </div>
    </div>
  );
};

export default VideoPreview;
