import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSessionUserId } from "@/lib/session";

export async function POST(request: Request) {
  const { userId, authenticated } = await requireSessionUserId();
  if (!authenticated) {
    return NextResponse.json(
      { ok: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  const { requestId, newState } = await request.json();

  if (!requestId || !newState) {
    return NextResponse.json(
      { ok: false, error: "Datos incompletos" },
      { status: 400 }
    );
  }

  // Verify user is a participant of the transaction linked to this request
  const existingRequest = await prisma.transactionRequest.findUnique({
    where: { id: requestId },
    include: { transaction: { select: { freelancerId: true, clientId: true } } }
  });

  if (!existingRequest) {
    return NextResponse.json(
      { ok: false, error: "Solicitud no encontrada" },
      { status: 404 }
    );
  }

  if (
    existingRequest.transaction.freelancerId !== userId &&
    existingRequest.transaction.clientId !== userId
  ) {
    return NextResponse.json(
      { ok: false, error: "No tienes permisos para modificar esta solicitud" },
      { status: 403 }
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