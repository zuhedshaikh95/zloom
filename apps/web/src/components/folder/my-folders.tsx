"use client";

import { getWorkspacesFolders } from "@/actions/workspace";
import { Folder } from "@/components/folder";
import { setFolders } from "@/redux/features/folders.slice";
import { AppDispatch, MutationKeysE, QueryKeysE } from "@/types";
import { Folder as FolderT } from "@prisma/client";
import { MutationStatus, useMutationState, useQuery } from "@tanstack/react-query";
import { ArrowRight, Folders } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";

type Props = {
  workspaceId: string;
};

const MyFolders: React.FC<Props> = ({ workspaceId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: folders, isFetched } = useQuery({
    initialData: [],
    queryKey: [QueryKeysE.WORKSPACE_FOLDERS],
    queryFn: async () => {
      const { folders } = await getWorkspacesFolders(workspaceId);
      return folders;
    },
  });

  const mutatedFolder = useMutationState<{ variables: Partial<FolderT>; status: MutationStatus }>({
    filters: { mutationKey: [MutationKeysE.CREATE_FOLDER] },
    select: (mutation) => ({
      variables: mutation.state.variables as Partial<FolderT>,
      status: mutation.state.status,
    }),
  }).at(-1);

  if (isFetched && folders) {
    dispatch(setFolders({ folders }));
    console.log("dispatching folders...");
  }

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
        {!folders.length && <p className="text-neutral-500">No folders in workspace</p>}

        <>
          {mutatedFolder && mutatedFolder.status === "pending" && (
            <Folder name={mutatedFolder.variables?.name!} id={mutatedFolder.variables?.id!} optimistic />
          )}

          {folders.map((folder) => (
            <Folder key={folder.id} {...folder} />
          ))}
        </>
      </section>
    </div>
  );
};

export default MyFolders;
