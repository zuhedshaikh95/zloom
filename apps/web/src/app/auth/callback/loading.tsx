import { Loader } from "@/components/global";
import React from "react";

type Props = {};

const CallbackLoading: React.FC<Props> = ({}) => {
  return (
    <div className="flex h-screen w-full justify-center items-center">
      <Loader className="w-8 h-8" />
    </div>
  );
};

export default CallbackLoading;
