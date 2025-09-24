import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const {
    nextLifecycle,
    transactionId
  } = await request.json();

  const updatedTransaction = await prisma.transaction.update({
    where: {
      id: transactionId
    },
    data: {
      lifecycleId: nextLifecycle
    }
  });

  return NextResponse.json({ ok: true, updatedTransaction });
};