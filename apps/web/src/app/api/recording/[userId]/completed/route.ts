import { CustomException } from "@/libs/custom-exception";
import { db } from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const body = await request.json();

    const completeProcessing = await db.video.update({
      where: {
        userId: params.userId,
        source: body.fileName,
      },
      data: {
        processing: false,
      },
    });

    if (completeProcessing) {
      console.log("/api/completed 🟢");
      return NextResponse.json({ success: true, data: completeProcessing, message: "Processing Completed!" });
    }

    throw new CustomException("Something went wrong!", 400);
  } catch (error: any) {
    return NextResponse.json({ success: false, data: null, message: error.message }, { status: 500 });
  }
}
