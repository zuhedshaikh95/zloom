import { cn } from "@/libs/utils";
import { LoaderCircleIcon } from "lucide-react";
import React from "react";

type Props = {
  className?: string;
};

const Loader: React.FC<Props> = ({ className }) => {
  return <LoaderCircleIcon className={cn("inline w-5 h-5 animate-spin text-yellow-400", className)} />;
};

export default Loader;
