import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const param = await params;

  const user = await prisma.user.findFirst({
    where: {
      id: param.id
    }
  });

  return NextResponse.json(user);
};