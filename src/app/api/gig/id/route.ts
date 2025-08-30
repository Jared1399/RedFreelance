import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/apiHandler";


export const GET = apiHandler(async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const gigId = searchParams.get("gigId");

  const gig = await prisma.gig.findFirst({
    where: {
      id: { equals: gigId! }
    }
  });

  return NextResponse.json(gig);
}); 