import { closeApp, cn } from "@/libs/utils";
import { UserButton } from "@clerk/clerk-react";
import { XIcon } from "lucide-react";
import React, { useState } from "react";

type Props = Readonly<{
  children: React.ReactNode;
  className?: string;
}>;

const ControlLayout: React.FC<Props> = ({ children, className }) => {
  const [isVisible, setIsVisible] = useState(false);

  window.ipcRenderer.on("hide-plugin", (event, payload) => {
    setIsVisible(payload.state);
  });

  const handleCloseApp = () => closeApp();

  return (
    <section
      className={cn(
        "bg-[#171717] border-2 border-neutral-700 flex px-1 flex-col rounded-3xl overflow-hidden",
        { invisible: isVisible },
        className
      )}
    >
      <div className="flex justify-between items-center p-5 draggable">
        <span className="non-draggable">
          <UserButton />
        </span>

        <XIcon
          size={20}
          className="text-gray-400 non-draggable hover:text-white cursor-pointer"
          onClick={handleCloseApp}
        />
      </div>

      <div className="flex-1 h-0 overflow-auto">{children}</div>
      <div className="p-5 flex w-full">
        <div className="flex items-center gap-x-2">
          <img width={40} src="/assets/zloom-logo.png" alt="zloom-logo" />
          <p className="text-white text-lg">Zloom</p>
        </div>
      </div>
    </section>
  );
};

export default ControlLayout;
