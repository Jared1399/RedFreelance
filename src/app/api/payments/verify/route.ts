import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const VerifySchema = z.object({
  paymentId: z.string().min(1),
  transactionId: z.uuid(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const rawParams = {
    paymentId: searchParams.get("paymentId"),
    transactionId: searchParams.get("transactionId"),
  };

  const validation = VerifySchema.safeParse(rawParams);

  if (!validation.success) {
    return NextResponse.json(
      { ok: false, error: "Missing or invalid paymentId/transactionId" },
      { status: 400 }
    );
  }

  const { paymentId, transactionId } = validation.data;

  const transaction = await prisma.transaction.findFirst({
    where: {
      AND: [
        { id: transactionId },
        { paymentId: paymentId }
      ]
    }
  });

  if (!transaction) {
    return NextResponse.json(
      { ok: true, error: "Transaction payment does not match provided Id" }
    );
  }

  return NextResponse.json({ ok: true, transaction });
}; 