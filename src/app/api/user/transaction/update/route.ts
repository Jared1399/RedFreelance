import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const {
    nextLifecycle,
    transactionId,
    deliveryTime
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
      lifecycleId: nextLifecycle,
      dueDate: newDueDate,
      expirationDate: newDueDate
    }
  });

  return NextResponse.json({ ok: true, updatedTransaction });
};