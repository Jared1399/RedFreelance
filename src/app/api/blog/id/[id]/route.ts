import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const blog = await prisma.blog.findFirst({
    where: {
      id: parseInt(id),
    },
  });

  return NextResponse.json(blog);
};
