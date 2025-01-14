import React from "react";

type Props = {
  videoId: string;
  title: string;
  description: string;
};

const EditVideo: React.FC<Props> = ({ description, title, videoId }) => {
  return <div>EditVideo</div>;
};

export default EditVideo;
