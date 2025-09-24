import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const name = searchParams.get("name") ?? undefined;

  const gig = await prisma.category.findMany({
    where: {
      name: {
        contains: name
      }
    }
  });

  return NextResponse.json(gig);
};