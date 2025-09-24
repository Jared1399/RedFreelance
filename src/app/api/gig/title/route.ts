import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get("title") ?? "";
  const userId = searchParams.get("userId");


  const gig = await prisma.gig.findFirst({
    where: {
      AND: [
        { title: { equals: title } },
        { userId: { equals: userId } }
      ]
    }
  });

  return NextResponse.json(gig);
};