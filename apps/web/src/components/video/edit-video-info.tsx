"use client";

import { editVideoInfo } from "@/actions/workspace";
import { Button, Dialog, Input } from "@/components/ui";
import { EditVideoInfoPayloadT, MutationKeysE, QueryKeysE } from "@/types";
import { editVideoInfoValidator } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditIcon } from "lucide-react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  videoId: string;
  title: string;
  description: string;
};

const EditVideoInfo: React.FC<Props> = ({ description, title, videoId }) => {
  const client = useQueryClient();

  const { mutate, isPending } = useMutation<boolean, string, EditVideoInfoPayloadT>({
    mutationKey: [MutationKeysE.EDIT_VIDEO],
    mutationFn: async (values) => {
      const { message, status } = await editVideoInfo(videoId, values.title, values.description);
      toast("Success", {
        description: message,
      });

      return status;
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [QueryKeysE.PREVIEW_VIDEO],
        exact: true,
      });
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<EditVideoInfoPayloadT>({
    resolver: zodResolver(editVideoInfoValidator),
    defaultValues: {
      description: description,
      title: title,
    },
  });

  const onSubmit: SubmitHandler<EditVideoInfoPayloadT> = (values) => mutate(values);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="ghost">
          <EditIcon className="text-[#6C6C6C]" />
        </Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Edit video details</Dialog.Title>

          <Dialog.Description>You can update your video details here</Dialog.Description>
        </Dialog.Header>

        <form className="flex flex-col gap-y-5" onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="text"
            placeholder={title}
            className="bg-transparent"
            autoComplete="off"
            disabled={isPending}
            {...register("title")}
          />

          <Input
            type="text"
            placeholder={description}
            className="bg-transparent"
            autoComplete="off"
            disabled={isPending}
            {...register("description")}
          />

          {<p className="text-xs text-red-500">{errors.description?.message ?? errors.title?.message}</p>}

          <Dialog.Footer>
            <Button type="submit" disabled={isPending}>
              Save
            </Button>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default EditVideoInfo;
