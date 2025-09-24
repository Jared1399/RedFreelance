import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const transactionId = searchParams.get("transactionId");
  const skip = parseInt(searchParams.get("skip") ?? "0", 10);
  const limit = parseInt(searchParams.get("limit") ?? "0", 10);


  const conversation = await prisma.conversation.findFirst({
    where: { transactionId: transactionId! },
    include: {
      participants: true,
      messages: {
        orderBy: { createdAt: 'asc' },
        skip: skip || undefined,
        take: limit || undefined
      }
    }
  });

  return NextResponse.json({ ok: true, conversation });
};

export async function POST(request: Request) {
  const {
    clientId,
    freelancerId,
    transactionId
  } = await request.json();

  const clientParticipant = await prisma.conversationParticipant.findFirst({
    where: {
      userId: clientId
    }
  });

  if (!clientParticipant) {
    await prisma.conversationParticipant.create({
      data: {
        userId: clientId
      }
    });
  }

  const freelanceParticipant = await prisma.conversationParticipant.findFirst({
    where: {
      userId: freelancerId
    }
  });

  if (!freelanceParticipant) {
    await prisma.conversationParticipant.create({
      data: {
        userId: freelancerId
      }
    });
  }

  const existingConversation = await prisma.conversation.findFirst({
    where: {
      transactionId,
      AND: [
        { participants: { some: { userId: clientId } } },
        { participants: { some: { userId: freelancerId } } }
      ]
    },
    include: { participants: true },
  });

  let conversation = existingConversation;


  if (!conversation) {
    const participantData = clientId === freelancerId
      ? [{ userId: clientId }]
      : [{ userId: clientId }, { userId: freelancerId }];

    conversation = await prisma.conversation.create({
      data: {
        transactionId,
        participants: {
          create: participantData
        }
      },
      include: {
        participants: { include: { user: true } }
      }
    });
  }

  return NextResponse.json({ ok: true, conversation });
};