import React from "react";
import { Button } from "@/components/ui";
import { Link } from "lucide-react";
import { toast } from "sonner";

type Props = {
  videoId: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
};

const CopyLink: React.FC<Props> = ({ videoId, className, variant }) => {
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_HOST_URL}/preview/${videoId}`);
    toast("Copied", {
      description: "Don't forget to share!",
    });
  };

  return (
    <Button className={className} variant={variant} onClick={handleCopyToClipboard}>
      <Link size={22} className="text-[#A4A4A4]" />
    </Button>
  );
};

export default CopyLink;
