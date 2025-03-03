import { CustomException } from "@/libs/custom-exception";
import { db } from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { fileName } = await request.json();

    const personalWorkspaceId = await db.user.findUnique({
      where: {
        id: params.userId,
      },
      select: {
        workspaces: {
          where: {
            type: "PERSONAL",
          },
          select: {
            id: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!personalWorkspaceId) {
      throw new CustomException("Workspace Not Found!", 404);
    }

    const startProcessingVideo = await db.workSpace.update({
      where: {
        id: personalWorkspaceId?.workspaces[0].id,
      },
      data: {
        videos: {
          create: {
            source: fileName,
            userId: params.userId,
          },
        },
      },
      select: {
        user: {
          select: {
            subscription: {
              select: {
                plan: true,
              },
            },
          },
        },
      },
    });

    if (startProcessingVideo) {
      console.log("/api/processing 🟢");
      return NextResponse.json({ success: true, data: startProcessingVideo, message: "Video Processing!" });
    }

    throw new CustomException("Something went wrong!", 400);
  } catch (error: any) {
    return NextResponse.json({ success: false, data: null, message: error.message }, { status: 500 });
  }
}
