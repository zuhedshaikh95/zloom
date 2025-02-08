import { StudioT } from "@/types";
import { hidePluginWindow } from "./utils";
import { createId } from "@paralleldrive/cuid2";

let videoTransferFileName: string | undefined = undefined;
let mediaRecorder: MediaRecorder;

export const startRecording = (source: StudioT) => {
  hidePluginWindow(true);

  videoTransferFileName = `${createId()}-${source.id.slice(0, 8)}.webm`;
  mediaRecorder.start(1000);
};

export const stopRecording = () => mediaRecorder.stop();
