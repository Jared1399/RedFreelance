import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/apiHandler";

interface Params {
  params: { email: string }
}


export const GET = apiHandler(async (request: Request, { params }: Params) => {
  const param = await params;

  const user = await prisma.user.findFirst({
    where: {
      email: param.email
    },
    include: {
      followers: true,
      following: true
    }
  });

  return NextResponse.json(user);
});