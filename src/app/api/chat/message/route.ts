import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSessionUserId } from "@/lib/session";


export async function POST(request: Request) {
  const { userId, authenticated } = await requireSessionUserId();
  if (!authenticated) {
    return NextResponse.json(
      { ok: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  const {
    conversationId,
    text,
    metadata
  } = await request.json();

  // Verify user is a participant of this conversation
  const participant = await prisma.conversationParticipant.findFirst({
    where: {
      conversationId,
      userId
    }
  });

  if (!participant) {
    return NextResponse.json(
      { ok: false, error: "No eres participante de esta conversación" },
      { status: 403 }
    );
  }

  const newMessage = await prisma.message.create({
    data: {
      conversationId: conversationId,
      senderId: userId,
      text,
      metadata: { ...metadata, read: false }
    }
  });

  return NextResponse.json({ ok: true, newMessage }, { status: 201 });
};