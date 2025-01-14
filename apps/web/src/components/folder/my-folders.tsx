"use client";

import { getWorkspacesFolders } from "@/actions/workspace";
import { Folder } from "@/components/folder";
import { useAppDispatch, useQueryData } from "@/hooks";
import { setFolders } from "@/redux/features/folders.slice";
import { MutationKeysE, QueryKeysE } from "@/types";
import { Folder as FolderT } from "@prisma/client";
import { MutationStatus, useMutationState } from "@tanstack/react-query";
import { ArrowRight, Folders } from "lucide-react";
import React from "react";

type Props = {
  workspaceId: string;
};

const MyFolders: React.FC<Props> = ({ workspaceId }) => {
  const dispatch = useAppDispatch();

  const { data: folders } = useQueryData({
    initialData: [],
    queryKey: [QueryKeysE.WORKSPACE_FOLDERS],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { folders } = await getWorkspacesFolders(workspaceId);
      dispatch(setFolders({ folders }));
      return folders;
    },
  });

  const mutatedFolders = useMutationState<{ variables: Partial<FolderT>; status: MutationStatus }>({
    filters: { mutationKey: [MutationKeysE.CREATE_FOLDER] },
    select: (mutation) => ({
      variables: mutation.state.variables as Partial<FolderT>,
      status: mutation.state.status,
    }),
  });

  const mutatingFolder = mutatedFolders.at(-1);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Folders size={22} color="#707070" />
          <h2 className="text-[#BDBDBD] text-lg">Folders</h2>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-[#BDBDBD] text-sm">More</p>
          <ArrowRight size={22} color="#707070" />
        </div>
      </div>

      <section className="flex items-center gap-4 p-4 overflow-x-auto w-full !scrollbar-thin !scrollbar-track-neutral-800 scrollbar-thumb-neutral-700">
        {!folders?.length && !mutatingFolder && <p className="text-neutral-500">No folders workspace</p>}

        <>
          {mutatingFolder && ["pending"].includes(mutatingFolder.status) && (
            <Folder name={mutatingFolder?.variables?.name!} id={mutatingFolder?.variables?.id!} optimistic />
          )}

          {mutatedFolders
            .filter((folder) => folder.status === "success")
            ?.map((folder) => (
              <Folder key={folder.variables.id!} id={folder.variables.id!} name="Untitled" />
            ))}

          {folders?.map((folder) => (
            <Folder key={folder.id} {...folder} />
          ))}
        </>
      </section>
    </div>
  );
};

export default MyFolders;
