import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/apiHandler";


export const POST = apiHandler(async (request: Request) => {
  const {
    conversationId,
    senderId,
    text
  } = await request.json();

  const newMessage = await prisma.message.create({
    data: {
      conversationId: conversationId,
      senderId,
      text,
      metadata: { read: false }
    }
  });

  return NextResponse.json({ ok: true, newMessage }, { status: 201 });
});