import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireSessionUserId } from "@/lib/session";

const UpdateTransactionBody = z.object({
  transactionId: z.uuid(),
  nextState: z.string(),
  completed: z.boolean().optional(),
});

export async function POST(request: Request) {
  const { userId, authenticated } = await requireSessionUserId();
  if (!authenticated) {
    return NextResponse.json(
      { ok: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const validation = UpdateTransactionBody.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { ok: false, error: validation.error.format() },
      { status: 400 }
    );
  }

  const { transactionId, nextState, completed } = validation.data;

  // Verify the user is a participant of this transaction
  const existingTransaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    select: { freelancerId: true, clientId: true }
  });

  if (!existingTransaction) {
    return NextResponse.json(
      { ok: false, error: "Transacción no encontrada" },
      { status: 404 }
    );
  }

  if (existingTransaction.freelancerId !== userId && existingTransaction.clientId !== userId) {
    return NextResponse.json(
      { ok: false, error: "No tienes permisos para modificar esta transacción" },
      { status: 403 }
    );
  }

  const lifecycle = await prisma.lifecycle.findFirst({
    where: { name: nextState }
  });

  if (!lifecycle) {
    return NextResponse.json(
      { ok: false, error: "Estado de transacción no válido" },
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
      where: { id: transactionId },
      include: {
        freelancer: true,
        client: true
      }
    });

    if (!transaction) {
      return NextResponse.json(
        { ok: false, error: "Transacción no encontrada" },
        { status: 404 }
      );
    }

    const isRefund = nextState === "refunded";
    const destinedId = isRefund ? transaction.clientId : transaction.freelancerId;

    const baseAmount = transaction.amount.toNumber();
    const amountToAdd = isRefund
      ? baseAmount * 0.9
      : Math.trunc(baseAmount * (1 - transaction.commissionRate));

    const updatedUser = await prisma.user.update({
      where: { id: destinedId },
      data: {
        balance: { increment: amountToAdd }
      }
    });

    return NextResponse.json({
      ok: true,
      message: isRefund ? "Reembolso procesado" : "Pago completado",
      amount: amountToAdd,
      user: updatedUser
    });
  }

  return NextResponse.json({
    ok: true,
    message: "Transacción actualizada",
    transaction: updatedTransaction
  }, { status: 200 });
}