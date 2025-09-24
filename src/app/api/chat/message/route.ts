import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function POST(request: Request) {
  const {
    conversationId,
    senderId,
    text,
    metadata
  } = await request.json();

  const newMessage = await prisma.message.create({
    data: {
      conversationId: conversationId,
      senderId,
      text,
      metadata: { ...metadata, read: false }
    }
  });

  return NextResponse.json({ ok: true, newMessage }, { status: 201 });
};