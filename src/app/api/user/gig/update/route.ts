import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { gigId, userId, categories, ...updateData } = await request.json();

  if (!gigId || !userId) {
    return NextResponse.json(
      { ok: false, error: "Gig ID and User ID are required" },
      { status: 400 }
    );
  }

  const existingGig = await prisma.gig.findFirst({
    where: { id: gigId, userId: userId }
  });

  if (!existingGig) {
    return NextResponse.json(
      { ok: false, error: "Gig not found or access denied" },
      { status: 404 }
    );
  }

  const updatePayload: Record<string, unknown> = {};

  const allowedFields = ['gigImg', 'title', 'description', 'price', 'status', 'ads', 'likeCount'];
  allowedFields.forEach(field => {
    if (updateData[field] !== undefined) {
      updatePayload[field] = updateData[field];
    }
  });

  if (categories !== undefined && categories !== "") {
    const categoryIds = categories.split(",")
      .map((c: string) => parseInt(c.trim()))
      .filter((id: number) => !isNaN(id));

    if (categoryIds.length > 0) {
      updatePayload.categories = {
        set: categoryIds.map((id: number) => ({ id }))
      };
    } else {
      updatePayload.categories = { set: [] };
    }
  }

  if (Object.keys(updatePayload).length === 0) {
    return NextResponse.json(
      { ok: false, error: "No valid fields provided to update" },
      { status: 400 }
    );
  }

  const updatedGig = await prisma.gig.update({
    where: { id: gigId },
    data: updatePayload,
    include: {
      categories: true,
      GigTier: true
    }
  });

  return NextResponse.json({
    ok: true,
    gig: updatedGig
  });
}