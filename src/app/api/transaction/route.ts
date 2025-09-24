import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const transaction = await prisma.transaction.findMany();
  return NextResponse.json({ ok: true, transaction });

}