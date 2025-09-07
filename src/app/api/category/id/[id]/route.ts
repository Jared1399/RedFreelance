import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/apiHandler";


export const GET = apiHandler(
  async (request: Request, { params }: { params: Promise<{ id: string }> }
  ) => {
    const param = await params;

    const category = await prisma.category.findFirst({
      where: {
        id: parseInt(param.id)
      }
    });

    return NextResponse.json(category);
  });