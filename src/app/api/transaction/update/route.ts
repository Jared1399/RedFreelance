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

  const updatedTransaction = await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      lifecycleId: lifecycle.id,
      completed: completed,
    }
  });


  if (completed) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId }
    });

    if (!transaction) {
      return NextResponse.json(
        { ok: false, error: "Transacción no encontrada" },
        { status: 404 }
      );
    }
    const destinedId = nextState == "completed" ? transaction.freelancerId : transaction.clientId;

    const amountToAdd = Math.trunc(
      transaction.amount.toNumber() * (1 - transaction.commissionRate)
    );

    const updateFreelancer = await prisma.user.update({
      where: { id: destinedId },
      data: {
        balance: {
          increment: amountToAdd
        }
      }
    });

    return NextResponse.json({ ok: true, updateFreelancer });
  }

  return NextResponse.json({ ok: true, user: updatedTransaction }, { status: 201 });
};