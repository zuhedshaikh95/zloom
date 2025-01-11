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

export const createWorkspace = async (workspaceName: string) => {
  try {
    const user = await currentUser();

    if (!user) return { status: false, message: "User not found!" };

    const authorised = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (authorised && authorised.subscription?.plan === "PRO") {
      const workspace = await db.user.update({
        where: {
          clerkId: user.id,
        },
        data: {
          workspaces: {
            create: {
              name: workspaceName,
              type: "PUBLIC",
            },
          },
        },
      });

      return { status: !!workspace, message: "Workspace created!" };
    }

    return { status: false, message: "Unauthorized!" };
  } catch (error: any) {
    console.log("🔴 createWorkspace Error", error.message);
    return { status: false, message: "Something went wrong!" };
  }
};

export const createFolder = async (workspaceId: string, id: string) => {
  try {
    const isNewFolder = await db.folder.create({
      data: {
        id,
        workspaceId,
      },
    });
    return { status: true, message: "New folder created!" };
  } catch (error: any) {
    console.log("🔴 createFolder Error:", error.message);
    return { status: false, message: "Something went wrong!" };
  }
};

export const renameFolder = async (folderId: string, name: string) => {
  try {
    const folder = await db.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name,
      },
    });

    if (folder) {
      return { status: true, message: "Folder Renamed" };
    }

    return { status: false, message: "Folder does not exist" };
  } catch (error: any) {
    console.error("🔴 renameFolder Error:", error.message);
    return { status: false, message: "Something went wrong" };
  }
};

export const getFolderInfo = async (folderId: string) => {
  try {
    const folder = await db.folder.findUnique({
      where: {
        id: folderId,
      },
      select: {
        name: true,
        _count: {
          select: {
            videos: true,
          },
        },
      },
    });

    if (!folder) {
      return { status: false, folder: null };
    }

    return { status: true, folder };
  } catch (error: any) {
    console.log("🔴 getFolderInfo Error:", error.message);
    return { status: false, folder: null };
  }
};
