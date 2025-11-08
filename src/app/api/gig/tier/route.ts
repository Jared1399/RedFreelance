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

export async function POST(request: Request) {
  const { gigId, userId, name, price, description, deliveryTime } = await request.json();

  if (!gigId || !userId || !name || !price) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  const existingGig = await prisma.gig.findFirst({
    where: {
      id: gigId,
      userId: userId
    }
  });

  if (!existingGig) {
    return NextResponse.json(
      { ok: false, error: "Gig not found or access denied" },
      { status: 404 }
    );
  }

  const newTier = await prisma.gigTier.create({
    data: {
      name,
      price,
      description,
      deliveryTime,
      gigId: gigId
    }
  });

  return NextResponse.json({
    ok: true,
    tier: newTier
  });
}