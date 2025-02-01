import { db } from "@/libs/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type GetParamsT = {
  params: {
    userId: string;
  };
};

export async function GET(request: NextRequest, { params }: GetParamsT) {
  try {
    const userProfile = await db.user.findUnique({
      where: {
        clerkId: params.userId,
      },
      include: {
        studio: true,
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (userProfile) {
      return NextResponse.json({ success: true, data: userProfile, message: "Success" });
    }

    const clerkUser = await (await clerkClient()).users.getUser(params.userId);

    const createUser = await db.user.create({
      data: {
        clerkId: params.userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        studio: {
          create: {},
        },
        workspaces: {
          create: {
            name: `${clerkUser.firstName}'s Workspace`,
            type: "PERSONAL",
          },
        },
        subscription: {
          create: {},
        },
      },
      include: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (createUser) {
      return NextResponse.json({ success: true, data: createUser, message: "success" }, { status: 201 });
    }

    return NextResponse.json({ success: false, data: null, message: "Something went wrong!" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, data: null, message: error.message }, { status: 500 });
  }
}
