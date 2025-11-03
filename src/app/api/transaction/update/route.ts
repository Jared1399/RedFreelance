import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { transactionId, nextState, completed } = await request.json();

  if (!transactionId || !nextState) {
    return NextResponse.json(
      { ok: false, error: "Datos incompletos" },
      { status: 400 }
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