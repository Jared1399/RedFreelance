import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function endOfDay(baseDate: Date, daysToAdd: number): Date {
  const d = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate() + daysToAdd,
    23, 59, 59, 999
  );
  return d;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("userId");

  const transaction = await prisma.transaction.findMany({
    where: {
      OR: [
        { freelancerId: userId! },
        { clientId: userId! }
      ]
    },
    include: {
      lifecycle: true,
      tier: true,
      gig: true,
      requests: true
    }
  });

  return NextResponse.json(transaction);
};

export async function POST(req: Request) {
  const {
    tierId,
    freelancerId,
    clientId,
    gigId,
    requestDetails,
    amount,
    baseConditions
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
      commissionRate,
      expirationDate: endOfDay(new Date(), 7),
      baseConditions
    }
  });

  return NextResponse.json(newTransaction);
}; 