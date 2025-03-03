import { db } from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    // TODO: AI Agent

    const body = await request.json();
    const content = JSON.parse(body.content);

    const transcribed = await db.video.update({
      where: {
        userId: params.userId,
        source: body.fileName,
      },
      data: {
        title: content.title,
        description: content.summary,
        summary: body.transcript,
      },
    });

    if (transcribed) {
      console.log("/api/transcribe 🟢");
      return NextResponse.json({ success: true, message: "Video Transcribed!", data: transcribed });
    }

    NextResponse.json({ success: false, message: "Transcription Incomplete!", data: null }, { status: 400 });
  } catch (error: any) {
    NextResponse.json({ success: false, message: error.message, data: null }, { status: 500 });
  }
}
