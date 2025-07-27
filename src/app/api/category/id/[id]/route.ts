import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/apiHandler";

interface Params {
  params: { id: string }
}


export const GET = apiHandler(async (request: Request, { params }: Params) => {
  const param = await params;

  const category = await prisma.category.findFirst({
    where: {
      id: parseInt(param.id)
    }
  });

  return NextResponse.json(category);
});