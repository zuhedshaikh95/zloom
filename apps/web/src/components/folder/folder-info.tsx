"use client";

import { getFolderInfo } from "@/actions/workspace";
import { useQueryData } from "@/hooks";
import { QueryKeysE } from "@/types";
import React from "react";

type Props = {
  folderId: string;
};

const FolderInfo: React.FC<Props> = ({ folderId }) => {
  const { data, isFetched } = useQueryData({
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
