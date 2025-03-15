import { selectSources, startRecording, stopMediaRecorder } from "@/libs/recorder";
import { cn, videoRecordingTime } from "@/libs/utils";
import { StudioT } from "@/types";
import { CastIcon, PauseIcon, SquareIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type Props = {};

const StudioTray: React.FC<Props> = () => {
  const initialTime = new Date();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [preview, setPreview] = useState(false);
  const [recording, setRecording] = useState(false);
  const [sources, setSources] = useState<(StudioT & { plan: "PRO" | "FREE" }) | null>(null);
  const [count, setCount] = useState(0);
  const [timer, setTimer] = useState("00:00:00");

  useEffect(() => {
    window.ipcRenderer.on("profile-received", (_, payload) => {
      console.log("profile-received fired");
      setSources(payload);
    });
  }, []);

  useEffect(() => {
    if (!recording) return;

    const recordTimeInterval = setInterval(() => {
      const time = count + (new Date().getTime() - initialTime.getTime());
      setCount(time);
      const recordingTime = videoRecordingTime(time);

      if (sources?.plan === "FREE" && recordingTime.minute === "05") {
        setRecording(false), clearTimer(), stopMediaRecorder();
      }

      setTimer(recordingTime.length);

      if (time <= 0) {
        setTimer("00:00:00");
        clearInterval(recordTimeInterval);
      }
    }, 1);

    return () => {
      clearInterval(recordTimeInterval);
    };
  }, [recording]);

  useEffect(() => {
    if (sources) {
      selectSources(
        { id: sources?.id!, mic: sources?.mic!, preset: sources?.preset!, screen: sources?.screen! },
        videoRef
      );
    }

    return () => {
      if (sources)
        selectSources(
          { id: sources?.id!, mic: sources?.mic!, preset: sources?.preset!, screen: sources?.screen! },
          videoRef
        );
    };
  }, [sources]);

  const clearTimer = () => {
    setTimer("00:00:00");
    setCount(0);
  };

  if (!sources) {
    return <></>;
  }

  return (
    <div className="flex flex-col justify-end gap-y-5">
      <video className={cn("w-full border-2 self-end bg-white", { hidden: preview })} ref={videoRef} autoPlay />

      <div className="rounded-full flex justify-around items-center h-16 w-full border-2 bg-[#171717] draggable border-white/40">
        <div
          className={cn("non-draggable rounded-full cursor-pointer relative hover:opacity-80", {
            "bg-red-500 w-6 h-6": recording,
            "bg-red-400 w-8 h-8": !recording,
          })}
          {...(sources && {
            onClick: () => {
              setRecording(true);
              startRecording(sources);
            },
          })}
        >
          {recording && (
            <span className="absolute -right-16 top-1/2 transform -translate-y-1/2 text-white">{timer}</span>
          )}
        </div>

        {!recording ? (
          <PauseIcon size={32} className="non-draggable opacity-50" fill="#ffffff" />
        ) : (
          <SquareIcon
            size={32}
            className="non-draggable cursor-pointer hover:scale-110 transform transition duration-150"
            fill="#ffffff"
            onClick={() => (setRecording(false), clearTimer(), stopMediaRecorder())}
          />
        )}

        <CastIcon
          size={32}
          onClick={() => setPreview((prev) => !prev)}
          className="non-draggable cursor-pointer hover:opacity-60"
          color="#ffffff"
        />
      </div>
    </div>
  );
};

export default StudioTray;
