import { getFolderInfo, getWorkspacesVideos } from "@/actions/workspace";
import { FolderInfo } from "@/components/folder";
import { QueryKeysE } from "@/types";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import React from "react";

type Props = {
  params: {
    workspaceId: string;
    folderId: string;
  };
};

const query = new QueryClient();

export default async function Folder({ params }: Props) {
  await query.prefetchQuery({
    queryKey: [QueryKeysE.WORKSPACE_VIDEOS],
    queryFn: async () => {
      const { videos } = await getWorkspacesVideos(params.folderId);
      return videos;
    },
  });

  await query.prefetchQuery({
    queryKey: [QueryKeysE.FOLDER_INFO],
    queryFn: async () => {
      const { folder } = await getFolderInfo(params.folderId);
      return folder;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <FolderInfo folderId={params.folderId} />
      {/* <Videos folderId={params.folderId} workspaceId={params.workspaceId} /> */}
    </HydrationBoundary>
  );
}
