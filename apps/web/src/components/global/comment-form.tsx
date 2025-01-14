"use client";

import { getUserProfile, postCommentAndReply } from "@/actions/user";
import { Button, Input } from "@/components/ui";
import { useMutationData, useQueryData } from "@/hooks";
import { CreateCommentPayloadT, MutationKeysE, QueryKeysE } from "@/types";
import { createCommentValidator } from "@/validations";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { LoaderCircleIcon, SendIcon } from "lucide-react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  videoId: string;
  commentId?: string;
  authorName: string;
  close?: () => void;
};

const CommentForm: React.FC<Props> = ({ authorName, videoId, close, commentId }) => {
  const client = useQueryClient();

  const { data: user } = useQueryData({
    queryKey: [QueryKeysE.USER_PROFILE],
    queryFn: async () => {
      const { user } = await getUserProfile();
      return user;
    },
  });

  const { mutate, isPending } = useMutationData<
    boolean,
    string,
    { userId: string; commentText: string; videoId: string; commentId?: string }
  >({
    mutationKey: [MutationKeysE.NEW_COMMENT],
    mutationFn: async (args) => {
      const { message, status } = await postCommentAndReply({ ...args });
      toast(message);
      return status;
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [QueryKeysE.VIDEO_COMMENTS],
        exact: true,
      });
      reset();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCommentPayloadT>({
    defaultValues: { commentText: "" },
    resolver: zodResolver(createCommentValidator),
  });

  const onSubmit: SubmitHandler<CreateCommentPayloadT> = (values) => {
    mutate({ commentText: values.commentText, userId: user?.id!, videoId, commentId });
  };

  return (
    <form className="relative w-full" onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="text"
        placeholder="Write your thoughts"
        className="bg-transparent border-themeGray text-themeTextGray"
        autoComplete="off"
        disabled={isPending}
        {...register("commentText")}
      />
      <ErrorMessage
        name="commentText"
        errors={errors}
        render={({ message }) => <p className="text-red-400 absolute m-1  text-xs">{message}</p>}
      />

      <Button
        disabled={isPending}
        className="p-0 bg-transparent absolute bottom-2 top-[1px] right-3 hover:bg-transparent"
        type="submit"
      >
        {isPending ? (
          <LoaderCircleIcon className="inline w-8 h-8 animate-spin text-yellow-400 " />
        ) : (
          <SendIcon className="text-white/50 cursor-pointer hover:text-white/80" size={18} />
        )}
      </Button>
    </form>
  );
};

export default CommentForm;
