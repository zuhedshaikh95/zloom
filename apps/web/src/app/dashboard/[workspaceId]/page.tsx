import React from "react";

type Props = {
  params: Awaited<{
    workspaceId: string;
  }>;
};

const Workspace: React.FC<Props> = async ({ params }) => {
  return <div>{params.workspaceId}</div>;
};

export default Workspace;
