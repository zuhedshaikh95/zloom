"use client";

import { inviteMemberToWorkspace, searchUsers } from "@/actions/user";
import { Avatar, Button, Input, Skeleton } from "@/components/ui";
import { MutationKeysE, QueryKeysE, SearchUsersT } from "@/types";
import { useDebouncedCallback } from "@mantine/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LoaderCircle, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  workspaceId: string;
};

const WorkspaceSearch: React.FC<Props> = ({ workspaceId }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data, isFetching, refetch } = useQuery<SearchUsersT[], string, SearchUsersT[], ["users", string]>({
    initialData: [],
    queryKey: [QueryKeysE.USERS, searchQuery],
    queryFn: async ({ queryKey }) => {
      const { users } = await searchUsers(queryKey[1]);
      return users;
    },
    enabled: false,
  });

  const { mutate, isPending } = useMutation<
    boolean,
    string,
    { workspaceId: string; receiverId: string; email: string }
  >({
    mutationKey: [MutationKeysE.INVITE_MEMBER],
    mutationFn: async ({ email, receiverId, workspaceId }) => {
      const { status, message } = await inviteMemberToWorkspace(workspaceId, receiverId, email);
      toast(message);
      return status;
    },
    onSuccess: () => {
      setSearchQuery("");
    },
  });

  useEffect(() => {
    if (searchQuery) handleRefetch();
  }, [searchQuery]);

  // TODO: Invite members to Workspace

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleRefetch = useDebouncedCallback(refetch, 600);

  return (
    <div className="flex flex-col gap-y-5">
      <Input
        className="bg-transparent border-[1px] rounded-sm outline-none"
        placeholder="Search for member..."
        onChange={handleSearch}
        value={searchQuery}
        disabled={isPending}
      />

      {isFetching ? (
        <div className="flex flex-col gap-y-2">
          <Skeleton className="w-full h-8 rounded-sm" />
        </div>
      ) : !!data.length ? (
        data.map((user) => (
          <div key={user.id} className="flex gap-x-3 items-center border-[1px] w-full p-2 rounded-xl">
            <Avatar.Root className="w-8 h-8">
              <Avatar.Image src={user.image!} alt="" />
              <Avatar.Fallback>
                <User />
              </Avatar.Fallback>
            </Avatar.Root>

            <div className="flex flex-col items-start">
              <p className="font-semibold capitalize">
                {user.firstName} {user.lastName}
              </p>

              <p className="lowercase text-xs bg-white px-2 rounded-lg text-[#1E1E1E] font-bold">
                {user.subscription?.plan}
              </p>
            </div>

            <div className="flex-1 flex justify-end items-center">
              <Button
                disabled={isPending}
                onClick={() => mutate({ receiverId: user.id, email: user.email, workspaceId })}
                variant="outline"
                className="w-5/12 font-bold"
              >
                {isPending ? <LoaderCircle className="inline w-8 h-8 animate-spin text-yellow-400" /> : "Invite"}
              </Button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-sm text-[#A4A4A4]">No Users found</p>
      )}
    </div>
  );
};

export default WorkspaceSearch;
