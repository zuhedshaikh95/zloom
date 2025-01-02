"use client";

import { renameFolder } from "@/actions/workspace";
import { Input } from "@/components/ui";
import { cn } from "@/libs/utils";
import { MutationKeysE, QueryKeysE } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

type Props = {
  name: string;
  id: string;
  optimistic?: boolean;
  _count?: {
    videos: number;
  };
};

const Folder: React.FC<Props> = ({ id, name, _count, optimistic }) => {
  const client = useQueryClient();
  const pathName = usePathname();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const folderCardRef = useRef<HTMLDivElement | null>(null);

  const [isRenaming, setIsRenaming] = useState<boolean>(false);

  const { mutate, isPending } = useMutation<boolean, string, string>({
    mutationKey: [MutationKeysE.RENAME_FOLDER],
    mutationFn: async (folderName) => {
      const { status, message } = await renameFolder(id, folderName);
      toast(message);
      return status;
    },
    onSuccess: async () => {
      setIsRenaming(false);
      client.invalidateQueries({
        queryKey: [QueryKeysE.WORKSPACE_FOLDERS],
        exact: true,
      });
    },
  });

  const handleFolderNavigate = () => {
    if (isRenaming) return;
    router.push(`${pathName}/folder/${id}`);
  };

  const handleFolderTitleRename = (event: React.MouseEvent<HTMLParagraphElement>) => {
    event.stopPropagation();
    setIsRenaming(true);
  };

  const onFolderRename = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      event.stopPropagation();

      if (!inputRef.current || !folderCardRef.current) return;

      if (!inputRef.current.contains(event.relatedTarget) && !folderCardRef.current.contains(event.relatedTarget)) {
        if (inputRef.current.value) mutate(inputRef.current.value);
        setIsRenaming(false);
      }
    },
    [inputRef, folderCardRef, setIsRenaming, mutate]
  );

  const handlePreventSingleClickOnName = (event: React.MouseEvent<HTMLParagraphElement>) => event.stopPropagation();

  return (
    <div
      className={cn(
        "flex hover:bg-neutral-800 cursor-pointer transition duration-150 items-center gap-2 justify-between min-w-[250px] p-4 rounded-lg border-[1px]",
        { "opacity-60": optimistic }
      )}
      ref={folderCardRef}
      onClick={handleFolderNavigate}
    >
      <div className="flex flex-col gap-[1px]">
        {isRenaming ? (
          <Input
            ref={inputRef}
            className="border-none text-base outline-none text-neutral-300 bg-transparent p-0 h-6 focus-visible:ring-0 shadow-none"
            placeholder={name}
            autoFocus
            onBlur={onFolderRename}
          />
        ) : (
          <p
            className="text-neutral-300"
            onDoubleClick={handleFolderTitleRename}
            onClick={handlePreventSingleClickOnName}
          >
            {name}
          </p>
        )}

        <span className="text-sm text-neutral-500">{_count?.videos ?? 0} videos</span>
      </div>

      <FolderIcon size={22} color="#707070" fill="#545454" />
    </div>
  );
};

export default Folder;
