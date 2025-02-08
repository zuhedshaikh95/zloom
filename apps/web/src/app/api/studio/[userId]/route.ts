import { db } from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const body = await request.json();

    const studio = await db.user.update({
      where: {
        id: params.userId,
      },
      data: {
        studio: {
          update: {
            screen: body.screen,
            mic: body.audio,
            preset: body.preset,
          },
        },
      },
    });

    if (studio) {
      return NextResponse.json({ success: true, data: studio, message: "Studio settings updated!" });
    }

    return NextResponse.json({ status: false, data: null, message: "No studio found!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, data: null, message: error.message }, { status: 500 });
  }
}
