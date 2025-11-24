import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {


  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  const {
    daysToExtend,
    transactionId,
    userId,
    requestType,
    requestStatus
  } = await request.json();

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