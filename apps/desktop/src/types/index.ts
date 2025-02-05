import { updateStudioSettingsValidator } from "@/validations";
import { z } from "zod";

export type UserProfileT = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  clerkId: string;
  image: string;
  createdAt: string;
  updatedAt: string;

  subscription: {
    plan: "PRO" | "FREE";
  };

  studio: StudioT;
};

export type StudioT = {
  id: string;
  screen: string | null;
  mic: string | null;
  preset: "HD" | "SD";
  camera: string | null;
  userId: string;
};

export enum QueryKeysE {
  USER_PROFILE = "user-profile",
}

export enum MutationKeysE {
  UPDATE_STUDIO = "update-studio",
}

export type SourceDevicesStateT = {
  displays?: {
    appIcon: null;
    display_id: string;
    id: string;
    name: string;
    thumbnail: unknown[];
  }[];
  audioInputs?: {
    deviceId: string;
    kind: string;
    label: string;
    groupId: string;
  }[];
  error?: string | null;
  isPending?: boolean;
};

export type RouteReponseT<T = undefined> = {
  status: boolean;
  data: T;
  message: string;
};

export type UpdateStudioSettingsFormT = z.infer<typeof updateStudioSettingsValidator>;
