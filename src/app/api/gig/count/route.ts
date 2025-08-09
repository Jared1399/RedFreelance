import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/apiHandler";


export const GET = apiHandler(async () => {
  const gigCount = await prisma.gig.aggregate({
    _count: {
      id: true
    }
  });

  return NextResponse.json(
    { ok: true, gigCount }
  );
});
