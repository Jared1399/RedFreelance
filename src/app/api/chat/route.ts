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
  const { clientId, freelancerId, transactionId } = await request.json();

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

  if (existingConversation) {
    return NextResponse.json({ ok: true, conversation: existingConversation });
  }

  const conversation = await prisma.conversation.create({
    data: {
      transactionId,
      participants: {
        create: [
          { userId: clientId },
          { userId: freelancerId }
        ]
      }
    },
    include: {
      participants: { include: { user: true } }
    }
  });

  return NextResponse.json({ ok: true, conversation });
}