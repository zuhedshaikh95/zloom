import { getUserProfile, getVideoComments } from "@/actions/user";
import { getPreviewVideo } from "@/actions/workspace";
import { VideoPreview } from "@/components/video";
import { QueryKeysE } from "@/types";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

type Props = {
  params: {
    videoId: string;
    workspaceId: string;
  };
};

const query = new QueryClient();

export default async function VideoId({ params }: Props) {
  await query.prefetchQuery({
    queryKey: [QueryKeysE.PREVIEW_VIDEO],
    queryFn: async () => {
      const data = getPreviewVideo(params.videoId);
      return data;
    },
  });

  await query.prefetchQuery({
    queryKey: [QueryKeysE.USER_PROFILE],
    queryFn: async () => {
      const { user } = await getUserProfile();
      return user;
    },
  });

  await query.prefetchQuery({
    queryKey: [QueryKeysE.VIDEO_COMMENTS],
    queryFn: async () => {
      const { comments } = await getVideoComments(params.videoId);
      return comments;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <VideoPreview videoId={params.videoId} />
    </HydrationBoundary>
  );
}
