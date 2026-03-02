import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CreateGigTierBody = z.object({
  gigId: z.uuid(),
  userId: z.uuid(),
  name: z.string(),
  price: z.number(),
  description: z.string().optional(),
  deliveryTime: z.number().optional(),
});

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
  const body = await request.json();
  const validation = CreateGigTierBody.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { ok: false, error: validation.error.format() },
      { status: 400 }
    );
  }

  const { gigId, userId, name, price, description, deliveryTime } = validation.data;

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