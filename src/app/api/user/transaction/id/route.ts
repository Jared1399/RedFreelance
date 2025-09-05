import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/apiHandler";


export const GET = apiHandler(async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const transactionId = searchParams.get("transactionId") ?? undefined;

  const gig = await prisma.transaction.findFirst({
    where: {
      id: {
        equals: transactionId
      }
    },
    include: {
      gig: true,
      tier: true,
      lifecycle: true,
    }
  });

  return NextResponse.json(gig);
});