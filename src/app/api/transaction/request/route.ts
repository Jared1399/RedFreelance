import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { RequestTypeSchema, RequestStatusSchema } from "@/generated/zod";
import { requireSessionUserId } from "@/lib/session";

const TransactionRequestBody = z.object({
  daysToExtend: z.number().optional(),
  transactionId: z.uuid(),
  requestType: RequestTypeSchema,
  requestStatus: RequestStatusSchema.optional(),
});

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  const { userId, authenticated } = await requireSessionUserId();
  if (!authenticated) {
    return NextResponse.json(
      { ok: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const validation = TransactionRequestBody.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ ok: false, error: validation.error.format() }, { status: 400 });
  }

  const {
    daysToExtend,
    transactionId,
    requestType,
    requestStatus
  } = validation.data;

  // Verify user is a participant of the transaction
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    select: { freelancerId: true, clientId: true }
  });

  if (!transaction) {
    return NextResponse.json(
      { ok: false, error: "Transacción no encontrada" },
      { status: 404 }
    );
  }

  if (transaction.freelancerId !== userId && transaction.clientId !== userId) {
    return NextResponse.json(
      { ok: false, error: "No tienes permisos en esta transacción" },
      { status: 403 }
    );
  }

  const newRequest = await prisma.transactionRequest.create({
    data: {
      requesterId: userId,
      transactionId: transactionId,
      details: {
        daysToExtend
      },
      type: requestType,
      requestMsg: "",
      status: requestStatus ?? undefined
    }
  });

  return NextResponse.json({ ok: true, transactionRequest: newRequest });
}