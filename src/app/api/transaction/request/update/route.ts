import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {

  const { requestId, newState } = await request.json();

  if (!requestId || !newState) {
    return NextResponse.json(
      { ok: false, error: "Datos incompletos" },
      { status: 400 }
    );
  }

  const updatedRequest = await prisma.transactionRequest.update({
    where: {
      id: requestId
    },
    data: {
      status: newState
    }
  });

  return NextResponse.json(
    { ok: true, updatedRequest },
    { status: 200 }
  );

}