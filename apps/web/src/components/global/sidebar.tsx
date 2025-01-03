"use client";

import { getNotifications } from "@/actions/user";
import { getWorkspaces } from "@/actions/workspace";
import { Infobar, SidebarItem, WorkspaceSearch } from "@/components/global";
import { Button, Card, Dialog, Select, Separator, Sheet } from "@/components/ui";
import { mapWorkspaceMenuItems } from "@/constants";
import { setWorkspaces } from "@/redux/features/workspaces-slice";
import { AppDispatch, MutationKeysE, QueryKeysE } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LoaderCircleIcon, Menu, PlusCircle } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

type Props = {
  workspaceId: string;
};

const Sidebar: React.FC<Props> = ({ workspaceId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathName = usePathname();

  const { data, isFetched } = useQuery({
    queryKey: [QueryKeysE.WORKSPACES],
    queryFn: async () => {
      const { workspaces } = await getWorkspaces();
      return workspaces;
    },
  });

  const { data: notifications } = useQuery({
    queryKey: [QueryKeysE.NOTIFICATIONS],
    queryFn: async () => {
      const { notifications } = await getNotifications();
      return notifications;
    },
  });

  const { mutate, isPending } = useMutation<{ status: boolean; session_url?: string }>({
    mutationKey: [MutationKeysE.CREATE_SUBSCRIPTION],
    mutationFn: async () => {
      const response = await axios.get<{ status: boolean; session_url?: string }>("/api/payment");
      return response.data;
    },
    onSuccess: (response) => {
      return (window.location.href = `${response.session_url}`);
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  const workspace = data?.workspaces?.find((workspace) => workspace.id === workspaceId);

  const onWorkspaceChange = (id: string) => {
    router.push(`/dashboard/${id}`);
  };

  if (isFetched && data) {
    console.log("dispatching....");
    dispatch(setWorkspaces({ workspaces: data.workspaces }));
  }

  const handleSubscriptionPayment = () => mutate();

  const SidebarContent = (
    <div className="bg-[#111111] flex-none relative p-4 h-full w-[250px] flex flex-col gap-2 items-center overflow-hidden">
      <div className="bg-[#111111] p-4 flex gap-2 justify-center items-center mb-4 absolute top-0 left-0 right-0">
        <Image src="/assets/zloom-logo.png" width={40} height={40} alt="zloom-logo" />
        <p className="text-2xl">zloom</p>
      </div>

      <Select.Root defaultValue={workspaceId} onValueChange={onWorkspaceChange}>
        <Select.Trigger className="mt-16 text-neutral-400 bg-transparent">
          <Select.Value placeholder="Select Workspace"></Select.Value>
        </Select.Trigger>

        <Select.Content className="bg-[#111111] backdrop-blur-xl">
          <Select.Group>
            <Select.Label>Private Workspaces</Select.Label>
            {data?.workspaces?.map(
              (workspace) =>
                workspace.type === "PERSONAL" && (
                  <Select.Item className="ml-2" key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </Select.Item>
                )
            )}
          </Select.Group>

          <Select.Separator />

          <Select.Group>
            <Select.Label>Public Workspaces</Select.Label>
            {data?.workspaces?.map(
              (workspace) =>
                workspace.type === "PUBLIC" && (
                  <Select.Item className="ml-2" key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </Select.Item>
                )
            )}
          </Select.Group>

          {!!data?.members?.length && (
            <Select.Group>
              <Select.Label>Shared Workspaces</Select.Label>
              <Select.Separator />
              {data?.members.map((member) => (
                <Select.Item key={member.workspace?.id} value={member.workspace?.id!}>
                  {member.workspace?.name}
                </Select.Item>
              ))}
            </Select.Group>
          )}
        </Select.Content>
      </Select.Root>

      {workspace?.type === "PUBLIC" && data?.subscription?.plan === "PRO" && (
        <Dialog.Root>
          <Dialog.Trigger className="w-full" asChild>
            <Button className="p-2 w-full text-neutral-400 font-semibold text-xs" variant="ghost">
              <PlusCircle size={15} className="text-neutral-800/90 fill-neutral-500" />
              Invite to Workspace
            </Button>
          </Dialog.Trigger>

          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Invite to Workspace</Dialog.Title>
              <Dialog.Description>Invite other users to your Workspace</Dialog.Description>
            </Dialog.Header>

            <WorkspaceSearch workspaceId={workspaceId} />
          </Dialog.Content>
        </Dialog.Root>
      )}

      <p className="w-full text-[#9D9D9D] font-bold mt-4">Menu</p>

      <nav className="w-full">
        <ul>
          {mapWorkspaceMenuItems(workspaceId).map((menuItem, index) => (
            <SidebarItem
              key={index}
              href={menuItem.href}
              icon={menuItem.icon}
              selected={pathName === menuItem.href}
              title={menuItem.title}
              notifications={menuItem.title === "Notifications" ? notifications?._count?.notifications : 0}
            />
          ))}
        </ul>
      </nav>

      {data?.subscription?.plan === "FREE" && (
        <p className="text-[#9D9D9D] w-full -mt-2 font-medium text-xs">Upgrade to create more workspaces</p>
      )}

      <Separator className="w-4/5" />

      {data?.subscription?.plan === "FREE" && (
        <Card.Root className="bg-transparent mt-4">
          <Card.Header className="p-4">
            <Card.Title className="text-md text-[#9D9D9D]">Upgrade to Pro</Card.Title>
            <Card.Description className="text-[#707070]">
              Unlock AI features like transcription, AI summary and more.
            </Card.Description>
          </Card.Header>

          {/* TODO: Payment for Upgrade */}
          <Card.Footer className="mt-4">
            <Button className="text-sm w-full" onClick={handleSubscriptionPayment}>
              {isPending ? <LoaderCircleIcon className="inline w-8 h-8 animate-spin text-yellow-400 " /> : "Upgrade"}
            </Button>
          </Card.Footer>
        </Card.Root>
      )}
    </div>
  );

  return (
    <>
      <Infobar />

      <div className="md:hidden fixed my-4">
        <Sheet.Root>
          <Sheet.Trigger className="ml-2" asChild>
            <Button className="mt-[2px]" variant="ghost">
              <Menu />
            </Button>
          </Sheet.Trigger>

          <Sheet.Content className="p-0 w-fit h-full" side="left">
            {SidebarContent}
          </Sheet.Content>
        </Sheet.Root>
      </div>

      <div className="hidden md:block h-full">{SidebarContent}</div>
    </>
  );
};

export default Sidebar;
