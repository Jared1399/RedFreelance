import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }
) {
  const param = await params;

  const category = await prisma.category.findFirst({
    where: {
      id: parseInt(param.id)
    }
  });

  return NextResponse.json(category);
};