import { StudioT } from "@/types";
import { createId } from "@paralleldrive/cuid2";
import { socket } from "./socket";
import { hidePluginWindow } from "./utils";

let videoTransferFileName: string | undefined = undefined;
let mediaRecorder: MediaRecorder;
let userId: string;

export const startRecording = (source: StudioT) => {
  hidePluginWindow(true);

  videoTransferFileName = `${createId()}-${source.id.slice(0, 8)}.webm`;
  mediaRecorder.start(1000);
};

export const stopRecording = () => {
  hidePluginWindow(false);
  stopMediaRecorder();
  socket.emit("process-video", {
    fileName: videoTransferFileName,
    userId,
  });
};

export const stopMediaRecorder = () => mediaRecorder.stop();

export const dataAvailable = (event: BlobEvent) => {
  socket.emit("video-chunks", {
    chunks: event.data,
    fileName: videoTransferFileName,
  });
};

export const selectSources = async (
  source: { preset: "HD" | "SD"; screen: string; mic: string; id: string },
  videoRef: React.RefObject<HTMLVideoElement | null>
) => {
  const isHD = source.preset === "HD";

  const constraints: any = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: source.screen,
        minWidth: isHD ? 1920 : 1280,
        maxWidth: isHD ? 1920 : 1280,
        minHeight: isHD ? 1080 : 720,
        maxHeight: isHD ? 1080 : 720,
        frameRate: 30,
      },
    },
  };

  userId = source?.id!;

  // creating stream
  const stream = await navigator.mediaDevices.getUserMedia(constraints);

  // aurio and video stream
  const audioStream = await navigator.mediaDevices.getUserMedia({
    video: false,
    audio: source.mic ? { deviceId: { exact: source.mic } } : false,
  });

  if (videoRef.current) {
    videoRef.current.srcObject = stream;
    await videoRef.current.play();
  }

  const combinedStream = new MediaStream(stream.getTracks().concat(audioStream.getTracks()));

  mediaRecorder = new MediaRecorder(combinedStream, {
    mimeType: "video/webm;codecs=vp9",
  });

  mediaRecorder.ondataavailable = dataAvailable;
  mediaRecorder.onstop = stopRecording;
};
