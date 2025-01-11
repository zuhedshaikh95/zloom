"use client";

import { createFolder } from "@/actions/workspace";
import { Button } from "@/components/ui";
import { useMutationData } from "@/hooks";
import { MutationKeysE } from "@/types";
import { createId } from "@paralleldrive/cuid2";
import { FolderPlus } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type Props = {
  workspaceId: string;
};

const CreateFolder: React.FC<Props> = ({ workspaceId }) => {
  // TODO: create folders
  const { mutate, isPending } = useMutationData<boolean, string, { name: string; id: string }>({
    mutationKey: [MutationKeysE.CREATE_FOLDER],
    mutationFn: async ({ id, name }) => {
      const { status, message } = await createFolder(workspaceId, id);
      toast(message);
      return status;
    },
  });

  return (
    <Button
      className="bg-[#1D1D1D] text-[#707070] flex items-center gap-2 py-6 px4 rounded-2xl"
      onClick={() => mutate({ name: "Untitled", id: createId() })}
      disabled={isPending}
    >
      <FolderPlus size={22} />
      Create folder
    </Button>
  );
};

export default CreateFolder;
