"use server";

import { db } from "@/libs/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const verifyAccessToWorkspace = async (workspaceId: string) => {
  try {
    const user = await currentUser();

    if (!user) return { status: 404, workspace: null };

    const isUserInWorkspace = await db.workSpace.findUnique({
      where: {
        id: workspaceId,
        OR: [
          {
            user: {
              clerkId: user.id,
            },
          },
          {
            members: {
              every: {
                user: {
                  clerkId: user.id,
                },
              },
            },
          },
        ],
      },
    });

    if (isUserInWorkspace) {
      return {
        status: 200,
        workspace: isUserInWorkspace,
      };
    }

    return { status: 400, workspace: null };
  } catch (error: any) {
    console.log("🔴 verifyAccessToWorkspace Error:", error.message);
    return {
      status: 500,
      workspace: null,
    };
  }
};

export const getWorkspacesFolders = async (workspaceId: string) => {
  try {
    const folders = await db.folder.findMany({
      where: {
        workspaceId,
      },
      include: {
        _count: {
          select: {
            videos: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    if (folders) {
      return { status: 200, folders: folders };
    }

    return { status: 404, folders: [] };
  } catch (error) {
    return { status: 403, folders: [] };
  }
};

export const getWorkspacesVideos = async (workspaceId: string) => {
  try {
    const user = await currentUser();

    if (!user) return { status: 404, videos: [] };

    const videos = await db.video.findMany({
      where: {
        OR: [{ workspaceId }, { folderId: workspaceId }],
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        source: true,
        processing: true,
        folder: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (videos) {
      return { status: 200, videos };
    }

    return { status: 404, videos: [] };
  } catch (error) {
    return { status: 400, videos: [] };
  }
};

export const getWorkspaces = async () => {
  try {
    const user = await currentUser();

    if (!user) return { status: 404, workspaces: null };

    const workspaces = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
        workspaces: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        members: {
          select: {
            workspace: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    });

    if (workspaces) {
      return { status: 200, workspaces };
    }

    return { status: 400, workspaces: null };
  } catch (error) {
    return { status: 400, workspaces: null };
  }
};
