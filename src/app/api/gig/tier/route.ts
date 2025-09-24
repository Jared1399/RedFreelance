import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const gigId = searchParams.get("gigId") ?? undefined;


  const gig = await prisma.gigTier.findMany({
    where: {
      gigId: {
        equals: gigId
      },
    }
  });

  return NextResponse.json(gig);
};