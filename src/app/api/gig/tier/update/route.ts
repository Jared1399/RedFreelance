import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { tierId, gigId, userId, ...updateData } = await request.json();

  if (!tierId || !gigId || !userId) {
    return NextResponse.json(
      { ok: false, error: "Tier ID, Gig ID and User ID are required" },
      { status: 400 }
    );
  }

  const allowedFields = [
    'name', 'price', 'description', 'deliveryTime'
  ];

  const filteredData = Object.fromEntries(
    Object.entries(updateData).filter(([key, value]) =>
      allowedFields.includes(key) && value !== undefined
    )
  );

  if (Object.keys(filteredData).length === 0) {
    return NextResponse.json(
      { ok: false, error: "No valid fields provided to update" },
      { status: 400 }
    );
  }

  const existingGigTier = await prisma.gigTier.findFirst({
    where: {
      id: tierId,
      gig: {
        id: gigId,
        userId: userId
      }
    },
    include: {
      gig: true
    }
  });

  if (!existingGigTier) {
    return NextResponse.json(
      { ok: false, error: "Tier not found or access denied" },
      { status: 404 }
    );
  }

  const updatedTier = await prisma.gigTier.update({
    where: { id: tierId },
    data: filteredData
  });

  return NextResponse.json({
    ok: true,
    tier: updatedTier
  });
}