"use client";

import { createWorkspace, getWorkspaces } from "@/actions/workspace";
import { Button, Dialog, Input, Label } from "@/components/ui";
import { CreateWorkspacePayloadT, MutationKeysE, QueryKeysE } from "@/types";
import { createWorkspaceValidator } from "@/validations";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FolderPlus, LoaderCircle } from "lucide-react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {};

const CreateWorkspace: React.FC<Props> = ({}) => {
  const { data, isFetching } = useQuery({
    queryKey: [QueryKeysE.WORKSPACES],
    queryFn: async () => {
      const { workspaces } = await getWorkspaces();
      return workspaces;
    },
  });

  const { mutate, isPending } = useMutation<boolean, string, string>({
    mutationKey: [MutationKeysE.CREATE_WORKSPACE],
    mutationFn: async (workspaceName: string) => {
      const { status, message } = await createWorkspace(workspaceName);
      toast(message);
      return status;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWorkspacePayloadT>({
    defaultValues: { name: "" },
    resolver: zodResolver(createWorkspaceValidator),
  });

  const onSubmit: SubmitHandler<CreateWorkspacePayloadT> = async (values) => mutate(values.name);

  if (data?.subscription?.plan === "FREE") return null;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button className="bg-[#1D1D1D] text-[#707070] flex items-center gap-2 py-6 px-4 rounded-2xl">
          <FolderPlus />
          Create Workspace
        </Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Create a Workspace</Dialog.Title>
          <Dialog.Description>
            Workspaces helps you collaborate with team members. You are assigned a default personal workspace where you
            can keep your videos in private.
          </Dialog.Description>
        </Dialog.Header>

        <form className="flex flex-col gap-y-3" onSubmit={handleSubmit(onSubmit)}>
          <Label className="flex flex-col gap-2 text-[#9D9D9D]" htmlFor="name">
            Workspace name
            <Input className="bg-transparent" id="name" type="text" {...register("name")} />
            <ErrorMessage
              errors={errors}
              name="name"
              render={({ message }) => <p className="text-xs text-red-400 mt-2">{message}</p>}
            />
          </Label>

          <Button type="submit" className="text-sm w-full mt-2" disabled={isPending}>
            {isPending ? <LoaderCircle className="inline w-8 h-8 animate-spin text-yellow-400 " /> : "Create Workspace"}
          </Button>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default CreateWorkspace;
