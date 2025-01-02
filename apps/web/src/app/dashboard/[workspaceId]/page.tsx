import { CreateFolder, MyFolders } from "@/components/folder";
import { CreateWorkspace } from "@/components/global";
import { Tabs } from "@/components/ui";
import React from "react";

type Props = {
  params: {
    workspaceId: string;
  };
};

const Workspace: React.FC<Props> = async ({ params }) => {
  return (
    <div>
      <Tabs.Root defaultValue="videos" className="mt-6">
        <div className="flex w-full justify-between items-center">
          <Tabs.List className="bg-transparent gap-2 pl-0">
            <Tabs.Trigger className="p-2 px-5 rounded-full data-[state=active]:bg-[#252525]" value="videos">
              Videos
            </Tabs.Trigger>

            <Tabs.Trigger className="p-2 px-5 rounded-full data-[state=active]:bg-[#252525]" value="archive">
              Archive
            </Tabs.Trigger>
          </Tabs.List>

          <div className="flex gap-x-3">
            <CreateWorkspace />
            <CreateFolder workspaceId={params.workspaceId} />
          </div>
        </div>

        <section className="py-9">
          <Tabs.Content value="videos">
            <MyFolders workspaceId={params.workspaceId} />
          </Tabs.Content>
          <Tabs.Content value="archive"></Tabs.Content>
        </section>
      </Tabs.Root>
    </div>
  );
};

export default Workspace;
