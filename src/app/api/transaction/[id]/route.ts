import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const transactionId = searchParams.get("transactionId");
  if (!transactionId) {
    return NextResponse.json(
      { ok: false, error: "Please provide transaction id" },
      { status: 404 });
  }

  const transaction = await prisma.transaction.findFirst({
    where: {
      id: {
        equals: transactionId
      }
    },
    include: {
      gig: true,
      tier: true,
      lifecycle: true,
      client: true,
      freelancer: true,
      Conversation: {
        where: {
          messages: {
            some: {}
          }
        },
        include: {
          messages: {
            select: {
              id: true,
              text: true,
              createdAt: true,
              senderId: true,
              metadata: true
            },
            orderBy: {
              createdAt: 'asc'
            }
          }
        }
      }
    }
  });

  if (!transaction) {
    return NextResponse.json(
      { ok: false, error: "Invalid transaction id" },
      { status: 404 });
  }

  return NextResponse.json(transaction);
};