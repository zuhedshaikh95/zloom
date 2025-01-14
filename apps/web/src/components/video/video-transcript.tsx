import React from "react";
import { Tabs } from "@/components/ui";

type Props = {
  transcript: string;
};

const VideoTranscript: React.FC<Props> = ({ transcript }) => {
  return (
    <Tabs.Content value="Transcript">
      <div className="p-5 bg-[#1D1D1D] rounded-xl flex flex-col gap-y-6">
        <p className="text-[#A7A7A7]">{transcript}</p>
      </div>
    </Tabs.Content>
  );
};

export default VideoTranscript;
