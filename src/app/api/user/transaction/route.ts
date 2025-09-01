import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/apiHandler";


export const GET = apiHandler(async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("userId");

  const gig = await prisma.transaction.findMany({
    where: {
      freelancerId: { equals: userId! }
    },
    include: {
      lifecycle: true
    }
  });

  return NextResponse.json(gig);
});

export const POST = apiHandler(async (req: Request) => {

  const {
    tierId,
    freelancerId,
    clientId,
    gigId,
    requestDetails,
    amount
  } = await req.json();

  const commissionRate = 0.10;
  const commission = Number(amount) * commissionRate;

  const newTransaction = await prisma.transaction.create({
    data: {
      gigId,
      freelancerId,
      clientId,
      tierId,
      requestDetails,
      amount,
      commission,
      commissionRate
    }
  });

  return NextResponse.json(newTransaction);
}); 