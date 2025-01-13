"use client";

import { getWorkspacesFolders, moveVideoLocation } from "@/actions/workspace";
import { Button, Label, Select, Separator, Skeleton } from "@/components/ui";
import { useQueryData } from "@/hooks";
import { MoveVideoLocationPayload, MutationKeysE, QueryKeysE, RootStateT } from "@/types";
import { moveVideoLocationValidator } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";

type Props = {
  videoId: string;
  workspaceId?: string;
  folderName?: string;
  folderId?: string;
};

const ChangeVideoLocation: React.FC<Props> = ({ videoId, folderId, workspaceId }) => {
  // TODO: move folder
  const client = useQueryClient();
  const { folders } = useSelector((store: RootStateT) => store.foldersReducer);
  const { workspaces } = useSelector((store: RootStateT) => store.workspacesReducer);

  const folder = folders.find((folder) => folder.id === folderId);
  const workspace = workspaces.find((workspace) => workspace.id === workspaceId);

  const { mutate, isPending } = useMutation<boolean, string, { folderId: string | null; workspaceId: string }>({
    mutationKey: [MutationKeysE.CHANGE_VIDEO_LOCATION],
    mutationFn: async ({ folderId, workspaceId }) => {
      const { status, message } = await moveVideoLocation(videoId, workspaceId, folderId);
      toast(message);
      return status;
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [QueryKeysE.WORKSPACE_VIDEOS],
        exact: true,
      });
    },
  });

  const { data, isFetching, isFetched } = useQueryData({
    initialData: [],
    queryKey: [QueryKeysE.WORKSPACE_FOLDERS],
    queryFn: async () => {
      const { folders } = await getWorkspacesFolders(workspaceId!);
      return folders;
    },
  });

  const { handleSubmit, control } = useForm<MoveVideoLocationPayload>({
    defaultValues: { folderId: folderId, workspaceId },
    resolver: zodResolver(moveVideoLocationValidator),
  });

  const onSubmit: SubmitHandler<MoveVideoLocationPayload> = (values) => mutate(values);

  return (
    <form className="flex flex-col gap-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="border-[1px] rounded-xl p-5">
        <h2 className="text-xs text-[#a4a4a4]">Current Workspace</h2>
        {workspace && <p>{workspace.name}</p>}
        <h2 className="text-xs text-[#a4a4a4] mt-4">Current Folder</h2>
        {folder ? <p>{folder.name}</p> : "This video has no folder"}
      </div>

      <Separator orientation="horizontal" />

      <div className="flex flex-col gap-y-5 p-5 border-[1px] rounded-xl">
        <h2 className="text-xs text-[#A4A4A4]">To</h2>
        <Label className="flex-col gap-y-2 flex">
          <p className="text-xs">Workspace</p>
          <Controller
            name="workspaceId"
            control={control}
            defaultValue={workspaceId}
            render={({ field }) => (
              <Select.Root onValueChange={field.onChange} value={field.value!}>
                <Select.Trigger className="rounded-xl text-base bg-transparent">
                  <Select.Value placeholder="Select workspace" />
                </Select.Trigger>

                <Select.Content>
                  {workspaces.map((workspace) => (
                    <Select.Item key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            )}
          />
        </Label>

        {isFetching ? (
          <Skeleton className="w-full h-[40px] rounded-xl" />
        ) : (
          <Label className="flex flex-col gap-y-2">
            <p className="text-xs">Folders in this workspace</p>
            {isFetched && (
              <Controller
                name="folderId"
                control={control}
                defaultValue={folder?.id}
                render={({ field }) => (
                  <Select.Root onValueChange={field.onChange} value={field.value!}>
                    <Select.Trigger className="rounded-xl text-base bg-transparent">
                      <Select.Value placeholder="Select a folder" />
                    </Select.Trigger>

                    <Select.Content>
                      {data?.map((folder) => (
                        <Select.Item key={folder.id} value={folder.id}>
                          {folder.name}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                )}
              />
            )}
          </Label>
        )}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? <LoaderCircle className="inline w-8 h-8 animate-spin text-yellow-400 " /> : "Transfer"}
      </Button>
    </form>
  );
};

export default ChangeVideoLocation;
