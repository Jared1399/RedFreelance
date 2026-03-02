import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { RequestTypeSchema, RequestStatusSchema } from "@/generated/zod";

const TransactionRequestBody = z.object({
  daysToExtend: z.number().optional(), // Used in details
  transactionId: z.uuid(),
  userId: z.uuid(),
  requestType: RequestTypeSchema,
  requestStatus: RequestStatusSchema.optional(),
});

export async function GET() {


  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  const body = await request.json();
  const validation = TransactionRequestBody.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ ok: false, error: validation.error.format() }, { status: 400 });
  }

  const {
    daysToExtend,
    transactionId,
    userId,
    requestType,
    requestStatus
  } = validation.data;

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