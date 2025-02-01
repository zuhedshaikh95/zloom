export type UserProfileT = Partial<{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  clerkId: string;

  subscription?: {
    plan: "PRO" | "FREE";
  };

  studio: Partial<{
    id: string;
    screen: string;
    mic: string;
    preset: "HD" | "SD";
    camera: string;
    userId: string;
  }>;
}>;

export enum QueryKeysE {
  USER_PROFILE = "user-profile",
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
