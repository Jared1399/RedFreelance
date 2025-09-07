import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/apiHandler";



export const GET = apiHandler(
  async (request: Request, { params }: { params: Promise<{ name: string }> }
  ) => {
    const param = await params;

    const category = await prisma.category.findFirst({
      where: {
        name: param.name.toLowerCase()
      }
    });

    return NextResponse.json(category);
  });