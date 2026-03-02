import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ConversationQuery = z.object({
  transactionId: z.uuid(),
  skip: z.coerce.number().optional().default(0),
  limit: z.coerce.number().optional().default(0)
});

const ConversationCreateBody = z.object({
  clientId: z.uuid(),
  freelancerId: z.uuid(),
  transactionId: z.uuid(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const rawParams = {
    transactionId: searchParams.get("transactionId"),
    skip: searchParams.get("skip"),
    limit: searchParams.get("limit")
  };

  const validation = ConversationQuery.safeParse(rawParams);

  if (!validation.success) {
    return NextResponse.json({ ok: false, error: validation.error.format() }, { status: 400 });
  }

  const { transactionId, skip, limit } = validation.data;

  const conversation = await prisma.conversation.findFirst({
    where: { transactionId: transactionId },
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
  const body = await request.json();
  const validation = ConversationCreateBody.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ ok: false, error: validation.error.format() }, { status: 400 });
  }

  const { clientId, freelancerId, transactionId } = validation.data;

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