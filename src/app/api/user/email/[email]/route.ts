import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ email: string }> }) {
  const param = await params;

  const user = await prisma.user.findFirst({
    where: {
      email: param.email
    },
    include: {
      followers: true,
      following: true
    },
    omit: {
      passwordHash: true
    }
  });

  return NextResponse.json(user);
};