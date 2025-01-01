import { authenticateUser, getNotifications } from "@/actions/user";
import { getWorkspaces, getWorkspacesFolders, getWorkspacesVideos, verifyAccessToWorkspace } from "@/actions/workspace";
import { GlobalHeader, Sidebar } from "@/components/global";
import { QueryKeysE } from "@/types";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import React from "react";

type Props = Readonly<{
  children: React.ReactNode;
  params: { workspaceId: string };
}>;

const WorkspaceLayout: React.FC<Props> = async ({ children, params }) => {
  const auth = await authenticateUser();
  const hasAccess = await verifyAccessToWorkspace(params.workspaceId);

  if (!auth.user?.workspaces || !auth.user.workspaces.length) {
    return redirect("/auth/sign-in");
  }

  if ([404, 400, 500].includes(hasAccess.status)) {
    return redirect(`/dashboard/${auth.user.workspaces[0].id}`);
  }

  const query = new QueryClient();

  await query.prefetchQuery({
    queryKey: [QueryKeysE.WORKSPACES],
    queryFn: async () => {
      const { workspaces } = await getWorkspaces();
      return workspaces;
    },
  });

  await query.prefetchQuery({
    queryKey: [QueryKeysE.WORKSPACE_FOLDERS],
    queryFn: async () => {
      const { folders } = await getWorkspacesFolders(params.workspaceId);
      return folders;
    },
  });

  await query.prefetchQuery({
    queryKey: [QueryKeysE.WORKSPACE_VIDEOS],
    queryFn: async () => {
      const { videos } = await getWorkspacesVideos(params.workspaceId);
      return videos;
    },
  });

  await query.prefetchQuery({
    queryKey: [QueryKeysE.NOTIFICATIONS],
    queryFn: async () => {
      const { notifications } = await getNotifications();
      return notifications;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="flex h-screen w-screen">
        <Sidebar workspaceId={params.workspaceId} />

        <div className="w-full mt-20 p-6 overflow-y-auto overflow-x-hidden">
          <GlobalHeader workspace={hasAccess.workspace!} />
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default WorkspaceLayout;
