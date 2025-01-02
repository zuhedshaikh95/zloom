"use client";

import { getFolderInfo } from "@/actions/workspace";
import { QueryKeysE } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";

type Props = {
  folderId: string;
};

const FolderInfo: React.FC<Props> = ({ folderId }) => {
  const { data, isFetched } = useQuery({
    queryKey: [QueryKeysE.FOLDER_INFO],
    queryFn: async () => {
      const { folder } = await getFolderInfo(folderId);
      return folder;
    },
  });

  return (
    <div className="flex items-center">
      <h2 className="text-[#BdBdBd] text-xl">{data?.name}</h2>
    </div>
  );
};

export default FolderInfo;
