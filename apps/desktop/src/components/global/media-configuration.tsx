import { Loader } from "@/components/global";
import { Select } from "@/components/ui";
import { axiosInstance } from "@/libs/utils";
import {
  MutationKeysE,
  RouteReponseT,
  SourceDevicesStateT,
  StudioT,
  UpdateStudioSettingsFormT,
  UserProfileT,
} from "@/types";
import { updateStudioSettingsValidator } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CameraIcon, HeadphonesIcon, MonitorIcon } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  state: SourceDevicesStateT;
  user: UserProfileT;
};

const MediaConfiguration: React.FC<Props> = ({ state, user }) => {
  const [preset, setPreset] = useState<"HD" | "SD">();

  const activeScreen = useMemo(() => state.displays?.find((screen) => screen.id === user.studio.screen), [user, state]);

  const activeAudio = useMemo(
    () => state.audioInputs?.find((audio) => audio.deviceId === user.studio.mic),
    [state, user]
  );

  const { mutate, isPending } = useMutation<
    RouteReponseT<StudioT>,
    RouteReponseT<null>,
    Partial<UpdateStudioSettingsFormT & { id: string }>
  >({
    mutationKey: [MutationKeysE.UPDATE_STUDIO],
    mutationFn: async (values) => {
      const response = await axiosInstance.post<RouteReponseT<any>>(`/api/studio/${user.id}`, values);
      return response.data;
    },
    onSuccess: (data) => {
      toast("Success!", {
        description: data.message,
      });
    },
    onError: (error) => {
      toast("Something went wrong!", {
        description: error.message,
      });
    },
  });

  const { watch, setValue } = useForm<UpdateStudioSettingsFormT>({
    resolver: zodResolver(updateStudioSettingsValidator),
    defaultValues: {
      audio: user.studio.mic ?? state.audioInputs![0]?.deviceId,
      screen: user.studio.screen ?? state.displays![0]?.id,
      preset: user.studio.preset,
    },
  });

  useEffect(() => {
    if (user?.studio) {
      window.ipcRenderer.send("media-sources", {
        ...user.studio,
        id: user.id,
        plan: user.subscription.plan,
      });
    }
  }, []);

  useEffect(() => {
    const subscribe = watch((values) => {
      setPreset(values.preset);

      mutate({ ...values, id: user.id });

      window.ipcRenderer.send("media-sources", {
        ...values,
        id: user.id,
        plan: user.subscription.plan,
      });
    });

    return () => subscribe.unsubscribe();
  }, [watch]);

  return (
    <form className="flex h-full relative w-full flex-col gap-y-5">
      {isPending && (
        <div className="fixed z-50 w-full inset-0 rounded-2xl h-full bg-black/80 flex justify-center items-center">
          <Loader />
        </div>
      )}

      <div className="flex gap-x-3 justify-center items-center">
        <MonitorIcon size={30} fill="#575665" color="#575665" />

        <Select.Root
          defaultValue=""
          onValueChange={(value) => setValue("screen", value, { shouldDirty: true, shouldTouch: true })}
        >
          <Select.Trigger className="outline-none cursor-pointer px-4 text-white border-[#575665]">
            <Select.Value placeholder="Choose Monitor"></Select.Value>
          </Select.Trigger>

          <Select.Content className="bg-[#171717] backdrop-blur-xl">
            {state.displays?.map((display) => (
              <Select.Item className="cursor-pointer text-white" key={display.id} value={display.id}>
                {display.name}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>

      <div className="flex gap-x-3 justify-center items-center">
        <HeadphonesIcon size={30} color="#575665" />

        <Select.Root
          defaultValue=""
          onValueChange={(value) => setValue("audio", value, { shouldDirty: true, shouldTouch: true })}
        >
          <Select.Trigger className="outline-none cursor-pointer px-4 text-white border-[#575665]">
            <Select.Value placeholder="Choose Audio"></Select.Value>
          </Select.Trigger>

          <Select.Content className="bg-[#171717] backdrop-blur-xl">
            {state.audioInputs?.map((audio) => (
              <Select.Item className="cursor-pointer text-white" key={audio.deviceId} value={audio.deviceId}>
                {audio.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>

      <div className="flex gap-x-3 justify-center items-center">
        <CameraIcon size={30} color="#575665" />

        <Select.Root
          defaultValue=""
          // @ts-ignore
          onValueChange={(value) => setValue("preset", value, { shouldDirty: true, shouldTouch: true })}
        >
          <Select.Trigger className="outline-none cursor-pointer px-4 text-white border-[#575665]">
            <Select.Value placeholder="Choose Audio"></Select.Value>
          </Select.Trigger>

          <Select.Content className="bg-[#171717] backdrop-blur-xl">
            <Select.Item className="cursor-pointer text-white" value="HD" disabled={user.subscription.plan === "FREE"}>
              1080p
            </Select.Item>
            <Select.Item className="cursor-pointer text-white" value="SD">
              720p
            </Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
    </form>
  );
};

export default MediaConfiguration;
