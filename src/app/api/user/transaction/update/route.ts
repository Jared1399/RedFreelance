import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function POST(request: Request) {
  const {
    nextLifecycle,
    transactionId,
    deliveryTime,
    newDelivery,
    completed
  } = await request.json();

  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId }
  });

  if (!transaction) {
    return NextResponse.json(
      { ok: false, error: "Transacción no encontrada" },
      { status: 404 }
    );
  }

  const newDueDate = new Date(transaction.expirationDate);
  newDueDate.setDate(newDueDate.getDate() + deliveryTime);

  const updatedTransaction = await prisma.transaction.update({
    where: {
      id: transactionId
    },
    data: {
      lifecycleId: nextLifecycle ? nextLifecycle : undefined,
      dueDate: deliveryTime ? newDueDate : undefined,
      expirationDate: deliveryTime ? newDueDate : undefined,
      delivery_count: newDelivery ? transaction.delivery_count + 1 : undefined,
      completed: completed,
    }
  });

  if (completed) {
    const amountToAdd = Math.trunc(
      transaction.amount.toNumber() * (1 - transaction.commissionRate)
    );
    const updateFreelancer = await prisma.user.update({
      where: { id: transaction.freelancerId },
      data: {
        balance: {
          increment: amountToAdd
        }
      }
    });

    return NextResponse.json({ ok: true, updatedTransaction, updateFreelancer });
  }

  return NextResponse.json({ ok: true, updatedTransaction });
};