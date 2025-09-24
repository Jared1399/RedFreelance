import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const {
    userId,
    firstName,
    lastName,
    email,
    passwordHash,
    identification,
    userImg,
    usFreelancer,
    rankCommunity,
    rankPlatform,
    suscriptionStart,
    suscriptionEnd,
    isVerified,
    warningCount,
    suscriptionPlan,
    level,
    phone
  } = await request.json();

  const allowed = {
    firstName,
    lastName,
    email,
    passwordHash,
    identification,
    phone,
    userImg,
    usFreelancer,
    rankCommunity,
    rankPlatform,
    suscriptionStart,
    suscriptionEnd,
    isVerified,
    warningCount,
    suscriptionPlan,
    level
  } as Record<string, unknown>;

  const allowedEntries = Object.entries(allowed);
  const definedEntries = allowedEntries.filter(([, value]) => value !== undefined);
  const filteredData = Object.fromEntries(definedEntries);

  if (Object.keys(filteredData).length === 0) {
    return NextResponse.json({ ok: false, error: "No fields provided to update" }, { status: 400 });
  }

  const updatedTransaction = await prisma.user.update({
    where: { id: userId },
    data: filteredData
  });

  return NextResponse.json({ ok: true, updatedTransaction });
};