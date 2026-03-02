import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireSessionUserId } from "@/lib/session";

const UpdateGigTierSchema = z.object({
  tierId: z.uuid(),
  gigId: z.uuid(),
  name: z.string().optional(),
  price: z.number().optional(),
  description: z.string().optional(),
  deliveryTime: z.number().optional(),
});

export async function POST(request: Request) {
  const { userId, authenticated } = await requireSessionUserId();
  if (!authenticated) {
    return NextResponse.json(
      { ok: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const validation = UpdateGigTierSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { ok: false, error: validation.error.format() },
      { status: 400 }
    );
  }

  const { tierId, gigId, ...updateData } = validation.data;

  if (Object.keys(updateData).length === 0) {
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
    data: updateData
  });

  return NextResponse.json({
    ok: true,
    tier: updatedTier
  });
}