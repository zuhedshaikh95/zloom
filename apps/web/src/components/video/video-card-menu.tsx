import React from "react";
import { Dialog } from "@/components/ui";
import { Move } from "lucide-react";
import { ChangeVideoLocation } from "@/components/video";

type Props = {
  videoId: string;
  workspaceId?: string;
  folderName?: string;
  folderId?: string;
};

const VideoCardMenu: React.FC<Props> = ({ folderId, folderName, videoId, workspaceId }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="flex items-center cursor-pointer gap-x-2" asChild>
        <Move size={22} fill="#A4A4A4" color="#A4A4A4" />
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Move to new Workspace/Folder</Dialog.Title>
          <Dialog.Description>
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </Dialog.Description>
        </Dialog.Header>

        <ChangeVideoLocation videoId={videoId} folderId={folderId} folderName={folderName} workspaceId={workspaceId} />
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default VideoCardMenu;
