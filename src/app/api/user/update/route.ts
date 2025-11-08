import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { userId, ...updateData } = await request.json();

  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "User ID is required" },
      { status: 400 }
    );
  }

  const allowedFields = [
    'firstName', 'lastName', 'email', 'passwordHash', 'identification',
    'phone', 'userImg', 'isFreelancer', 'rankCommunity', 'rankPlatform',
    'suscriptionStart', 'suscriptionEnd', 'isVerified', 'warningCount',
    'suscriptionPlan', 'level'
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

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: filteredData
  });

  return NextResponse.json({
    ok: true,
    user: updatedUser
  });
}