import { Button, Tabs } from "@/components/ui";
import type { SUBSCRIPTION_PLAN } from "@prisma/client";
import { Bot, FileText, Pencil, Sparkles } from "lucide-react";
import React from "react";

type Props = {
  plan: SUBSCRIPTION_PLAN;
  trial: boolean;
  videoId: string;
};

const AiTools: React.FC<Props> = ({ plan, trial, videoId }) => {
  // TODO: stripe payment integration

  return (
    <Tabs.Content value="AI tools">
      <div className="p-5 bg-[#1D1D1D] rounded-xl flex flex-col gap-y-10">
        <div className="flex items-center gap-4">
          <div className="w-8/12">
            <h2 className="text-3xl font-bold">AI Tools</h2>
            <p className="text-[#BDBDBD]">Taking your video to the next step with the power of AI!</p>
          </div>

          <div className="mt-2 flex items-center justify-between gap-4">
            <Button className="text-sm">Try now</Button>
            <Button className="text-sm">Pay now</Button>
          </div>
        </div>

        <div className=" border-[1px] rounded-xl p-4 gap-4 flex flex-col bg-[#1b0f1b7f] ">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-[#a22fe0]">Loom AI</h2>
            <Sparkles size={22} color="#a22fe0" fill="#a22fe0" />
          </div>

          <div className="flex gap-2 items-start">
            <div className="p-1.5 rounded-full border-[#2d2d2d] border-[2px] bg-[#2b2b2b] ">
              <Pencil size={22} color="#a22fe0" />
            </div>
            <div className="flex flex-col">
              <h3 className="textmdg">Summary</h3>
              <p className="text-muted-foreground text-sm">Generate a description for your video using AI.</p>
            </div>
          </div>

          <div className="flex gap-2 items-start">
            <div className="p-1.5 rounded-full border-[#2d2d2d] border-[2px] bg-[#2b2b2b] ">
              <FileText size={22} color="#a22fe0" />
            </div>
            <div className="flex flex-col">
              <h3 className="textmdg">Summary</h3>
              <p className="text-muted-foreground text-sm">Generate a description for your video using AI.</p>
            </div>
          </div>

          <div className="flex gap-2 items-start">
            <div className="p-1.5 rounded-full border-[#2d2d2d] border-[2px] bg-[#2b2b2b] ">
              <Bot size={22} color="#a22fe0" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-md">AI Agent</h3>
              <p className="text-muted-foreground text-sm">
                Viewers can ask questions on your video and our ai agent will respond.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Tabs.Content>
  );
};

export default AiTools;
