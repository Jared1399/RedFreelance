import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { tx } from "@/lib/transbank";
import { z } from "zod";

const PaymentCreateSchema = z.object({
  transactionId: z.uuid(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = PaymentCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { transactionId } = validation.data;

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transacción no encontrada" }, { status: 404 });
    }

    const buyOrder = `ORD-${Math.floor(Math.random() * 10000000)}`;
    const sessionId = `S-${Date.now()}`;

    // Calculate total amount (base + commission)
    const amount = Number(transaction.amount) * (1 + Number(transaction.commissionRate));

    const returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payments/return`;

    const createResponse = await tx.create(
      buyOrder,
      sessionId,
      amount,
      returnUrl
    );

    await prisma.payment.create({
      data: {
        transactionId: transaction.id,
        kind: "WEBPAY_PLUS",
        status: "pending",
        amount: transaction.amount,
        buyOrder: buyOrder,
        sessionId: sessionId,
        token: createResponse.token,
        raw: createResponse,
      },
    });

    return NextResponse.json({
      url: createResponse.url,
      token: createResponse.token,
    });

  } catch (error) {
    console.error("Error creando pago:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}