import store from "@/redux/store";
import {
  createCommentValidator,
  createWorkspaceValidator,
  editVideoInfoValidator,
  moveVideoLocationValidator,
} from "@/validations";
import { SUBSCRIPTION_PLAN } from "@prisma/client";
import { z } from "zod";

export enum QueryKeysE {
  WORKSPACE_VIDEOS = "workspace-videos",
  WORKSPACES = "workspaces",
  WORKSPACE_FOLDERS = "workspace-folders",
  NOTIFICATIONS = "notifications",
  USERS = "users",
  FOLDER_INFO = "folder-info",
  PREVIEW_VIDEO = "preview-video",
  USER_PROFILE = "user-profile",
  VIDEO_COMMENTS = "video-comments",
}

export enum MutationKeysE {
  CREATE_FOLDER = "create-folder",
  CREATE_WORKSPACE = "create-workspace",
  RENAME_FOLDER = "rename-folder",
  CHANGE_VIDEO_LOCATION = "change-video-location",
  ENABLE_FIRSTVIEW = "enable-firstview",
  NEW_COMMENT = "new-comment",
  INVITE_MEMBER = "invite-member",
  CREATE_SUBSCRIPTION = "create-subscription",
  EDIT_VIDEO = "edit-video",
}

export type SearchUsersT = {
  subscription: {
    plan: SUBSCRIPTION_PLAN;
  } | null;
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  image: string | null;
};

export type CreateWorkspacePayloadT = z.infer<typeof createWorkspaceValidator>;

export type MoveVideoLocationPayload = z.infer<typeof moveVideoLocationValidator>;

export type CreateCommentPayloadT = z.infer<typeof createCommentValidator>;

export type WorkspaceVideoT = {
  user: {
    firstName: string | null;
    lastName: string | null;
    image: string | null;
  } | null;
  folder: {
    id: string;
    name: string;
  } | null;
  id: string;
  title: string | null;
  source: string;
  createdAt: Date;
  processing: boolean;
};

export type RootStateT = ReturnType<typeof store.getState>;
export type AppDispatchT = typeof store.dispatch;

export type EditVideoInfoPayloadT = z.infer<typeof editVideoInfoValidator>;
