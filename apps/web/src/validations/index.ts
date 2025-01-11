import { z } from "zod";

export const createWorkspaceValidator = z.object({
  name: z.string().min(3, { message: "Too short!" }),
});

export const moveVideoLocationValidator = z.object({
  folderId: z.string().nullable(),
  workspaceId: z.string(),
});

export const createCommentValidator = z.object({
  commentText: z.string().min(1, { message: "Too short!" }),
});
