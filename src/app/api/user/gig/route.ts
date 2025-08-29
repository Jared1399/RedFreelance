import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/apiHandler";


export const GET = apiHandler(async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("userId");

  const gig = await prisma.gig.findMany({
    where: {
      userId: { equals: userId }
    }
  });

  return NextResponse.json(gig);
});