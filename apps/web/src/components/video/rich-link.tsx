import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui";

type Props = {
  description: string;
  videoId: string;
  source: string;
  title: string;
};

const RichLink: React.FC<Props> = ({ description, videoId, source, title }) => {
  const handleCopyRichLink = () => {
    const orignalTitle = title;
    const thumbnail = `<a style="display: flex; flex-direction: column; gap: 10px" href="${process.env.NEXT_PUBLIC_HOST_URL}/preview/${videoId}">
    <h3 style="text-decoration: none; color: black; margin: 0;" target="_blank" rel="noopener noreferrer">${orignalTitle}</h3>
    <p style="text-decoration: none; color: black; margin: 0;">${description}</p>
    <video
        width="320"
        style="display: block"
        >
            <source
                type="video/webm"
                src="${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${source}"
            />
        </video>
    </a>`;

    const thumbnailBlob = new Blob([thumbnail], { type: "text/html" });
    const blobTitle = new Blob([orignalTitle], { type: "text/plain" });
    const data = [
      new ClipboardItem({
        ["text/plain"]: blobTitle,
        ["text/html"]: thumbnailBlob,
      }),
    ];

    navigator.clipboard.write(data).then(() => {
      toast("Embedded Link Copied", {
        description: "Don't forget to share!",
      });
    });
  };

  return (
    <Button onClick={handleCopyRichLink} className="rounded-full">
      Get Embedded Code
    </Button>
  );
};

export default RichLink;
