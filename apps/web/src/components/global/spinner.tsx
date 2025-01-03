import { LoaderCircle } from "lucide-react";
import React from "react";

type Props = {
  size?: number;
  className?: string;
};

const Spinner: React.FC<Props> = ({ size = 25 }) => {
  return <LoaderCircle size={size} className="inline animate-spin text-yellow-400" />;
};

export default Spinner;
