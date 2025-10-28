import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const {
    transactionId,
    nextState,
    completed
  } = await request.json();

  const lifecycle = await prisma.lifecycle.findFirst({
    where: {
      name: nextState
    }
  });

  if (!lifecycle) {
    return NextResponse.json(
      { ok: false, error: "Non existent lyfecycle name" },
      { status: 404 }
    );
  }

  const newCategory = await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      lifecycleId: lifecycle.id,
      completed: completed
    }
  });

  return NextResponse.json({ ok: true, user: newCategory }, { status: 201 });
};