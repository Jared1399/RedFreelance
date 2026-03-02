import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSessionUserId } from "@/lib/session";

export async function POST(request: Request) {
  const { userId, authenticated } = await requireSessionUserId();
  if (!authenticated) {
    return NextResponse.json(
      { ok: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  const updateData = await request.json();

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