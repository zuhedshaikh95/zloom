import { getMediaSources } from "@/libs/utils";
import { SourceDevicesStateT } from "@/types";
import { useReducer } from "react";

type DisplayDeviceActionProps = {
  type: "GET_DEVICES";
  payload: SourceDevicesStateT;
};

export const useMediaSources = () => {
  const [state, action] = useReducer(
    (state: SourceDevicesStateT, action: DisplayDeviceActionProps) => {
      switch (action.type) {
        case "GET_DEVICES":
          return { ...state, ...action.payload };

        default:
          return state;
      }
    },
    {
      displays: [],
      audioInputs: [],
      error: null,
      isPending: false,
    }
  );

  const fetchMediaSources = async () => {
    action({ type: "GET_DEVICES", payload: { isPending: true } });
    const sources = await getMediaSources();
    action({
      type: "GET_DEVICES",
      payload: {
        displays: sources.displays,
        audioInputs: sources.audioInputs,
        isPending: false,
      },
    });
  };

  return { state, fetchMediaSources };
};
