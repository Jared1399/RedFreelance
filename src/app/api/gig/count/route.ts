import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
  const gigCount = await prisma.gig.aggregate({
    _count: {
      id: true
    }
  });

  return NextResponse.json(
    { ok: true, gigCount }
  );
};
