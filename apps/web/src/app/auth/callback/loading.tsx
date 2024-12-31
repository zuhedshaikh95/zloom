import { LoaderCircle } from "lucide-react";
import React from "react";

type Props = {};

const CallbackLoading: React.FC<Props> = ({}) => {
  return (
    <div className="flex h-screen w-full justify-center items-center">
      <LoaderCircle className="inline w-8 h-8 animate-spin text-yellow-400 " />
    </div>
  );
};

export default CallbackLoading;
